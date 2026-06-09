import { DomainEvent } from './domain-event.js';
import { Entity } from './entity.js';

export abstract class AggregateRoot<Id extends string> extends Entity<Id> {
  private readonly domainEvents: DomainEvent<object>[] = [];

  protected addDomainEvent(event: DomainEvent<object>): void {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent<object>[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}
