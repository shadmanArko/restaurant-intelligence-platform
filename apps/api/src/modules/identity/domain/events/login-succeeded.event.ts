import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface LoginSucceededPayload {
  readonly email: string;
  readonly correlationId?: string;
}

export type LoginSucceeded = DomainEvent<LoginSucceededPayload>;

export function loginSucceeded(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly email: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
}): LoginSucceeded {
  return {
    eventId: params.eventId,
    eventType: 'LoginSucceeded',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    payload: { email: params.email, correlationId: params.correlationId },
  };
}
