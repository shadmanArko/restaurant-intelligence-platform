import { PasswordHash } from '@modules/identity/domain/value-objects/password-hash.js';

export const PASSWORD_VERIFIER = Symbol('PASSWORD_VERIFIER');

export interface PasswordVerifier {
  verify(plaintext: string, hash: PasswordHash): Promise<boolean>;
}
