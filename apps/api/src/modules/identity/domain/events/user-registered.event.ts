import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface UserRegisteredPayload {
  readonly email: string;
}

export type UserRegistered = DomainEvent<UserRegisteredPayload>;

export function userRegistered(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly email: string;
  readonly occurredAt: Date;
}): UserRegistered {
  return {
    eventId: params.eventId,
    eventType: 'UserRegistered',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    payload: {
      email: params.email,
    },
  };
}
