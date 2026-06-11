import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface RoleAssignedPayload {
  readonly roleId: string;
  readonly branchId?: string;
  readonly actorId: string;
  readonly correlationId?: string;
}

export type RoleAssigned = DomainEvent<RoleAssignedPayload>;

export function roleAssigned(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly roleId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly branchId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
}): RoleAssigned {
  return {
    eventId: params.eventId,
    eventType: 'RoleAssigned',
    eventVersion: 1,
    aggregateId: params.userId,
    occurredAt: params.occurredAt,
    correlationId: params.correlationId,
    causationId: params.causationId,
    payload: {
      roleId: params.roleId,
      branchId: params.branchId,
      actorId: params.actorId,
      correlationId: params.correlationId,
    },
  };
}
