import { randomUUID } from 'node:crypto';

import { DomainEventPublisher } from '@shared/application/domain-event-publisher.js';

import { RefreshToken, REFRESH_TOKEN_TTL_DAYS } from '@modules/identity/domain/entities/refresh-token.js';
import { UserStatus } from '@modules/identity/domain/enums/user-status.js';
import {
  InvalidCredentialsError,
  UserNotAuthenticatableError,
} from '@modules/identity/domain/errors/authentication.errors.js';
import { loginFailed } from '@modules/identity/domain/events/login-failed.event.js';
import { loginSucceeded } from '@modules/identity/domain/events/login-succeeded.event.js';
import { REFRESH_TOKEN_REPOSITORY, RefreshTokenRepository } from '@modules/identity/domain/repositories/refresh-token.repository.js';
import { USER_REPOSITORY, UserRepository } from '@modules/identity/domain/repositories/user.repository.js';
import { ACCESS_TOKEN_SERVICE, AccessTokenService } from '@modules/identity/domain/services/access-token.service.js';
import { PASSWORD_VERIFIER, PasswordVerifier } from '@modules/identity/domain/services/password-verifier.js';
import { REFRESH_TOKEN_HASHER, RefreshTokenHasher } from '@modules/identity/domain/services/refresh-token-hasher.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';

export const LOGIN_USE_CASE_SYMBOLS = {
  USER_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  PASSWORD_VERIFIER,
  ACCESS_TOKEN_SERVICE,
  REFRESH_TOKEN_HASHER,
  DOMAIN_EVENT_PUBLISHER: Symbol('DOMAIN_EVENT_PUBLISHER'),
} as const;

export interface LoginCommand {
  readonly email: string;
  readonly password: string;
  readonly correlationId?: string;
}

export interface LoginResult {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly userId: string;
}

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly passwordVerifier: PasswordVerifier,
    private readonly accessTokenService: AccessTokenService,
    private readonly tokenHasher: RefreshTokenHasher,
    private readonly events: DomainEventPublisher,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const occurredAt = new Date();
    const email = EmailAddress.create(command.email);

    const user = await this.users.findByEmail(email);

    // User not found — emit LoginFailed with generic error (do not leak existence)
    if (user === null) {
      await this.events.publish([
        loginFailed({
          eventId: randomUUID(),
          email: email.value,
          reason: 'user_not_found',
          occurredAt,
          correlationId: command.correlationId,
        }),
      ]);
      throw new InvalidCredentialsError();
    }

    // User must be Active to authenticate
    if (user.status !== UserStatus.Active) {
      await this.events.publish([
        loginFailed({
          eventId: randomUUID(),
          email: email.value,
          reason: 'user_not_active',
          occurredAt,
          correlationId: command.correlationId,
        }),
      ]);
      throw new UserNotAuthenticatableError();
    }

    // Verify password
    const passwordHash = user.passwordHash;
    if (passwordHash === undefined) {
      await this.events.publish([
        loginFailed({
          eventId: randomUUID(),
          email: email.value,
          reason: 'invalid_password',
          occurredAt,
          correlationId: command.correlationId,
        }),
      ]);
      throw new InvalidCredentialsError();
    }

    const passwordValid = await this.passwordVerifier.verify(
      command.password,
      passwordHash,
    );

    if (!passwordValid) {
      await this.events.publish([
        loginFailed({
          eventId: randomUUID(),
          email: email.value,
          reason: 'invalid_password',
          occurredAt,
          correlationId: command.correlationId,
        }),
      ]);
      throw new InvalidCredentialsError();
    }

    // Issue access token
    const accessToken = this.accessTokenService.issue({
      sub: user.id,
      email: user.email.value,
      roles: user.roleIds,
      branchAccess: user.branchAccess.map((ba) => ({
        branchId: ba.branchId,
        roleIds: ba.roleIds,
      })),
    });

    // Issue refresh token
    const rawToken = this.tokenHasher.generate();
    const tokenHash = this.tokenHasher.hash(rawToken);
    const expiresAt = new Date(
      occurredAt.getTime() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    );

    const refreshToken = RefreshToken.issue({
      id: randomUUID(),
      userId: user.id,
      tokenHash,
      issuedAt: occurredAt,
      expiresAt,
      eventId: randomUUID(),
      correlationId: command.correlationId,
    });

    await this.refreshTokens.save(refreshToken);

    const tokenEvents = refreshToken.pullDomainEvents();

    await this.events.publish([
      loginSucceeded({
        eventId: randomUUID(),
        userId: user.id,
        email: user.email.value,
        occurredAt,
        correlationId: command.correlationId,
      }),
      ...tokenEvents,
    ]);

    return {
      accessToken,
      refreshToken: rawToken,
      userId: user.id,
    };
  }
}
