import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface PasswordChangedPayload {
  readonly actorId: string;
  readonly correlationId?: string;
}

export type PasswordChanged = DomainEvent<PasswordChangedPayload>;

export function passwordChanged(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): PasswordChanged {
  return {
    eventId: params.eventId,
    eventType: 'PasswordChanged',
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
