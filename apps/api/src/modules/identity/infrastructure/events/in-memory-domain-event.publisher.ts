import { Injectable } from '@nestjs/common';

import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';
import { DomainEvent } from '@shared/kernel/domain-event.js';

@Injectable()
export class InMemoryDomainEventPublisher implements DomainEventPublisher {
  private readonly events: DomainEvent<object>[] = [];

  async publish(events: DomainEvent<object>[]): Promise<void> {
    this.events.push(...events);
  }

  get publishedEvents(): readonly DomainEvent<object>[] {
    return [...this.events];
  }
}
