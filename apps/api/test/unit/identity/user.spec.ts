import { BranchAccess } from '@modules/identity/domain/entities/branch-access.js';
import { User } from '@modules/identity/domain/entities/user.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';

describe('User', () => {
  it('registers a user and records a versioned domain event', () => {
    const user = User.register({
      id: '9f0fb42d-63fe-41fb-bec7-2717e3fd4de6',
      email: EmailAddress.create('Owner@Example.com'),
      displayName: 'Owner',
      roleIds: ['75d9ef27-ae5f-4ef5-8d26-aad97a02e744'],
      branchAccess: [
        BranchAccess.create({
          branchId: '71bb95ad-1410-46ab-86d8-eb5664f2fb19',
          roleIds: ['75d9ef27-ae5f-4ef5-8d26-aad97a02e744'],
        }),
      ],
      isActive: true,
      eventId: '04fd481a-880c-48b8-89c2-6b60bd5ac90b',
      occurredAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    expect(user.email.value).toBe('owner@example.com');
    expect(user.pullDomainEvents()).toEqual([
      {
        eventId: '04fd481a-880c-48b8-89c2-6b60bd5ac90b',
        eventType: 'UserRegistered',
        eventVersion: 1,
        aggregateId: '9f0fb42d-63fe-41fb-bec7-2717e3fd4de6',
        occurredAt: new Date('2026-01-01T00:00:00.000Z'),
        payload: {
          email: 'owner@example.com',
        },
      },
    ]);
  });

  it('rejects invalid branch access', () => {
    expect(() =>
      BranchAccess.create({
        branchId: '71bb95ad-1410-46ab-86d8-eb5664f2fb19',
        roleIds: [],
      }),
    ).toThrow('Branch access requires at least one role.');
  });
});
