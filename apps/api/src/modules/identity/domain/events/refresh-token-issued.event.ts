import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface RefreshTokenIssuedPayload {
  readonly tokenId: string;
  readonly expiresAt: Date;
}

export type RefreshTokenIssued = DomainEvent<RefreshTokenIssuedPayload>;

export function refreshTokenIssued(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly tokenId: string;
  readonly expiresAt: Date;
  readonly occurredAt: Date;
  readonly correlationId?: string;
}): RefreshTokenIssued {
  return {
    eventId: params.eventId,
    eventType: 'RefreshTokenIssued',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    payload: { tokenId: params.tokenId, expiresAt: params.expiresAt },
  };
}
