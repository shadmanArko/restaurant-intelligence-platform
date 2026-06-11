import { randomUUID } from 'node:crypto';

import { AggregateRoot } from '@shared/kernel/aggregate-root.js';

import { BranchAccess } from '@modules/identity/domain/entities/branch-access.js';
import { UserStatus } from '@modules/identity/domain/enums/user-status.js';
import { branchAccessGranted } from '@modules/identity/domain/events/branch-access-granted.event.js';
import { branchAccessRevoked } from '@modules/identity/domain/events/branch-access-revoked.event.js';
import { passwordChanged } from '@modules/identity/domain/events/password-changed.event.js';
import { roleAssigned } from '@modules/identity/domain/events/role-assigned.event.js';
import { roleRemoved } from '@modules/identity/domain/events/role-removed.event.js';
import { userActivated } from '@modules/identity/domain/events/user-activated.event.js';
import { userDeactivated } from '@modules/identity/domain/events/user-deactivated.event.js';
import { userReactivated } from '@modules/identity/domain/events/user-reactivated.event.js';
import { userRegistered } from '@modules/identity/domain/events/user-registered.event.js';
import { userSuspended } from '@modules/identity/domain/events/user-suspended.event.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';
import { BranchId, RoleId, UserId } from '@modules/identity/domain/value-objects/identity-id.js';
import { PasswordHash } from '@modules/identity/domain/value-objects/password-hash.js';

export interface UserProps {
  readonly id: UserId;
  readonly email: EmailAddress;
  readonly displayName: string;
  readonly passwordHash?: PasswordHash;
  readonly status: UserStatus;
  readonly roleIds: readonly RoleId[];
  readonly branchAccess: readonly BranchAccess[];
}

export interface RegisterUserProps extends UserProps {
  readonly eventId: string;
  readonly occurredAt: Date;
}

export interface UserCommandContext {
  readonly actorId: string;
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly branchId?: string;
  readonly correlationId?: string;
  readonly causationId?: string;
}

export class User extends AggregateRoot<UserId> {
  private constructor(
    id: UserId,
    public readonly email: EmailAddress,
    public readonly displayName: string,
    private _passwordHash: PasswordHash | undefined,
    private _status: UserStatus,
    private readonly roles: Set<RoleId>,
    private readonly access: Map<BranchId, BranchAccess>,
  ) {
    super(id);
  }

  get status(): UserStatus {
    return this._status;
  }

  get passwordHash(): PasswordHash | undefined {
    return this._passwordHash;
  }

  get roleIds(): readonly RoleId[] {
    return [...this.roles];
  }

  get branchAccess(): readonly BranchAccess[] {
    return [...this.access.values()];
  }

  get isActive(): boolean {
    return this._status === UserStatus.Active;
  }

  hasRole(roleId: RoleId): boolean {
    return this.roles.has(roleId);
  }

  hasBranchAccess(branchId: BranchId): boolean {
    return this.access.has(branchId);
  }

  getBranchAccess(branchId: BranchId): BranchAccess | undefined {
    return this.access.get(branchId);
  }

  // --- Lifecycle ---

  activate(ctx: UserCommandContext): void {
    if (this._status === UserStatus.Active) {
      throw new Error('User is already active.');
    }
    this._status = UserStatus.Active;
    this.addDomainEvent(
      userActivated({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  deactivate(ctx: UserCommandContext): void {
    if (this._status === UserStatus.Inactive) {
      throw new Error('User is already inactive.');
    }
    this._status = UserStatus.Inactive;
    this.addDomainEvent(
      userDeactivated({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  suspend(ctx: UserCommandContext): void {
    if (this._status === UserStatus.Suspended) {
      throw new Error('User is already suspended.');
    }
    this._status = UserStatus.Suspended;
    this.addDomainEvent(
      userSuspended({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  reactivate(ctx: UserCommandContext): void {
    if (this._status === UserStatus.Active) {
      throw new Error('User is already active.');
    }
    this._status = UserStatus.Active;
    this.addDomainEvent(
      userReactivated({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  // --- Password ---

  changePassword(newHash: PasswordHash, ctx: UserCommandContext): void {
    this._passwordHash = newHash;
    this.addDomainEvent(
      passwordChanged({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  // --- Role assignment ---

  assignRole(roleId: RoleId, ctx: UserCommandContext): void {
    if (this.roles.has(roleId)) {
      throw new Error(`Role ${roleId} is already assigned to this user.`);
    }
    this.roles.add(roleId);
    this.addDomainEvent(
      roleAssigned({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        roleId,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        branchId: ctx.branchId,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  removeRole(roleId: RoleId, ctx: UserCommandContext): void {
    if (!this.roles.has(roleId)) {
      throw new Error(`Role ${roleId} is not assigned to this user.`);
    }
    this.roles.delete(roleId);
    this.addDomainEvent(
      roleRemoved({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        roleId,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        branchId: ctx.branchId,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  // --- Branch access ---

  grantBranchAccess(
    branchAccess: BranchAccess,
    ctx: UserCommandContext,
  ): void {
    this.access.set(branchAccess.branchId, branchAccess);
    this.addDomainEvent(
      branchAccessGranted({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        branchId: branchAccess.branchId,
        roleIds: branchAccess.roleIds,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  revokeBranchAccess(branchId: BranchId, ctx: UserCommandContext): void {
    if (!this.access.has(branchId)) {
      throw new Error(`User does not have access to branch ${branchId}.`);
    }
    this.access.delete(branchId);
    this.addDomainEvent(
      branchAccessRevoked({
        eventId: ctx.eventId ?? randomUUID(),
        userId: this.id,
        branchId,
        actorId: ctx.actorId,
        occurredAt: ctx.occurredAt,
        correlationId: ctx.correlationId,
        causationId: ctx.causationId,
      }),
    );
  }

  // --- Factories ---

  static rehydrate(props: UserProps): User {
    return User.build(props);
  }

  static register(props: RegisterUserProps): User {
    const user = User.build(props);
    user.addDomainEvent(
      userRegistered({
        eventId: props.eventId,
        userId: props.id,
        email: props.email.value,
        occurredAt: props.occurredAt,
      }),
    );
    return user;
  }

  private static build(props: UserProps): User {
    if (props.displayName.trim().length === 0) {
      throw new Error('User display name is required.');
    }

    const accessMap = new Map<BranchId, BranchAccess>(
      props.branchAccess.map((a) => [a.branchId, a]),
    );

    return new User(
      props.id,
      props.email,
      props.displayName.trim(),
      props.passwordHash,
      props.status,
      new Set(props.roleIds),
      accessMap,
    );
  }
}
