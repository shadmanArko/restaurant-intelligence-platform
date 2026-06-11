# ADR-003: Identity Domain

Status: Accepted

Date: 2026-06-09

## Context

The Restaurant Intelligence Platform requires authentication, authorization, branch access control, and auditability.

Every action performed within the platform must be attributable to an actor.

The platform must support:

* Cloud Kitchens
* Restaurants
* Multiple Branches
* Franchises
* Future SaaS Deployment

Identity must be designed as a core domain because every operational domain depends on it.

Examples:

* Inventory adjustments
* Recipe changes
* Purchase approvals
* Accounting entries
* Production batch creation

must all be traceable to an actor.

---

## Decision

The Identity Domain owns:

* Users
* Roles
* Permissions
* Branches
* Branch Access

Identity is responsible for:

* Authentication
* Authorization
* Access Control
* Audit Attribution
* Actor Modeling

Identity is not responsible for business operations.

---

## Domain Ownership

### Identity Owns

User

Role

Permission

Branch

BranchAccess

Authentication

Authorization

Audit Attribution

### Identity Does Not Own

Customer

Supplier

Employee Records

Accounting Data

Inventory Data

Orders

Production

Recipes

Menu

These belong to their respective domains.

---

## User Aggregate

User is an Aggregate Root.

Properties:

* UserId
* Email
* PasswordHash
* DisplayName
* Status
* BranchAccess
* CreatedAt
* UpdatedAt

Status:

* Active
* Inactive
* Suspended

Rules:

* User email must be unique.
* Suspended users cannot authenticate.
* Inactive users cannot authenticate until reactivated.
* PasswordHash must only contain a one-way password hash.
* User lifecycle changes must emit auditable domain events.
* User role changes must emit auditable domain events.
* User branch access changes must emit auditable domain events.

A User may belong to multiple branches.

A User may have different roles in different branches.

---

## Role Aggregate

Role is an Aggregate Root.

Examples:

* SuperAdmin
* Owner
* BranchManager
* KitchenManager
* KitchenStaff
* Accountant
* CustomerSupport

Roles are collections of permissions.

Role assignments may be:

* Platform-level
* Branch-scoped

Branch-scoped roles are preferred for operational permissions.

Global roles should be reserved for platform administration.

Only SuperAdmin can create or assign SuperAdmin users.

---

## Permission

Permission represents a capability.

Examples:

* users.manage
* branches.manage
* inventory.view
* inventory.adjust
* recipes.edit
* accounting.view
* accounting.post
* analytics.view

Permissions are immutable identifiers.

Permission keys use dotted business capability format.

Permission meaning must not change after creation.

---

## Branch Aggregate

Branch represents a business location.

Examples:

* Berlin Cloud Kitchen 1
* Berlin Cloud Kitchen 2
* Berlin Restaurant 1

Properties:

* BranchId
* Name
* Code
* Status

Status:

* Active
* Inactive

Rules:

* Branch code must be unique.
* Inactive branches cannot receive new operational actions.
* Branch status changes must be auditable.

---

## Branch Access

BranchAccess defines:

User
→ Branch
→ Roles

A user may have different roles in different branches.

Example:

User:
Shadman

Branch A:
Owner

Branch B:
KitchenManager

Rules:

* BranchAccess must contain at least one role.
* BranchAccess grants and revocations must emit auditable events.
* Submitted branch access data must be authorized against the actor performing the change.

---

## Authentication Strategy

Version 1:

* Email + Password
* Access Token
* Refresh Token

Password hashing:

* Argon2 is required.
* Password hashing is an infrastructure concern behind an application abstraction.
* Plain text passwords must never be stored, logged, or published in events.

Token storage:

* Access tokens must be short-lived.
* Refresh tokens must be stored securely.
* Refresh token rotation should be supported.

Version 2:

* MFA
* Google OAuth
* Microsoft OAuth

Future:

* SSO
* API Keys
* Service Accounts
* Machine Users
* AI Agents

---

## Authorization Strategy

Authorization determines whether an actor can perform an action.

Authorization decisions should consider:

* Actor UserId
* BranchId where applicable
* Permission Key
* Target Resource where applicable

Rules:

* Authorization checks must be explicit in application workflows.
* Submitted roleIds must never be trusted without actor authorization.
* Operational modules must not bypass Identity authorization by reading Identity persistence internals.
* Operational modules should receive verified actor and authorization context through application boundaries.

---

## Domain Events

Identity publishes:

* UserRegistered
* UserActivated
* UserDeactivated
* UserSuspended
* UserReactivated
* RoleAssigned
* RoleRemoved
* BranchAccessGranted
* BranchAccessRevoked
* PasswordChanged
* LoginSucceeded
* LoginFailed
* RefreshTokenRotated

Identity consumes no external domain events by default.

Identity events must include audit context where applicable:

* Actor UserId
* BranchId
* Timestamp
* CorrelationId
* CausationId

Events that change authorization must be persisted durably before operational modules depend on them.

---

## Security Requirements

Passwords must never be stored in plain text.

Passwords must be hashed using Argon2.

Refresh Tokens must be stored securely.

Access Tokens must be short-lived.

Authentication events must be auditable.

Only SuperAdmin can create or assign SuperAdmin users.

Authorization checks must be explicit in application workflows.

Operational modules must not bypass Identity authorization by reading Identity persistence internals.

---

## Audit Requirements

Every operational action in the system must record:

* Actor UserId
* BranchId where applicable
* Timestamp
* CorrelationId where applicable
* CausationId where applicable

Identity is the source of truth for user attribution.

Identity must support reconstruction of:

* Who performed an action
* Which user, branch, role, or permission was affected
* When the action occurred
* Which workflow caused the action

---

## Future Requirements

Identity must support:

* Multi Branch
* Multi Kitchen
* Franchise Networks
* SaaS Multi-Tenancy
* API Integrations
* Machine Users
* Service Accounts
* AI Agents

without requiring redesign.

Scalability requirements:

* Tenant and franchise boundaries must be introduced before SaaS deployment.
* Authorization read paths may use cache or materialized grants.
* Cached authorization data must be invalidated by Identity events.
* Identity remains the source of truth even when authorization snapshots are cached.
* Human users, machine users, service accounts, and AI agents must share a coherent actor model.

---

## Consequences

Positive:

* Strong auditability
* Clear authorization model
* Supports future growth
* Supports multiple branches
* Supports future non-human actors

Negative:

* Additional implementation complexity
* Requires careful role design
* Requires permission management tooling
* Requires durable audit and event publishing strategy
* Requires careful token and credential lifecycle management

The benefits outweigh the complexity.
