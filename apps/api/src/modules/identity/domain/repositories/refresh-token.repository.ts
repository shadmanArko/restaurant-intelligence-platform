import { RefreshToken } from '@modules/identity/domain/entities/refresh-token.js';
import { UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenRepository {
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  findActiveByUserId(userId: UserId): Promise<RefreshToken[]>;
  save(token: RefreshToken): Promise<void>;
  revokeAllForUser(userId: UserId, revokedAt: Date): Promise<void>;
}
