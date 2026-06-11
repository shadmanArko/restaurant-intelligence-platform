import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface BranchAccessGrantedPayload {
  readonly branchId: string;
  readonly roleIds: readonly string[];
  readonly actorId: string;
  readonly correlationId?: string;
}

export type BranchAccessGranted = DomainEvent<BranchAccessGrantedPayload>;

export function branchAccessGranted(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly branchId: string;
  readonly roleIds: readonly string[];
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): BranchAccessGranted {
  return {
    eventId: params.eventId,
    eventType: 'BranchAccessGranted',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    causationId: params.causationId,
    payload: {
      branchId: params.branchId,
      roleIds: params.roleIds,
      actorId: params.actorId,
      correlationId: params.correlationId,
    },
  };
}
