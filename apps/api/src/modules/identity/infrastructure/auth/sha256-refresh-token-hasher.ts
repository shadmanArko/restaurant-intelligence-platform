import { createHash, randomBytes } from 'node:crypto';

import { RefreshTokenHasher } from '@modules/identity/domain/services/refresh-token-hasher.js';

export class Sha256RefreshTokenHasher implements RefreshTokenHasher {
  hash(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  generate(): string {
    return randomBytes(32).toString('hex');
  }
}
