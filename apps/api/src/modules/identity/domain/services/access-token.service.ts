import { BranchId, RoleId, UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export const ACCESS_TOKEN_SERVICE = Symbol('ACCESS_TOKEN_SERVICE');

export interface AccessTokenClaims {
  readonly sub: UserId;
  readonly email: string;
  readonly roles: readonly RoleId[];
  readonly branchAccess: readonly {
    readonly branchId: BranchId;
    readonly roleIds: readonly RoleId[];
  }[];
}

export interface AccessTokenService {
  issue(claims: AccessTokenClaims): string;
  verify(token: string): AccessTokenClaims;
}
