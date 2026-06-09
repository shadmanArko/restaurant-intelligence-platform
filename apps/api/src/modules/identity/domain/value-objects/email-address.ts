export class EmailAddress {
  private constructor(public readonly value: string) {}

  static create(value: string): EmailAddress {
    const normalized = value.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw new Error('Email address is invalid.');
    }

    return new EmailAddress(normalized);
  }
}
