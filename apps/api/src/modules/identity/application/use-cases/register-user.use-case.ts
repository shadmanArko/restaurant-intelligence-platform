import { randomUUID } from 'node:crypto';

import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';

import { BranchAccess } from '@modules/identity/domain/entities/branch-access.js';
import { User } from '@modules/identity/domain/entities/user.js';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';
import { BranchId, RoleId, UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export const DOMAIN_EVENT_PUBLISHER = Symbol('DOMAIN_EVENT_PUBLISHER');

export interface RegisterUserCommand {
  readonly email: string;
  readonly displayName: string;
  readonly roleIds: readonly RoleId[];
  readonly branchAccess: readonly {
    readonly branchId: BranchId;
    readonly roleIds: readonly RoleId[];
  }[];
}

export interface RegisterUserResult {
  readonly userId: UserId;
}

export class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<RegisterUserResult> {
    const email = EmailAddress.create(command.email);
    const existingUser = await this.users.findByEmail(email);

    if (existingUser !== null) {
      throw new Error('User email already exists.');
    }

    const user = User.register({
      id: randomUUID(),
      email,
      displayName: command.displayName,
      roleIds: command.roleIds,
      branchAccess: command.branchAccess.map((access) =>
        BranchAccess.create(access),
      ),
      isActive: true,
      eventId: randomUUID(),
      occurredAt: new Date(),
    });

    await this.users.save(user);
    await this.events.publish(user.pullDomainEvents());

    return { userId: user.id };
  }
}
