import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface BranchDeactivatedPayload {
  readonly actorId: string;
  readonly correlationId?: string;
}

export type BranchDeactivated = DomainEvent<BranchDeactivatedPayload>;

export function branchDeactivated(params: {
  readonly eventId: string;
  readonly branchId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): BranchDeactivated {
  return {
    eventId: params.eventId,
    eventType: 'BranchDeactivated',
    eventVersion: 1,
    aggregateId: params.branchId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    causationId: params.causationId,
    payload: {
      actorId: params.actorId,
      correlationId: params.correlationId,
    },
  };
}
