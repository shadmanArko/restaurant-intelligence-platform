import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface BranchCreatedPayload {
  readonly name: string;
  readonly code: string;
  readonly actorId: string;
  readonly correlationId?: string;
}

export type BranchCreated = DomainEvent<BranchCreatedPayload>;

export function branchCreated(params: {
  readonly eventId: string;
  readonly branchId: string;
  readonly name: string;
  readonly code: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): BranchCreated {
  return {
    eventId: params.eventId,
    eventType: 'BranchCreated',
    eventVersion: 1,
    aggregateId: params.branchId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    causationId: params.causationId,
    payload: {
      name: params.name,
      code: params.code,
      actorId: params.actorId,
      correlationId: params.correlationId,
    },
  };
}
