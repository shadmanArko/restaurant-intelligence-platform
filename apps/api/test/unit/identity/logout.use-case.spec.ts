import { DomainEvent } from '@shared/kernel/domain-event.js';
import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';

import { RefreshToken, REFRESH_TOKEN_TTL_DAYS } from '@modules/identity/domain/entities/refresh-token.js';
import { RefreshTokenNotFoundError, RefreshTokenRevokedError } from '@modules/identity/domain/errors/authentication.errors.js';
import { RefreshTokenRepository } from '@modules/identity/domain/repositories/refresh-token.repository.js';
import { RefreshTokenHasher } from '@modules/identity/domain/services/refresh-token-hasher.js';
import { LogoutUseCase } from '@modules/identity/application/use-cases/logout.use-case.js';

const USER_ID = 'u1000000-0000-0000-0000-000000000001';
const RAW_TOKEN = 'raw-refresh-token';

class FakeTokenHasher implements RefreshTokenHasher {
  hash(raw: string): string { return `hash:${raw}`; }
  generate(): string { return RAW_TOKEN; }
}

class FakeRefreshTokens implements RefreshTokenRepository {
  private store = new Map<string, RefreshToken>();

  seed(token: RefreshToken): void { this.store.set(token.tokenHash, token); }

  async findByTokenHash(hash: string): Promise<RefreshToken | null> {
    return this.store.get(hash) ?? null;
  }
  async findActiveByUserId(): Promise<RefreshToken[]> { return []; }
  async save(token: RefreshToken): Promise<void> { this.store.set(token.tokenHash, token); }
  async revokeAllForUser(): Promise<void> {}
}

class CapturingEvents implements DomainEventPublisher {
  readonly events: DomainEvent<object>[] = [];
  async publish(e: DomainEvent<object>[]): Promise<void> { this.events.push(...e); }
}

function makeValidToken(): RefreshToken {
  const now = new Date('2030-01-01T00:00:00.000Z');
  const token = RefreshToken.issue({
    id: 'rt-1',
    userId: USER_ID,
    tokenHash: `hash:${RAW_TOKEN}`,
    issuedAt: now,
    expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_DAYS * 86400000),
    eventId: 'e-1',
  });
  token.pullDomainEvents();
  return token;
}

describe('LogoutUseCase', () => {
  it('revokes the token and emits LogoutSucceeded + RefreshTokenRevoked', async () => {
    const tokens = new FakeRefreshTokens();
    const events = new CapturingEvents();
    tokens.seed(makeValidToken());

    const useCase = new LogoutUseCase(tokens, new FakeTokenHasher(), events);
    await useCase.execute({ rawRefreshToken: RAW_TOKEN, userId: USER_ID });

    const types = events.events.map((e) => e.eventType);
    expect(types).toContain('LogoutSucceeded');
    expect(types).toContain('RefreshTokenRevoked');
  });

  it('throws RefreshTokenNotFoundError when token does not exist', async () => {
    const useCase = new LogoutUseCase(
      new FakeRefreshTokens(),
      new FakeTokenHasher(),
      new CapturingEvents(),
    );
    await expect(
      useCase.execute({ rawRefreshToken: 'nonexistent', userId: USER_ID }),
    ).rejects.toThrow(RefreshTokenNotFoundError);
  });

  it('throws RefreshTokenRevokedError when token is already revoked', async () => {
    const tokens = new FakeRefreshTokens();
    const token = makeValidToken();
    token.revoke({ eventId: 'e-2', occurredAt: new Date() });
    token.pullDomainEvents();
    tokens.seed(token);

    const useCase = new LogoutUseCase(tokens, new FakeTokenHasher(), new CapturingEvents());
    await expect(
      useCase.execute({ rawRefreshToken: RAW_TOKEN, userId: USER_ID }),
    ).rejects.toThrow(RefreshTokenRevokedError);
  });
});
