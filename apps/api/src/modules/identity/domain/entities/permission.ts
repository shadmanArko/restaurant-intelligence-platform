import { Entity } from '@shared/kernel/entity.js';

import { PermissionId } from '@modules/identity/domain/value-objects/identity-id.js';
import { PermissionKey } from '@modules/identity/domain/value-objects/permission-key.js';

export interface PermissionProps {
  readonly id: PermissionId;
  readonly key: PermissionKey;
  readonly description: string;
}

export class Permission extends Entity<PermissionId> {
  private constructor(
    id: PermissionId,
    public readonly key: PermissionKey,
    public readonly description: string,
  ) {
    super(id);
  }

  static create(props: PermissionProps): Permission {
    if (props.description.trim().length === 0) {
      throw new Error('Permission description is required.');
    }

    return new Permission(props.id, props.key, props.description.trim());
  }
}
