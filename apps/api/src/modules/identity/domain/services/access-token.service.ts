import { UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export const ACCESS_TOKEN_SERVICE = Symbol('ACCESS_TOKEN_SERVICE');

/**
 * Claims embedded in the JWT access token.
 *
 * Intentionally minimal: the token proves *who* the user is, not *what* they
 * can do. Authorization decisions must be resolved against Identity at request
 * time via AuthorizationService — never against stale claims cached in a token.
 *
 * Background: embedding roles/branchAccess in the token creates a stale-read
 * window (up to 15 min) where a revoked role would still appear valid. Since
 * Identity is the source of truth, keep it that way.
 */
export interface AccessTokenClaims {
  readonly sub: UserId;
  readonly email: string;
}

export interface AccessTokenService {
  issue(claims: AccessTokenClaims): string;
  verify(token: string): AccessTokenClaims;
}
