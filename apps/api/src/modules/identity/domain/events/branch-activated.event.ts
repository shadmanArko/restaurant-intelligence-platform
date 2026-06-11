import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface BranchActivatedPayload {
  readonly actorId: string;
  readonly correlationId?: string;
}

export type BranchActivated = DomainEvent<BranchActivatedPayload>;

export function branchActivated(params: {
  readonly eventId: string;
  readonly branchId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): BranchActivated {
  return {
    eventId: params.eventId,
    eventType: 'BranchActivated',
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
