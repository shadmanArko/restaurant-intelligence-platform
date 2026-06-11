import { DomainEvent } from '@shared/kernel/domain-event.js';
import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';

import { RefreshToken } from '@modules/identity/domain/entities/refresh-token.js';
import { User } from '@modules/identity/domain/entities/user.js';
import { UserStatus } from '@modules/identity/domain/enums/user-status.js';
import { InvalidCredentialsError, UserNotAuthenticatableError } from '@modules/identity/domain/errors/authentication.errors.js';
import { RefreshTokenRepository } from '@modules/identity/domain/repositories/refresh-token.repository.js';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository.js';
import { AccessTokenClaims, AccessTokenService } from '@modules/identity/domain/services/access-token.service.js';
import { PasswordVerifier } from '@modules/identity/domain/services/password-verifier.js';
import { RefreshTokenHasher } from '@modules/identity/domain/services/refresh-token-hasher.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';
import { PasswordHash } from '@modules/identity/domain/value-objects/password-hash.js';
import { LoginUseCase } from '@modules/identity/application/use-cases/login.use-case.js';

// ── Fakes ──────────────────────────────────────────────────────────────────

class FakeUsers implements UserRepository {
  private map = new Map<string, User>();

  seed(user: User): void { this.map.set(user.email.value, user); }
  async findById(id: string): Promise<User | null> {
    return [...this.map.values()].find((u) => u.id === id) ?? null;
  }
  async findByEmail(email: EmailAddress): Promise<User | null> {
    return this.map.get(email.value) ?? null;
  }
  async save(user: User): Promise<void> { this.map.set(user.email.value, user); }
}

class FakeRefreshTokens implements RefreshTokenRepository {
  readonly saved: RefreshToken[] = [];
  async findByTokenHash(): Promise<RefreshToken | null> { return null; }
  async findActiveByUserId(): Promise<RefreshToken[]> { return []; }
  async save(token: RefreshToken): Promise<void> { this.saved.push(token); }
  async revokeAllForUser(): Promise<void> {}
}

class FakePasswordVerifier implements PasswordVerifier {
  constructor(private readonly result: boolean) {}
  async verify(): Promise<boolean> { return this.result; }
}

class FakeAccessTokenService implements AccessTokenService {
  issue(claims: AccessTokenClaims): string { return `token:${claims.sub}`; }
  verify(): AccessTokenClaims { throw new Error('not implemented'); }
}

class FakeTokenHasher implements RefreshTokenHasher {
  hash(raw: string): string { return `hash:${raw}`; }
  generate(): string { return 'raw-token-abc'; }
}

