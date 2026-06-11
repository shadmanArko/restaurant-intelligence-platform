import { randomUUID } from 'node:crypto';

import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';

import { RefreshToken, REFRESH_TOKEN_TTL_DAYS } from '@modules/identity/domain/entities/refresh-token.js';
import {
  InvalidCredentialsError,
  RefreshTokenExpiredError,
  RefreshTokenRevokedError,
} from '@modules/identity/domain/errors/authentication.errors.js';
import { refreshTokenRotated } from '@modules/identity/domain/events/refresh-token-rotated.event.js';
import { REFRESH_TOKEN_REPOSITORY, RefreshTokenRepository } from '@modules/identity/domain/repositories/refresh-token.repository.js';
import { USER_REPOSITORY, UserRepository } from '@modules/identity/domain/repositories/user.repository.js';
import { ACCESS_TOKEN_SERVICE, AccessTokenService } from '@modules/identity/domain/services/access-token.service.js';
import { REFRESH_TOKEN_HASHER, RefreshTokenHasher } from '@modules/identity/domain/services/refresh-token-hasher.js';

export const REFRESH_TOKEN_USE_CASE_SYMBOLS = {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  ACCESS_TOKEN_SERVICE,
  REFRESH_TOKEN_HASHER,
  DOMAIN_EVENT_PUBLISHER: Symbol('DOMAIN_EVENT_PUBLISHER'),
} as const;

export interface RefreshTokenCommand {
  readonly rawRefreshToken: string;
  readonly correlationId?: string;
}

export interface RefreshTokenResult {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly userId: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly accessTokenService: AccessTokenService,
    private readonly tokenHasher: RefreshTokenHasher,
    private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const occurredAt = new Date();
    const tokenHash = this.tokenHasher.hash(command.rawRefreshToken);

    const oldToken = await this.refreshTokens.findByTokenHash(tokenHash);

    if (oldToken === null) {
      throw new InvalidCredentialsError();
    }

    if (oldToken.isRevoked) {
      // Presented revoked token — possible theft. Revoke all sessions.
      await this.refreshTokens.revokeAllForUser(oldToken.userId, occurredAt);
      throw new RefreshTokenRevokedError();
    }

    if (oldToken.isExpired(occurredAt)) {
      throw new RefreshTokenExpiredError();
    }

    const user = await this.users.findById(oldToken.userId);
    if (user === null) {
      throw new InvalidCredentialsError();
    }

    // JWT carries identity only — authorization is resolved at request time.
    const accessToken = this.accessTokenService.issue({
      sub: user.id,
      email: user.email.value,
    });

    oldToken.revoke({ eventId: randomUUID(), occurredAt, correlationId: command.correlationId });
    await this.refreshTokens.save(oldToken);

    const rawNewToken = this.tokenHasher.generate();
    const newTokenHash = this.tokenHasher.hash(rawNewToken);
    const expiresAt = new Date(
      occurredAt.getTime() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    const newToken = RefreshToken.issue({
      id: randomUUID(),
      userId: user.id,
      tokenHash: newTokenHash,
      issuedAt: occurredAt,
      expiresAt,
      eventId: randomUUID(),
      correlationId: command.correlationId,
    });

    await this.refreshTokens.save(newToken);

    const oldEvents = oldToken.pullDomainEvents();
    const newEvents = newToken.pullDomainEvents();

    await this.events.publish([
      refreshTokenRotated({
        eventId: randomUUID(),
        userId: user.id,
        oldTokenId: oldToken.id,
        newTokenId: newToken.id,
        expiresAt,
        occurredAt,
        correlationId: command.correlationId,
      }),
      ...oldEvents,
      ...newEvents,
    ]);

    return { accessToken, refreshToken: rawNewToken, userId: user.id };
  }
}
