import * as jwt from 'jsonwebtoken';

import {
  AccessTokenClaims,
  AccessTokenService,
} from '@modules/identity/domain/services/access-token.service.js';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes

export class JwtAccessTokenService implements AccessTokenService {
  constructor(private readonly secret: string) {}

  issue(claims: AccessTokenClaims): string {
    const payload = {
      sub: claims.sub,
      email: claims.email,
      roles: claims.roles,
      branchAccess: claims.branchAccess,
    };
    return jwt.sign(payload, this.secret, {
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      algorithm: 'HS256',
    });
  }

  verify(token: string): AccessTokenClaims {
    const decoded = jwt.verify(token, this.secret, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    return {
      sub: decoded['sub'] as string,
      email: decoded['email'] as string,
      roles: decoded['roles'] as string[],
      branchAccess: decoded['branchAccess'] as AccessTokenClaims['branchAccess'],
    };
  }
}
