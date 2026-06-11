import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface BranchAccessRevokedPayload {
  readonly branchId: string;
  readonly actorId: string;
  readonly correlationId?: string;
}

export type BranchAccessRevoked = DomainEvent<BranchAccessRevokedPayload>;

export function branchAccessRevoked(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly branchId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}): BranchAccessRevoked {
  return {
    eventId: params.eventId,
    eventType: 'BranchAccessRevoked',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    causationId: params.causationId,
    payload: {
      branchId: params.branchId,
      actorId: params.actorId,
      correlationId: params.correlationId,
    },
  };
}
