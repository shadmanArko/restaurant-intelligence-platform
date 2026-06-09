import { Module } from '@nestjs/common';

import {
  DOMAIN_EVENT_PUBLISHER,
  RegisterUserUseCase,
} from '@modules/identity/application/use-cases/register-user.use-case.js';
import { USER_REPOSITORY } from '@modules/identity/domain/repositories/user.repository.js';
import { InMemoryDomainEventPublisher } from '@modules/identity/infrastructure/events/in-memory-domain-event.publisher.js';
import { DrizzleUserRepository } from '@modules/identity/infrastructure/persistence/drizzle/drizzle-user.repository.js';
import { IdentityController } from '@modules/identity/presentation/http/identity.controller.js';

@Module({
  controllers: [IdentityController],
  providers: [
    DrizzleUserRepository,
    InMemoryDomainEventPublisher,
    {
      provide: USER_REPOSITORY,
      useExisting: DrizzleUserRepository,
    },
    {
      provide: DOMAIN_EVENT_PUBLISHER,
      useExisting: InMemoryDomainEventPublisher,
    },
    {
      provide: RegisterUserUseCase,
      inject: [USER_REPOSITORY, DOMAIN_EVENT_PUBLISHER],
      useFactory: (
        users: DrizzleUserRepository,
        events: InMemoryDomainEventPublisher,
      ): RegisterUserUseCase => new RegisterUserUseCase(users, events),
    },
  ],
})
export class IdentityModule {}
