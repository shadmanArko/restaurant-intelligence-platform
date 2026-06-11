import { Branch } from '@modules/identity/domain/entities/branch.js';
import { BranchStatus } from '@modules/identity/domain/enums/branch-status.js';

const BRANCH_ID = 'b1000000-0000-0000-0000-000000000001';
const ACTOR_ID = 'a0000000-0000-0000-0000-000000000001';
const EVENT_ID = 'e0000000-0000-0000-0000-000000000001';
const OCCURRED_AT = new Date('2026-01-01T00:00:00.000Z');

const baseCtx = { actorId: ACTOR_ID, eventId: EVENT_ID, occurredAt: OCCURRED_AT };

function makeBranch(): Branch {
  return Branch.create({
    id: BRANCH_ID,
    name: 'Berlin Cloud Kitchen 1',
    code: 'BCK-001',
    actorId: ACTOR_ID,
    eventId: EVENT_ID,
    occurredAt: OCCURRED_AT,
  });
}

describe('Branch', () => {
  it('creates a branch with Active status and emits BranchCreated', () => {
    const branch = makeBranch();

    expect(branch.id).toBe(BRANCH_ID);
    expect(branch.name).toBe('Berlin Cloud Kitchen 1');
    expect(branch.code).toBe('BCK-001');
    expect(branch.status).toBe(BranchStatus.Active);
    expect(branch.isActive).toBe(true);

    const events = branch.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('BranchCreated');
    expect(events[0]?.aggregateId).toBe(BRANCH_ID);
    expect((events[0]?.payload as { name: string }).name).toBe('Berlin Cloud Kitchen 1');
    expect((events[0]?.payload as { code: string }).code).toBe('BCK-001');
  });

  it('deactivates a branch and emits BranchDeactivated', () => {
    const branch = makeBranch();
    branch.pullDomainEvents();
    branch.deactivate(baseCtx);

    expect(branch.status).toBe(BranchStatus.Inactive);
    expect(branch.isActive).toBe(false);

    const events = branch.pullDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]?.eventType).toBe('BranchDeactivated');
  });

  it('activates an inactive branch and emits BranchActivated', () => {
    const branch = makeBranch();
    branch.pullDomainEvents();
    branch.deactivate(baseCtx);
    branch.pullDomainEvents();
    branch.activate(baseCtx);

    expect(branch.status).toBe(BranchStatus.Active);

    const events = branch.pullDomainEvents();
    expect(events[0]?.eventType).toBe('BranchActivated');
  });

  it('throws when deactivating an already inactive branch', () => {
    const branch = makeBranch();
    branch.deactivate(baseCtx);
    expect(() => branch.deactivate(baseCtx)).toThrow('Branch is already inactive.');
  });

  it('throws when activating an already active branch', () => {
    const branch = makeBranch();
    expect(() => branch.activate(baseCtx)).toThrow('Branch is already active.');
  });

  it('rehydrates a branch without emitting events', () => {
    const branch = Branch.rehydrate({
      id: BRANCH_ID,
      name: 'Berlin Cloud Kitchen 1',
      code: 'BCK-001',
      status: BranchStatus.Inactive,
    });

    expect(branch.status).toBe(BranchStatus.Inactive);
    expect(branch.pullDomainEvents()).toHaveLength(0);
  });

  it('throws when name is empty', () => {
    expect(() =>
      Branch.create({ id: BRANCH_ID, name: '  ', code: 'BCK-001', actorId: ACTOR_ID, eventId: EVENT_ID, occurredAt: OCCURRED_AT }),
    ).toThrow('Branch name is required.');
  });

  it('throws when code is empty', () => {
    expect(() =>
      Branch.create({ id: BRANCH_ID, name: 'Test', code: '', actorId: ACTOR_ID, eventId: EVENT_ID, occurredAt: OCCURRED_AT }),
    ).toThrow('Branch code is required.');
  });
});
