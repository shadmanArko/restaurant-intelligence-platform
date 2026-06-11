import { BranchId, UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export const AUTHORIZATION_SERVICE = Symbol('AUTHORIZATION_SERVICE');

export interface AuthorizationService {
  /**
   * Returns true if the user has the given permission.
   * If branchId is provided, branch-scoped permissions are also considered.
   */
  hasPermission(
    userId: UserId,
    permission: string,
    branchId?: BranchId,
  ): Promise<boolean>;

  /**
   * Returns effective permission keys for a user,
   * optionally scoped to a branch.
   */
  getEffectivePermissions(
    userId: UserId,
    branchId?: BranchId,
  ): Promise<readonly string[]>;
}
