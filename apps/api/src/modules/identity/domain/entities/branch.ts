import { randomUUID } from 'node:crypto';

import { AggregateRoot } from '@shared/kernel/aggregate-root.js';

import { BranchStatus } from '@modules/identity/domain/enums/branch-status.js';
import { branchActivated } from '@modules/identity/domain/events/branch-activated.event.js';
import { branchCreated } from '@modules/identity/domain/events/branch-created.event.js';
import { branchDeactivated } from '@modules/identity/domain/events/branch-deactivated.event.js';
import { BranchId } from '@modules/identity/domain/value-objects/identity-id.js';

export interface BranchProps {
  readonly id: BranchId;
  readonly name: string;
  readonly code: string;
  readonly status: BranchStatus;
}

export interface CreateBranchProps {
  readonly id: BranchId;
  readonly name: string;
  readonly code: string;
  readonly actorId: string;
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}

export interface BranchCommandContext {
  readonly actorId: string;
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly causationId?: string;
}

export class Branch extends AggregateRoot<BranchId> {
  private constructor(
    id: BranchId,
    public readonly name: string,
    public readonly code: string,
    private _status: BranchStatus,
  ) {
    super(id);
  }

  get status(): BranchStatus {
    return this._status;
  }

  get isActive(): boolean {
    return this._status === BranchStatus.Active;
  }

  static rehydrate(props: BranchProps): Branch {
    Branch.assertValidProps(props);
    return new Branch(props.id, props.name, props.code, props.status);
  }

  static create(props: CreateBranchProps): Branch {
    Branch.assertValidProps(props);
    const branch = new Branch(props.id, props.name, props.code, BranchStatus.Active);
    branch.addDomainEvent(
      branchCreated({
        eventId: props.eventId,
        branchId: props.id,
        name: branch.name,
        code: branch.code,
        actorId: props.actorId,
        occurredAt: props.occurredAt,
        correlationId: props.correlationId,
        causationId: props.causationId,
      }),
    );
    return branch;
  }

  activate(ctx: BranchCommandContext): void {
    if (this._status === BranchStatus.Active) {
      throw new Error('Branch is already active.');
    }
    this._status = BranchStatus.Active;
    this.addDomainEvent(
      branchActivated({
        eventId: ctx.eventId ?? randomUUID(),
        branchId: this.id,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  deactivate(ctx: BranchCommandContext): void {
    if (this._status === BranchStatus.Inactive) {
      throw new Error('Branch is already inactive.');
    }
    this._status = BranchStatus.Inactive;
    this.addDomainEvent(
      branchDeactivated({
        eventId: ctx.eventId ?? randomUUID(),
        branchId: this.id,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  private static assertValidProps(props: { name: string; code: string }): void {
    if (props.name.trim().length === 0) {
      throw new Error('Branch name is required.');
    }
    if (props.code.trim().length === 0) {
      throw new Error('Branch code is required.');
    }
  }
}