class CapturingEvents implements DomainEventPublisher {
  readonly events: DomainEvent<object>[] = [];
  async publish(events: DomainEvent<object>[]): Promise<void> { this.events.push(...events); }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function makeActiveUser(): User {
  return User.rehydrate({
    id: 'u1000000-0000-0000-0000-000000000001',
    email: EmailAddress.create('owner@example.com'),
    displayName: 'Owner',
    passwordHash: PasswordHash.fromHash('$argon2id$hashed'),
    status: UserStatus.Active,
    roleIds: [],
    branchAccess: [],
  });
}

function makeUseCase(overrides?: {
  users?: FakeUsers;
  tokens?: FakeRefreshTokens;
  verifier?: PasswordVerifier;
  events?: CapturingEvents;
}) {
  const users = overrides?.users ?? new FakeUsers();
  const tokens = overrides?.tokens ?? new FakeRefreshTokens();
  const verifier = overrides?.verifier ?? new FakePasswordVerifier(true);
  const events = overrides?.events ?? new CapturingEvents();
  const useCase = new LoginUseCase(
    users,
    tokens,
    verifier,
    new FakeAccessTokenService(),
    new FakeTokenHasher(),
    events,
  );
  return { useCase, users, tokens, events };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('LoginUseCase', () => {
  it('returns accessToken and refreshToken for valid credentials', async () => {
    const { useCase, users } = makeUseCase();
    users.seed(makeActiveUser());

    const result = await useCase.execute({ email: 'owner@example.com', password: 'secret' });

    expect(result.accessToken).toBe('token:u1000000-0000-0000-0000-000000000001');
    expect(result.refreshToken).toBe('raw-token-abc');
    expect(result.userId).toBe('u1000000-0000-0000-0000-000000000001');
  });

  it('saves a refresh token on success', async () => {
    const { useCase, users, tokens } = makeUseCase();
    users.seed(makeActiveUser());

    await useCase.execute({ email: 'owner@example.com', password: 'secret' });

    expect(tokens.saved).toHaveLength(1);
    expect(tokens.saved[0]?.tokenHash).toBe('hash:raw-token-abc');
  });

  it('emits LoginSucceeded and RefreshTokenIssued on success', async () => {
    const { useCase, users, events } = makeUseCase();
    users.seed(makeActiveUser());

    await useCase.execute({ email: 'owner@example.com', password: 'secret' });

    const types = events.events.map((e) => e.eventType);
    expect(types).toContain('LoginSucceeded');
    expect(types).toContain('RefreshTokenIssued');
  });

  it('throws InvalidCredentialsError and emits LoginFailed when user not found', async () => {
    const { useCase, events } = makeUseCase();

    await expect(
      useCase.execute({ email: 'ghost@example.com', password: 'x' }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(events.events[0]?.eventType).toBe('LoginFailed');
    expect((events.events[0]?.payload as { reason: string }).reason).toBe('user_not_found');
  });

  it('throws UserNotAuthenticatableError and emits LoginFailed for inactive user', async () => {
    const { useCase, users, events } = makeUseCase();
    const inactiveUser = User.rehydrate({
      id: 'u2', email: EmailAddress.create('inactive@example.com'),
      displayName: 'Inactive', passwordHash: PasswordHash.fromHash('hash'),
      status: UserStatus.Inactive, roleIds: [], branchAccess: [],
    });
    users.seed(inactiveUser);

    await expect(
      useCase.execute({ email: 'inactive@example.com', password: 'x' }),
    ).rejects.toThrow(UserNotAuthenticatableError);

    expect(events.events[0]?.eventType).toBe('LoginFailed');
    expect((events.events[0]?.payload as { reason: string }).reason).toBe('user_not_active');
  });

  it('throws UserNotAuthenticatableError and emits LoginFailed for suspended user', async () => {
    const { useCase, users, events } = makeUseCase();
    const suspended = User.rehydrate({
      id: 'u3', email: EmailAddress.create('suspended@example.com'),
      displayName: 'Suspended', passwordHash: PasswordHash.fromHash('hash'),
      status: UserStatus.Suspended, roleIds: [], branchAccess: [],
    });
    users.seed(suspended);

    await expect(
      useCase.execute({ email: 'suspended@example.com', password: 'x' }),
    ).rejects.toThrow(UserNotAuthenticatableError);

    expect(events.events[0]?.eventType).toBe('LoginFailed');
  });

  it('throws InvalidCredentialsError and emits LoginFailed for wrong password', async () => {
    const { useCase, users, events } = makeUseCase({
      verifier: new FakePasswordVerifier(false),
    });
    users.seed(makeActiveUser());

    await expect(
      useCase.execute({ email: 'owner@example.com', password: 'wrong' }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(events.events[0]?.eventType).toBe('LoginFailed');
    expect((events.events[0]?.payload as { reason: string }).reason).toBe('invalid_password');
  });

  it('throws InvalidCredentialsError for user with no password hash', async () => {
    const { useCase, users, events } = makeUseCase();
    const noHash = User.rehydrate({
      id: 'u4', email: EmailAddress.create('nohash@example.com'),
      displayName: 'NoHash', status: UserStatus.Active, roleIds: [], branchAccess: [],
    });
    users.seed(noHash);

    await expect(
      useCase.execute({ email: 'nohash@example.com', password: 'x' }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(events.events[0]?.eventType).toBe('LoginFailed');
  });
});
