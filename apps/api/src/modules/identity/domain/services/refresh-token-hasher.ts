export const REFRESH_TOKEN_HASHER = Symbol('REFRESH_TOKEN_HASHER');

export interface RefreshTokenHasher {
  /** Hash a raw token for storage. Deterministic: same input → same output. */
  hash(rawToken: string): string;

  /** Generate a new cryptographically secure random raw token. */
  generate(): string;
}
