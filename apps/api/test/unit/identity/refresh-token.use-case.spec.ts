import { DomainEvent } from '@shared/kernel/domain-event.js';
import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';

import { RefreshToken, REFRESH_TOKEN_TTL_DAYS } from '@modules/identity/domain/entities/refresh-token.js';
import { User } from '@modules/identity/domain/entities/user.js';
import { UserStatus } from '@modules/identity/domain/enums/user-status.js';
import {
  InvalidCredentialsError,
  RefreshTokenExpiredError,
  RefreshTokenRevokedError,
} from '@modules/identity/domain/errors/authentication.errors.js';
import { RefreshTokenRepository } from '@modules/identity/domain/repositories/refresh-token.repository.js';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository.js';
import { AccessTokenClaims, AccessTokenService } from '@modules/identity/domain/services/access-token.service.js';
import { RefreshTokenHasher } from '@modules/identity/domain/services/refresh-token-hasher.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';
import { RefreshTokenUseCase } from '@modules/identity/application/use-cases/refresh-token.use-case.js';

const USER_ID = 'u1000000-0000-0000-0000-000000000001';
const RAW_TOKEN = 'raw-refresh-token';

class FakeTokenHasher implements RefreshTokenHasher {
  hash(raw: string): string { return `hash:${raw}`; }
  generate(): string { return 'new-raw-token'; }
}

class FakeAccessTokenService implements AccessTokenService {
  issue(claims: AccessTokenClaims): string { return `token:${claims.sub}`; }
  verify(): AccessTokenClaims { throw new Error('not used'); }
}

class FakeUsers implements UserRepository {
  constructor(private readonly user: User | null = null) {}
  async findById(): Promise<User | null> { return this.user; }
  async findByEmail(): Promise<User | null> { return this.user; }
  async save(): Promise<void> {}
}

class FakeRefreshTokens implements RefreshTokenRepository {
  private store = new Map<string, RefreshToken>();
  readonly savedTokens: RefreshToken[] = [];
  revokedUserId: string | null = null;

  seed(token: RefreshToken): void { this.store.set(token.tokenHash, token); }
  async findByTokenHash(hash: string): Promise<RefreshToken | null> { return this.store.get(hash) ?? null; }
  async findActiveByUserId(): Promise<RefreshToken[]> { return []; }
  async save(token: RefreshToken): Promise<void> {
    this.store.set(token.tokenHash, token);
    this.savedTokens.push(token);
  }
  async revokeAllForUser(userId: string): Promise<void> { this.revokedUserId = userId; }
}

class CapturingEvents implements DomainEventPublisher {
  readonly events: DomainEvent<object>[] = [];
  async publish(e: DomainEvent<object>[]): Promise<void> { this.events.push(...e); }
}

function makeUser(): User {
  return User.rehydrate({
    id: USER_ID,
    email: EmailAddress.create('owner@example.com'),
    displayName: 'Owner',
    status: UserStatus.Active,
    roleIds: [],
    branchAccess: [],
  });
}

function makeValidToken(): RefreshToken {
  const now = new Date('2030-01-01T00:00:00.000Z');
  const t = RefreshToken.issue({
    id: 'rt-1',
    userId: USER_ID,
    tokenHash: `hash:${RAW_TOKEN}`,
    issuedAt: now,
    expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_DAYS * 86400000),
    eventId: 'e-1',
  });
  t.pullDomainEvents();
  return t;
}

function makeExpiredToken(): RefreshToken {
  const past = new Date('2025-01-01T00:00:00.000Z');
  const t = RefreshToken.issue({
    id: 'rt-expired',
    userId: USER_ID,
    tokenHash: `hash:${RAW_TOKEN}`,
    issuedAt: past,
    expiresAt: new Date('2025-02-01T00:00:00.000Z'),
    eventId: 'e-2',
  });
  t.pullDomainEvents();
  return t;
}

describe('RefreshTokenUseCase', () => {
  it('rotates token and returns new access + refresh tokens', async () => {
    const tokens = new FakeRefreshTokens();
    const events = new CapturingEvents();
    tokens.seed(makeValidToken());

    const useCase = new RefreshTokenUseCase(
      new FakeUsers(makeUser()),
      tokens,
      new FakeAccessTokenService(),
      new FakeTokenHasher(),
      events,
    );

    const result = await useCase.execute({ rawRefreshToken: RAW_TOKEN });

    expect(result.accessToken).toBe(`token:${USER_ID}`);
    expect(result.refreshToken).toBe('new-raw-token');
    expect(result.userId).toBe(USER_ID);
  });

  it('emits RefreshTokenRotated, RefreshTokenRevoked, RefreshTokenIssued', async () => {
    const tokens = new FakeRefreshTokens();
    const events = new CapturingEvents();
    tokens.seed(makeValidToken());

    const useCase = new RefreshTokenUseCase(
      new FakeUsers(makeUser()),
      tokens,
      new FakeAccessTokenService(),
      new FakeTokenHasher(),
      events,
    );

    await useCase.execute({ rawRefreshToken: RAW_TOKEN });

    const types = events.events.map((e) => e.eventType);
    expect(types).toContain('RefreshTokenRotated');
    expect(types).toContain('RefreshTokenRevoked');
    expect(types).toContain('RefreshTokenIssued');
  });

  it('revokes old token on rotation', async () => {
    const tokens = new FakeRefreshTokens();
    tokens.seed(makeValidToken());

    const useCase = new RefreshTokenUseCase(
      new FakeUsers(makeUser()),
      tokens,
      new FakeAccessTokenService(),
      new FakeTokenHasher(),
      new CapturingEvents(),
    );

    await useCase.execute({ rawRefreshToken: RAW_TOKEN });

    const saved = tokens.savedTokens.find((t) => t.id === 'rt-1');
    expect(saved?.isRevoked).toBe(true);
  });

  it('throws InvalidCredentialsError when token not found', async () => {
    const useCase = new RefreshTokenUseCase(
      new FakeUsers(makeUser()),
      new FakeRefreshTokens(),
      new FakeAccessTokenService(),
      new FakeTokenHasher(),
      new CapturingEvents(),
    );

    await expect(useCase.execute({ rawRefreshToken: 'unknown' })).rejects.toThrow(
      InvalidCredentialsError,
    );
  });

  it('throws RefreshTokenExpiredError for an expired token', async () => {
    const tokens = new FakeRefreshTokens();
    tokens.seed(makeExpiredToken());

    const useCase = new RefreshTokenUseCase(
      new FakeUsers(makeUser()),
      tokens,
      new FakeAccessTokenService(),
      new FakeTokenHasher(),
      new CapturingEvents(),
    );

    await expect(useCase.execute({ rawRefreshToken: RAW_TOKEN })).rejects.toThrow(
      RefreshTokenExpiredError,
    );
  });

  it('throws RefreshTokenRevokedError and revokes all user tokens on revoked token presentation', async () => {
    const tokens = new FakeRefreshTokens();
    const token = makeValidToken();
    token.revoke({ eventId: 'e-x', occurredAt: new Date() });
    token.pullDomainEvents();
    tokens.seed(token);

    const useCase = new RefreshTokenUseCase(
      new FakeUsers(makeUser()),
      tokens,
      new FakeAccessTokenService(),
      new FakeTokenHasher(),
      new CapturingEvents(),
    );

    await expect(useCase.execute({ rawRefreshToken: RAW_TOKEN })).rejects.toThrow(
      RefreshTokenRevokedError,
    );
    // All user tokens revoked (theft detection)
    expect(tokens.revokedUserId).toBe(USER_ID);
  });
});
