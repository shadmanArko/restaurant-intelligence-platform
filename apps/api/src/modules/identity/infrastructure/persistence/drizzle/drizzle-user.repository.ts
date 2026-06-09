import { Inject, Injectable } from '@nestjs/common';
import { eq, SQL } from 'drizzle-orm';

import { AppDatabase } from '@shared/infrastructure/database/database.module.js';
import { DRIZZLE_DB } from '@shared/infrastructure/database/database.tokens.js';

import { BranchAccess } from '@modules/identity/domain/entities/branch-access.js';
import { User } from '@modules/identity/domain/entities/user.js';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';
import { UserId } from '@modules/identity/domain/value-objects/identity-id.js';
import { branchAccess, userRoles, users } from './identity.schema.js';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(@Inject(DRIZZLE_DB) private readonly database: AppDatabase) {}

  async findById(id: UserId): Promise<User | null> {
    return this.findOne(eq(users.id, id));
  }

  async findByEmail(email: EmailAddress): Promise<User | null> {
    return this.findOne(eq(users.email, email.value));
  }

  async save(user: User): Promise<void> {
    await this.database.transaction(async (transaction) => {
      await transaction
        .insert(users)
        .values({
          id: user.id,
          email: user.email.value,
          displayName: user.displayName,
          isActive: user.isActive,
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: user.email.value,
            displayName: user.displayName,
            isActive: user.isActive,
            updatedAt: new Date(),
          },
        });

      await transaction.delete(userRoles).where(eq(userRoles.userId, user.id));
      await transaction.delete(branchAccess).where(eq(branchAccess.userId, user.id));

      if (user.roleIds.length > 0) {
        await transaction.insert(userRoles).values(
          user.roleIds.map((roleId) => ({
            userId: user.id,
            roleId,
          })),
        );
      }

      const accessRows = user.branchAccess.flatMap((access) =>
        access.roleIds.map((roleId) => ({
          userId: user.id,
          branchId: access.branchId,
          roleId,
        })),
      );

      if (accessRows.length > 0) {
        await transaction.insert(branchAccess).values(accessRows);
      }
    });
  }

  private async findOne(where: SQL<unknown>): Promise<User | null> {
    const rows = await this.database.select().from(users).where(where).limit(1);
    const userRow = rows[0];

    if (userRow === undefined) {
      return null;
    }

    const roleRows = await this.database
      .select()
      .from(userRoles)
      .where(eq(userRoles.userId, userRow.id));

    const accessRows = await this.database
      .select()
      .from(branchAccess)
      .where(eq(branchAccess.userId, userRow.id));

    const accessByBranch = new Map<string, string[]>();
    for (const accessRow of accessRows) {
      const rolesForBranch = accessByBranch.get(accessRow.branchId) ?? [];
      rolesForBranch.push(accessRow.roleId);
      accessByBranch.set(accessRow.branchId, rolesForBranch);
    }

    return User.rehydrate({
      id: userRow.id,
      email: EmailAddress.create(userRow.email),
      displayName: userRow.displayName,
      roleIds: roleRows.map((row) => row.roleId),
      branchAccess: [...accessByBranch.entries()].map(([branchId, roleIds]) =>
        BranchAccess.create({ branchId, roleIds }),
      ),
      isActive: userRow.isActive,
    });
  }
}
