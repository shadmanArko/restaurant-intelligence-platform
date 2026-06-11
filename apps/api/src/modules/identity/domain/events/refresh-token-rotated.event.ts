import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface RefreshTokenRotatedPayload {
  readonly oldTokenId: string;
  readonly newTokenId: string;
  readonly expiresAt: Date;
}

export type RefreshTokenRotated = DomainEvent<RefreshTokenRotatedPayload>;

export function refreshTokenRotated(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly oldTokenId: string;
  readonly newTokenId: string;
  readonly expiresAt: Date;
  readonly occurredAt: Date;
  readonly correlationId?: string;
}): RefreshTokenRotated {
  return {
    eventId: params.eventId,
    eventType: 'RefreshTokenRotated',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    payload: {
      oldTokenId: params.oldTokenId,
      newTokenId: params.newTokenId,
      expiresAt: params.expiresAt,
    },
  };
}
