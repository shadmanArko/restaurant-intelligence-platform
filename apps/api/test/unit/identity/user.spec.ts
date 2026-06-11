import { BranchAccess } from '@modules/identity/domain/entities/branch-access.js';
import { User } from '@modules/identity/domain/entities/user.js';
import { UserStatus } from '@modules/identity/domain/enums/user-status.js';
import { EmailAddress } from '@modules/identity/domain/value-objects/email-address.js';

const ROLE_ID = '75d9ef27-ae5f-4ef5-8d26-aad97a02e744';
const USER_ID = '9f0fb42d-63fe-41fb-bec7-2717e3fd4de6';
const BRANCH_ID = '71bb95ad-1410-46ab-86d8-eb5664f2fb19';
const ACTOR_ID = 'a0000000-0000-0000-0000-000000000001';
const EVENT_ID = '04fd481a-880c-48b8-89c2-6b60bd5ac90b';
const OCCURRED_AT = new Date('2026-01-01T00:00:00.000Z');

function makeUser(): User {
  return User.register({
    id: USER_ID,
    email: EmailAddress.create('Owner@Example.com'),
    displayName: 'Owner',
    status: UserStatus.Active,
    roleIds: [ROLE_ID],
    branchAccess: [
      BranchAccess.create({ branchId: BRANCH_ID, roleIds: [ROLE_ID] }),
    ],
    eventId: EVENT_ID,
    occurredAt: OCCURRED_AT,
  });
}

describe('User', () => {
  it('registers a user and records a versioned domain event', () => {
    const user = makeUser();

    expect(user.email.value).toBe('owner@example.com');
    expect(user.status).toBe(UserStatus.Active);
    expect(user.pullDomainEvents()).toEqual([
      {
        eventId: EVENT_ID,
        eventType: 'UserRegistered',
        eventVersion: 1,
        aggregateId: USER_ID,
        occurredAt: OCCURRED_AT,
        payload: { email: 'owner@example.com' },
      },
    ]);
  });

  it('rejects invalid branch access', () => {
    expect(() =>
      BranchAccess.create({ branchId: BRANCH_ID, roleIds: [] }),
    ).toThrow('Branch access requires at least one role.');
  });

  describe('lifecycle', () => {
    const ctx = { actorId: ACTOR_ID, eventId: EVENT_ID, occurredAt: OCCURRED_AT };

    it('deactivates an active user and emits UserDeactivated', () => {
      const user = makeUser();
      user.pullDomainEvents(); // clear register event
      user.deactivate(ctx);

      expect(user.status).toBe(UserStatus.Inactive);
      const events = user.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]?.eventType).toBe('UserDeactivated');
    });

    it('suspends an active user and emits UserSuspended', () => {
      const user = makeUser();
      user.pullDomainEvents();
      user.suspend(ctx);

      expect(user.status).toBe(UserStatus.Suspended);
      const events = user.pullDomainEvents();
      expect(events[0]?.eventType).toBe('UserSuspended');
    });

    it('reactivates a suspended user and emits UserReactivated', () => {
      const user = makeUser();
      user.pullDomainEvents();
      user.suspend(ctx);
      user.pullDomainEvents();
      user.reactivate(ctx);

      expect(user.status).toBe(UserStatus.Active);
      const events = user.pullDomainEvents();
      expect(events[0]?.eventType).toBe('UserReactivated');
    });

    it('activates an inactive user and emits UserActivated', () => {
      const user = makeUser();
      user.pullDomainEvents();
      user.deactivate(ctx);
      user.pullDomainEvents();
      user.activate(ctx);

      expect(user.status).toBe(UserStatus.Active);
      const events = user.pullDomainEvents();
      expect(events[0]?.eventType).toBe('UserActivated');
    });

    it('throws when deactivating an already inactive user', () => {
      const user = makeUser();
      user.deactivate(ctx);
      expect(() => user.deactivate(ctx)).toThrow('User is already inactive.');
    });

    it('throws when suspending an already suspended user', () => {
      const user = makeUser();
      user.suspend(ctx);
      expect(() => user.suspend(ctx)).toThrow('User is already suspended.');
    });
  });

  describe('role assignment', () => {
    const NEW_ROLE_ID = 'cc000000-0000-0000-0000-000000000001';
    const ctx = { actorId: ACTOR_ID, eventId: EVENT_ID, occurredAt: OCCURRED_AT };

    it('assigns a new role and emits RoleAssigned', () => {
      const user = makeUser();
      user.pullDomainEvents();
      user.assignRole(NEW_ROLE_ID, ctx);

      expect(user.hasRole(NEW_ROLE_ID)).toBe(true);
      const events = user.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]?.eventType).toBe('RoleAssigned');
      expect((events[0]?.payload as { roleId: string }).roleId).toBe(NEW_ROLE_ID);
    });

    it('removes an existing role and emits RoleRemoved', () => {
      const user = makeUser();
      user.pullDomainEvents();
      user.removeRole(ROLE_ID, ctx);

      expect(user.hasRole(ROLE_ID)).toBe(false);
      const events = user.pullDomainEvents();
      expect(events[0]?.eventType).toBe('RoleRemoved');
    });

    it('throws when assigning a role already assigned', () => {
      const user = makeUser();
      expect(() => user.assignRole(ROLE_ID, ctx)).toThrow('already assigned');
    });

    it('throws when removing a role not assigned', () => {
      const user = makeUser();
      expect(() => user.removeRole(NEW_ROLE_ID, ctx)).toThrow('not assigned');
    });
  });

  describe('branch access', () => {
    const NEW_BRANCH_ID = 'bb000000-0000-0000-0000-000000000001';
    const ctx = { actorId: ACTOR_ID, eventId: EVENT_ID, occurredAt: OCCURRED_AT };

    it('grants branch access and emits BranchAccessGranted', () => {
      const user = makeUser();
      user.pullDomainEvents();
      const access = BranchAccess.create({ branchId: NEW_BRANCH_ID, roleIds: [ROLE_ID] });
      user.grantBranchAccess(access, ctx);

      expect(user.hasBranchAccess(NEW_BRANCH_ID)).toBe(true);
      const events = user.pullDomainEvents();
      expect(events[0]?.eventType).toBe('BranchAccessGranted');
    });

    it('revokes branch access and emits BranchAccessRevoked', () => {
      const user = makeUser();
      user.pullDomainEvents();
      user.revokeBranchAccess(BRANCH_ID, ctx);

      expect(user.hasBranchAccess(BRANCH_ID)).toBe(false);
      const events = user.pullDomainEvents();
      expect(events[0]?.eventType).toBe('BranchAccessRevoked');
    });

    it('throws when revoking access for a branch the user has no access to', () => {
      const user = makeUser();
      expect(() => user.revokeBranchAccess('nonexistent-branch', ctx)).toThrow(
        'does not have access',
      );
    });
  });
});
