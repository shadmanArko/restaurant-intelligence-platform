import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface RefreshTokenRevokedPayload {
  readonly tokenId: string;
  readonly correlationId?: string;
}

export type RefreshTokenRevoked = DomainEvent<RefreshTokenRevokedPayload>;

export function refreshTokenRevoked(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly tokenId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
}): RefreshTokenRevoked {
  return {
    eventId: params.eventId,
    eventType: 'RefreshTokenRevoked',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    payload: { tokenId: params.tokenId, correlationId: params.correlationId },
  };
}
