export interface AuditContext {
  readonly actorId: string;
  readonly branchId?: string;
  readonly correlationId?: string;
  readonly occurredAt: string;
}
