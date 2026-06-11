import { DomainEvent } from '@shared/kernel/domain-event.js';

export interface RoleRemovedPayload {
  readonly roleId: string;
  readonly branchId?: string;
  readonly actorId: string;
  readonly correlationId?: string;
}

export type RoleRemoved = DomainEvent<RoleRemovedPayload>;

export function roleRemoved(params: {
  readonly eventId: string;
  readonly userId: string;
  readonly roleId: string;
  readonly actorId: string;
  readonly occurredAt: Date;
  readonly branchId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
}): RoleRemoved {
  return {
    eventId: params.eventId,
    eventType: 'RoleRemoved',
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
