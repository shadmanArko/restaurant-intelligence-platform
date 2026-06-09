import { BranchId, RoleId } from '@modules/identity/domain/value-objects/identity-id.js';

export interface BranchAccessProps {
  readonly branchId: BranchId;
  readonly roleIds: readonly RoleId[];
}

export class BranchAccess {
  private constructor(
    public readonly branchId: BranchId,
    private readonly roles: Set<RoleId>,
  ) {}

  static create(props: BranchAccessProps): BranchAccess {
    if (props.branchId.trim().length === 0) {
      throw new Error('Branch access requires a branch id.');
    }

    if (props.roleIds.length === 0) {
      throw new Error('Branch access requires at least one role.');
    }

    return new BranchAccess(props.branchId, new Set(props.roleIds));
  }

  get roleIds(): readonly RoleId[] {
    return [...this.roles];
  }
}
