# ADR-005: Authentication Architecture

Status: Accepted

Date: 2026-06-11

## Context

The platform requires secure authentication for internal users.

The system must support:

* Branch-based authorization
* Future MFA
* Future OAuth
* Future SaaS deployment

Authentication must remain independent from operational domains.

---

## Decision

Authentication will use:

* Email
* Password
* JWT Access Tokens
* Refresh Tokens

Passwords will be hashed using Argon2.

Refresh Tokens will be stored hashed.

---

## Access Tokens

Format:

JWT

Lifetime:

15 minutes

Purpose:

Authentication proof.

Access Tokens are stateless.

---

## Refresh Tokens

Lifetime:

30 days

Purpose:

Session continuation.

Refresh Tokens are persisted.

Refresh Tokens support:

* Revocation
* Rotation
* Auditability

---

## Authorization Relationship

Authentication verifies identity.

Authorization verifies permissions.

Authentication must not contain business permission logic.

Identity remains the source of truth for authorization.

---

## Security Decisions

Argon2 chosen for password hashing.

Reasons:

* Memory hard
* Resistant to GPU attacks
* Industry best practice

---

## Consequences

Positive:

* Strong security
* Future extensibility
* Clear separation of concerns

Negative:

* Additional token management complexity
* Refresh token persistence required

---

## Amendment: Lean JWT Claims

Date: 2026-06-11

Access tokens contain only `sub` (UserId) and `email`.

Roles and branch access are excluded from the token.

Rationale:

Embedding roles in a stateless JWT creates a stale-read window equal to the
token lifetime (15 minutes). During that window a revoked role would still
appear authorized. Identity is the source of truth; authorization decisions
must be resolved against Identity at request time via `AuthorizationService`.

When cached permission claims become necessary (high-throughput, multi-region
SaaS), introduce a short-lived permission cache invalidated by Identity domain
events — not by inflating the JWT payload.
