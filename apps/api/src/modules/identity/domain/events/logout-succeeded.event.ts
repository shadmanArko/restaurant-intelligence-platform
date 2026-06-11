import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface LogoutSucceededPayload {
  readonly tokenId: string;
  readonly correlationId?: string;
}

export type LogoutSucceeded = DomainEvent<LogoutSucceededPayload>;

export function logoutSucceeded(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly tokenId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
}): LogoutSucceeded {
  return {
    eventId: params.eventId,
    eventType: 'LogoutSucceeded',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    payload: { tokenId: params.tokenId, correlationId: params.correlationId },
  };
}
