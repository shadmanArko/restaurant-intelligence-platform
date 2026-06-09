import { User } from '@modules/identity/domain/entities/user.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';
import { UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: EmailAddress): Promise<User | null>;
  save(user: User): Promise<void>;
}
