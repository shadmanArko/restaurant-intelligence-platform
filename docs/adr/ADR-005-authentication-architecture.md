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
