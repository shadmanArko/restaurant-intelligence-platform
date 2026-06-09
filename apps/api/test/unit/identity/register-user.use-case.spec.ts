import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';
import { DomainEvent } from '@shared/kernel/domain-event.js';

import { RegisterUserUseCase } from '@modules/identity/application/use-cases/register-user.use-case.js';
import { User } from '@modules/identity/domain/entities/user.js';
import { UserRepository } from '@modules/identity/domain/repositories/user.repository.js';

class InMemoryUsers implements UserRepository {
  private readonly users = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: { value: string }): Promise<User | null> {
    return (
      [...this.users.values()].find((user) => user.email.value === email.value) ??
      null
    );
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }
}

class CapturingEvents implements DomainEventPublisher {
  readonly events: DomainEvent<object>[] = [];

  async publish(events: DomainEvent<object>[]): Promise<void> {
    this.events.push(...events);
  }
}

describe('RegisterUserUseCase', () => {
  it('persists a registered user and publishes its event', async () => {
    const users = new InMemoryUsers();
    const events = new CapturingEvents();
    const useCase = new RegisterUserUseCase(users, events);

    const result = await useCase.execute({
      email: 'manager@example.com',
      displayName: 'Manager',
      roleIds: [],
      branchAccess: [],
    });

    await expect(users.findById(result.userId)).resolves.not.toBeNull();
    expect(events.events).toHaveLength(1);
    expect(events.events[0]?.eventType).toBe('UserRegistered');
  });
});
