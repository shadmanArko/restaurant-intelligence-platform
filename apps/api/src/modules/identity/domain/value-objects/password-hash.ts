export class PasswordHash {
  private constructor(public readonly value: string) {}

  /**
   * Creates a PasswordHash from an already-hashed string.
   * Password hashing itself is an infrastructure concern.
   * Plain text passwords must never be passed here.
   */
  static fromHash(hash: string): PasswordHash {
    const normalized = hash.trim();

    if (normalized.length === 0) {
      throw new Error('PasswordHash cannot be empty.');
    }

    return new PasswordHash(normalized);
  }

  equals(other: PasswordHash): boolean {
    return this.value === other.value;
  }
}
