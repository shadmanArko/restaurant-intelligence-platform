import { randomUUID } from 'node:crypto';

import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';

import {
  RefreshTokenNotFoundError,
  RefreshTokenRevokedError,
} from '@modules/identity/domain/errors/authentication.errors.js';
import { logoutSucceeded } from '@modules/identity/domain/events/logout-succeeded.event.js';
import { REFRESH_TOKEN_REPOSITORY, RefreshTokenRepository } from '@modules/identity/domain/repositories/refresh-token.repository.js';
import { REFRESH_TOKEN_HASHER, RefreshTokenHasher } from '@modules/identity/domain/services/refresh-token-hasher.js';

export const LOGOUT_USE_CASE_SYMBOLS = {
  REFRESH_TOKEN_REPOSITORY,
  REFRESH_TOKEN_HASHER,
  DOMAIN_EVENT_PUBLISHER: Symbol('DOMAIN_EVENT_PUBLISHER'),
} as const;

export interface LogoutCommand {
  readonly rawRefreshToken: string;
  readonly userId: string;
  readonly correlationId?: string;
}

export class LogoutUseCase {
  constructor(
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly tokenHasher: RefreshTokenHasher,
    private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const occurredAt = new Date();
    const tokenHash = this.tokenHasher.hash(command.rawRefreshToken);

    const token = await this.refreshTokens.findByTokenHash(tokenHash);

    if (token === null) {
      throw new RefreshTokenNotFoundError();
    }

    if (token.isRevoked) {
      throw new RefreshTokenRevokedError();
    }

    token.revoke({ eventId: randomUUID(), occurredAt, correlationId: command.correlationId });
    await this.refreshTokens.save(token);

    const tokenEvents = token.pullDomainEvents();

    await this.events.publish([
      logoutSucceeded({
        eventId: randomUUID(),
        userId: command.userId,
        tokenId: token.id,
        occurredAt,
        correlationId: command.correlationId,
      }),
      ...tokenEvents,
    ]);
  }
}
