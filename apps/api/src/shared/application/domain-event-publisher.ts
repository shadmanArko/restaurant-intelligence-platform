import { DomainEvent } from '../kernel/domain-event.js';

export interface DomainEventPublisher {
  publish(events: DomainEvent<object>[]): Promise<void>;
}
