import { AggregateRoot } from '@shared/kernel/aggregate-root.js';

import { BranchAccess } from '@modules/identity/domain/entities/branch-access.js';
import { userRegistered } from '@modules/identity/domain/events/user-registered.event.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';
import { RoleId, UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export interface UserProps {
  readonly id: UserId;
  readonly email: EmailAddress;
  readonly displayName: string;
  readonly roleIds: readonly RoleId[];
  readonly branchAccess: readonly BranchAccess[];
  readonly isActive: boolean;
}

export interface RegisterUserProps extends UserProps {
  readonly eventId: string;
  readonly occurredAt: Date;
}

export class User extends AggregateRoot<UserId> {
  private constructor(
    id: UserId,
    public readonly email: EmailAddress,
    public readonly displayName: string,
    private readonly roles: Set<RoleId>,
    private readonly access: readonly BranchAccess[],
    public readonly isActive: boolean,
  ) {
    super(id);
  }

  static rehydrate(props: UserProps): User {
    return User.create(props);
  }

  static register(props: RegisterUserProps): User {
    const user = User.create(props);
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

  private static create(props: UserProps): User {
    if (props.displayName.trim().length === 0) {
      throw new Error('User display name is required.');
    }

    return new User(
      props.id,
      props.email,
      props.displayName.trim(),
      new Set(props.roleIds),
      [...props.branchAccess],
      props.isActive,
    );
  }

  get roleIds(): readonly RoleId[] {
    return [...this.roles];
  }

  get branchAccess(): readonly BranchAccess[] {
    return [...this.access];
  }

  hasRole(roleId: RoleId): boolean {
    return this.roles.has(roleId);
  }
}
