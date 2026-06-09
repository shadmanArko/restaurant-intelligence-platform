import { randomUUID } from 'node:crypto';

export class UniqueEntityId {
  private constructor(public readonly value: string) {}

  static create(value: string = randomUUID()): UniqueEntityId {
    if (value.trim().length === 0) {
      throw new Error('Unique entity id is required.');
    }

    return new UniqueEntityId(value);
  }

  toString(): string {
    return this.value;
  }
}
