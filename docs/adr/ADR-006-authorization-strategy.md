# ADR-006 Authorization Strategy

Status: Accepted

## Decision

Authorization will be permission-based.

Roles are collections of permissions.

Application services must depend on authorization interfaces.

Domains must not perform permission checks.

Identity remains the source of truth.

## Permission Evaluation

Permission sources:

- Global Roles
- Branch Roles

Effective permissions are the union of both.

Branch permissions apply only within the branch.

## Consequences

Positive:

- Flexible authorization
- Supports future SaaS
- Supports franchises

Negative:

- Additional permission management complexity