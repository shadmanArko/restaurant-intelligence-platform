import * as argon2 from 'argon2';

import { PasswordVerifier } from '@modules/identity/domain/services/password-verifier.js';
import { PasswordHash } from '@modules/identity/domain/value-objects/password-hash.js';

export class Argon2PasswordVerifier implements PasswordVerifier {
  async verify(plaintext: string, hash: PasswordHash): Promise<boolean> {
    try {
      return await argon2.verify(hash.value, plaintext);
    } catch {
      return false;
    }
  }
}
