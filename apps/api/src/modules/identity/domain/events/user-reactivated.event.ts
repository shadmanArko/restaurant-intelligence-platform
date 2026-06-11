import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface UserReactivatedPayload {
  readonly actorId: string;
  readonly correlationId?: string;
}

export type UserReactivated = DomainEvent<UserReactivatedPayload>;

export function userReactivated(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): UserReactivated {
  return {
    eventId: params.eventId,
    eventType: 'UserReactivated',
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
