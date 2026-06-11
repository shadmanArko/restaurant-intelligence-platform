import { DomainEvent } from '@shared/kernel/domain-event.js';

export type LoginFailedReason =
  | 'user_not_found'
  | 'invalid_password'
  | 'user_not_active';

export interface LoginFailedPayload {
  readonly email: string;
  readonly reason: LoginFailedReason;
  readonly correlationId?: string;
}

export type LoginFailed = DomainEvent<LoginFailedPayload>;

export function loginFailed(params: {
  readonly eventId: string;
  readonly email: string;
  readonly reason: LoginFailedReason;
  readonly occurredAt: Date;
  readonly correlationId?: string;
}): LoginFailed {
  return {
    eventId: params.eventId,
    eventType: 'LoginFailed',
    eventVersion: 1,
    aggregateId: params.email,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    payload: {
      email: params.email,
      reason: params.reason,
      correlationId: params.correlationId,
    },
  };
}
