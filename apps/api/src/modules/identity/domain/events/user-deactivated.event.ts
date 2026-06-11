import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface UserDeactivatedPayload {
  readonly actorId: string;
  readonly correlationId?: string;
}

export type UserDeactivated = DomainEvent<UserDeactivatedPayload>;

export function userDeactivated(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): UserDeactivated {
  return {
    eventId: params.eventId,
    eventType: 'UserDeactivated',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    causationId: params.causationId,
    payload: {
      actorId: params.actorId,
      correlationId: params.correlationId,
    },
  };
}
