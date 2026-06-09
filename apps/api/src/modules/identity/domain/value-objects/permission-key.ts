export class PermissionKey {
  private constructor(public readonly value: string) {}

  static create(value: string): PermissionKey {
    const normalized = value.trim();

    if (!/^[a-z]+:[a-z]+(?:-[a-z]+)*$/.test(normalized)) {
      throw new Error('Permission key must use resource:action format.');
    }

    return new PermissionKey(normalized);
  }
}
