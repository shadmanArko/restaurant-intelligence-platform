import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface UserSuspendedPayload {
  readonly actorId: string;
  readonly correlationId?: string;
}

export type UserSuspended = DomainEvent<UserSuspendedPayload>;

export function userSuspended(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): UserSuspended {
  return {
    eventId: params.eventId,
    eventType: 'UserSuspended',
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
