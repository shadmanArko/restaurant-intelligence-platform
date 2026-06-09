import { Entity } from '@shared/kernel/entity.js';

import { PermissionId, RoleId } from '@modules/identity/domain/value-objects/identity-id.js';

export interface RoleProps {
  readonly id: RoleId;
  readonly name: string;
  readonly permissionIds: readonly PermissionId[];
}

export class Role extends Entity<RoleId> {
  private constructor(
    id: RoleId,
    public readonly name: string,
    private readonly permissions: Set<PermissionId>,
  ) {
    super(id);
  }

  static create(props: RoleProps): Role {
    if (props.name.trim().length === 0) {
      throw new Error('Role name is required.');
    }

    return new Role(props.id, props.name.trim(), new Set(props.permissionIds));
  }

  get permissionIds(): readonly PermissionId[] {
    return [...this.permissions];
  }

  hasPermission(permissionId: PermissionId): boolean {
    return this.permissions.has(permissionId);
  }
}
