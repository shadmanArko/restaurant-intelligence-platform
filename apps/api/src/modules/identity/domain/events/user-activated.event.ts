import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface UserActivatedPayload {
  readonly actorId: string;
  readonly correlationId?: string;
}

export type UserActivated = DomainEvent<UserActivatedPayload>;

export function userActivated(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): UserActivated {
  return {
    eventId: params.eventId,
    eventType: 'UserActivated',
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
