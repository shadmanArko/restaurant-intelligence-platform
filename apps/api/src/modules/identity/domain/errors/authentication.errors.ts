export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials.');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotAuthenticatableError extends Error {
  constructor() {
    super('Invalid credentials.');
    this.name = 'UserNotAuthenticatableError';
  }
}

export class RefreshTokenNotFoundError extends Error {
  constructor() {
    super('Refresh token not found.');
    this.name = 'RefreshTokenNotFoundError';
  }
}

export class RefreshTokenExpiredError extends Error {
  constructor() {
    super('Refresh token has expired.');
    this.name = 'RefreshTokenExpiredError';
  }
}

export class RefreshTokenRevokedError extends Error {
  constructor() {
    super('Refresh token has been revoked.');
    this.name = 'RefreshTokenRevokedError';
  }
}
