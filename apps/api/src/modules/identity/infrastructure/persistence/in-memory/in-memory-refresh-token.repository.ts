import { RefreshToken } from '@modules/identity/domain/entities/refresh-token.js';
import { RefreshTokenRepository } from '@modules/identity/domain/repositories/refresh-token.repository.js';
import { UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  private readonly store = new Map<string, RefreshToken>();

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    for (const token of this.store.values()) {
      if (token.tokenHash === tokenHash) {
        return token;
      }
    }
    return null;
  }

  async findActiveByUserId(userId: UserId): Promise<RefreshToken[]> {
    return [...this.store.values()].filter(
      (t) => t.userId === userId && t.isValid(),
    );
  }

  async save(token: RefreshToken): Promise<void> {
    this.store.set(token.id, token);
  }

  async revokeAllForUser(userId: UserId, revokedAt: Date): Promise<void> {
    for (const token of this.store.values()) {
      if (token.userId === userId && !token.isRevoked) {
        token.revoke({ eventId: crypto.randomUUID(), occurredAt: revokedAt });
        token.pullDomainEvents(); // discard — already persisted
      }
    }
  }
}
