import { AggregateRoot } from '@shared/kernel/aggregate-root.js';

import { refreshTokenIssued } from '@modules/identity/domain/events/refresh-token-issued.event.js';
import { refreshTokenRevoked } from '@modules/identity/domain/events/refresh-token-revoked.event.js';
import { RefreshTokenId, UserId } from '@modules/identity/domain/value-objects/identity-id.js';

export const REFRESH_TOKEN_TTL_DAYS = 30;

export interface RefreshTokenProps {
  readonly id: RefreshTokenId;
  readonly userId: UserId;
  readonly tokenHash: string;
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
}

export interface IssueRefreshTokenProps {
  readonly id: RefreshTokenId;
  readonly userId: UserId;
  readonly tokenHash: string;
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly eventId: string;
  readonly correlationId?: string;
}

export class RefreshToken extends AggregateRoot<RefreshTokenId> {
  private constructor(
    id: RefreshTokenId,
    public readonly userId: UserId,
    public readonly tokenHash: string,
    public readonly issuedAt: Date,
    public readonly expiresAt: Date,
    private _revokedAt: Date | null,
  ) {
    super(id);
  }

  get revokedAt(): Date | null {
    return this._revokedAt;
  }

  get isRevoked(): boolean {
    return this._revokedAt !== null;
  }

  isExpired(now: Date = new Date()): boolean {
    return now > this.expiresAt;
  }

  isValid(now: Date = new Date()): boolean {
    return !this.isRevoked && !this.isExpired(now);
  }

  revoke(params: {
    readonly eventId: string;
    readonly occurredAt: Date;
    readonly correlationId?: string;
  }): void {
    if (this.isRevoked) {
      throw new Error('Refresh token is already revoked.');
    }
    this._revokedAt = params.occurredAt;
    this.addDomainEvent(
      refreshTokenRevoked({
        eventId: params.eventId,
        userId: this.userId,
        tokenId: this.id,
        occurredAt: params.occurredAt,
        correlationId: params.correlationId,
      }),
    );
  }

  static issue(props: IssueRefreshTokenProps): RefreshToken {
    const token = new RefreshToken(
      props.id,
      props.userId,
      props.tokenHash,
      props.issuedAt,
      props.expiresAt,
      null,
    );
    token.addDomainEvent(
      refreshTokenIssued({
        eventId: props.eventId,
        userId: props.userId,
        tokenId: props.id,
        expiresAt: props.expiresAt,
        occurredAt: props.issuedAt,
        correlationId: props.correlationId,
      }),
    );
    return token;
  }

  static rehydrate(props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(
      props.id,
      props.userId,
      props.tokenHash,
      props.issuedAt,
      props.expiresAt,
      props.revokedAt,
    );
  }
}
