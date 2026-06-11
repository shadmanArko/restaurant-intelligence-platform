import { RefreshToken, REFRESH_TOKEN_TTL_DAYS } from '@modules/identity/domain/entities/refresh-token.js';

const USER_ID = 'u1000000-0000-0000-0000-000000000001';
const TOKEN_HASH = 'abc123hash';
const EVENT_ID = 'e0000000-0000-0000-0000-000000000001';

function makeIssuedToken(overrides?: Partial<{ issuedAt: Date; expiresAt: Date }>): RefreshToken {
  const issuedAt = overrides?.issuedAt ?? new Date('2026-01-01T00:00:00.000Z');
  const expiresAt =
    overrides?.expiresAt ??
    new Date(issuedAt.getTime() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  return RefreshToken.issue({
    id: 'rt000000-0000-0000-0000-000000000001',
    userId: USER_ID,
    tokenHash: TOKEN_HASH,
    issuedAt,
    expiresAt,
    eventId: EVENT_ID,
  });
}

describe('RefreshToken', () => {
  it('issues a token with correct props and emits RefreshTokenIssued', () => {
    const token = makeIssuedToken();

    expect(token.userId).toBe(USER_ID);
    expect(token.tokenHash).toBe(TOKEN_HASH);
    expect(token.isRevoked).toBe(false);
    expect(token.revokedAt).toBeNull();

    const events = token.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('RefreshTokenIssued');
    expect(events[0]?.aggregateId).toBe(USER_ID);
  });

  it('isValid returns true for a fresh token', () => {
    const token = makeIssuedToken();
    expect(token.isValid(new Date('2026-01-01T00:01:00.000Z'))).toBe(true);
  });

  it('isExpired returns true when now is past expiresAt', () => {
    const issuedAt = new Date('2026-01-01T00:00:00.000Z');
    const expiresAt = new Date('2026-01-01T00:01:00.000Z');
    const token = makeIssuedToken({ issuedAt, expiresAt });

    expect(token.isExpired(new Date('2026-01-01T00:02:00.000Z'))).toBe(true);
    expect(token.isExpired(new Date('2026-01-01T00:00:30.000Z'))).toBe(false);
  });

  it('isValid returns false for an expired token', () => {
    const issuedAt = new Date('2026-01-01T00:00:00.000Z');
    const expiresAt = new Date('2026-01-01T00:01:00.000Z');
    const token = makeIssuedToken({ issuedAt, expiresAt });
    token.pullDomainEvents();

    expect(token.isValid(new Date('2026-01-02T00:00:00.000Z'))).toBe(false);
  });

  it('revokes a valid token and emits RefreshTokenRevoked', () => {
    const token = makeIssuedToken();
    token.pullDomainEvents();

    const revokedAt = new Date('2026-01-02T00:00:00.000Z');
    token.revoke({ eventId: EVENT_ID, occurredAt: revokedAt });

    expect(token.isRevoked).toBe(true);
    expect(token.revokedAt).toEqual(revokedAt);
    expect(token.isValid()).toBe(false);

    const events = token.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('RefreshTokenRevoked');
  });

  it('throws when revoking an already revoked token', () => {
    const token = makeIssuedToken();
    token.revoke({ eventId: EVENT_ID, occurredAt: new Date() });
    expect(() => token.revoke({ eventId: EVENT_ID, occurredAt: new Date() })).toThrow(
      'Refresh token is already revoked.',
    );
  });

  it('rehydrates without emitting events', () => {
    const token = RefreshToken.rehydrate({
      id: 'rt000000-0000-0000-0000-000000000001',
      userId: USER_ID,
      tokenHash: TOKEN_HASH,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 86400000),
      revokedAt: null,
    });
    expect(token.pullDomainEvents()).toHaveLength(0);
    expect(token.isRevoked).toBe(false);
  });
});
