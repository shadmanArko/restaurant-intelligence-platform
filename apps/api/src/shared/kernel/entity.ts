export abstract class Entity<Id extends string> {
  protected constructor(public readonly id: Id) {}

  equals(entity: Entity<Id>): boolean {
    return this.id === entity.id;
  }
}
