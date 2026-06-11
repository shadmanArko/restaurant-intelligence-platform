# Identity Domain

Status: Approved

Version: 1.0

## Purpose

Manage authentication, authorization, branch access, and audit attribution.

Identity is the root of auditability across the platform.

Every business action must be attributable to an actor.

Identity provides access control for all other domains.

Identity must not own operational business records.

Identity is a Core Domain.

---

# Domain Invariants

The following invariants must always be true:

* User email must be unique.
* A user must have exactly one status.
* A BranchAccess must contain at least one role.
* Branch codes must be unique.
* Role names must be unique.
* Permission keys must be unique.
* Suspended users cannot authenticate.
* Inactive users cannot authenticate.
* Plain text passwords must never be stored.
* Every domain event must be auditable.

---

# Identity Boundaries

Identity owns:

* Users
* Roles
* Permissions
* Authentication
* Authorization
* Branch Access

Identity does not own:

* Customers
* Suppliers
* Employees
* Orders
* Inventory
* Purchasing
* Production
* Accounting
* Analytics

Identity provides access control and audit attribution for all other domains.

---

# Aggregate Boundaries

Aggregate Roots:

* User
* Role
* Branch

Supporting Entities:

* BranchAccess

Value Objects:

* UserId
* RoleId
* BranchId
* EmailAddress
* PasswordHash
* PermissionKey

Reference Data:

* Permission

Permissions are reference data and are not aggregate roots.

---

# Ubiquitous Language

## Actor

A human or machine identity performing an action.

---

## User

A platform identity capable of authentication.

---

## Customer

A person or organization purchasing products from the business.

Customers are not platform users.

---

## Branch

A physical or virtual operating location.

Examples:

* Berlin Cloud Kitchen 1
* Berlin Cloud Kitchen 2
* Berlin Restaurant 1

---

## Permission

A capability granted through one or more roles.

---

## Role

A collection of permissions.

---

## Branch Access

The relationship granting a user permissions within a branch.

---

# Core Rules

User email must be unique.

Suspended users cannot login.

Inactive users cannot login until reactivated.

Users can belong to multiple branches.

A branch access must contain at least one role.

Only SuperAdmin can create or assign other SuperAdmins.

Submitted role and branch access changes must be authorized against the actor performing the change.

Operational modules must not read Identity persistence internals directly.

---

# User

Represents a person who can access the platform.

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

* PasswordHash must never contain a plain text password.
* User status changes must be auditable.
* User role changes must be auditable.
* User branch access changes must be auditable.

---

## User Lifecycle

Allowed transitions:

Inactive → Active

Active → Suspended

Suspended → Active

Active → Inactive

Rules:

* Suspended users cannot authenticate.
* Inactive users cannot authenticate.
* Lifecycle transitions must emit domain events.
* Lifecycle transitions must be auditable.

---

# Role

Represents a collection of permissions.

Examples:

* Founder
* SuperAdmin
* Owner
* BranchManager
* KitchenManager
* KitchenStaff
* Accountant
* CustomerSupport

Properties:

* RoleId
* Name
* Description
* PermissionIds

Rules:

* Role name must be unique.
* Role permissions must be explicit.
* SuperAdmin role assignment requires a SuperAdmin actor.
* Role assignment and removal must emit auditable events.
* Platform-level roles and branch-scoped roles must be clearly distinguished.

---

## Founder

Represents the original business owner.

Founder has unrestricted access across all branches and platform functions.

Founder exists to distinguish business ownership from operational administration.

---

## Founder vs SuperAdmin

Founder represents business ownership.

SuperAdmin represents platform administration.

Rules:

* There may be multiple SuperAdmins.
* Founder role is expected to be extremely limited in number.
* Founder authority supersedes operational administration.
* Founder permissions should not be granted automatically to other users.

---

## Delegated Administration

Branch Owners and Branch Managers may manage users within their branch without receiving platform-wide administrative privileges.

Rules:

* Branch administrators cannot create SuperAdmins.
* Branch administrators cannot modify global permissions.
* Branch administrators may manage branch-scoped access according to their permissions.

---

# Permission

Represents a capability.

Examples:

* users.manage
* branches.manage
* inventory.adjust
* inventory.view
* order.create
* order.cancel
* accounting.view
* accounting.post
* analytics.view

Properties:

* PermissionId
* Key
* Description

Rules:

* Permission keys are immutable identifiers.
* Permission keys must use dotted business capability format.
* Permission meaning must not change after creation.

---

# Branch

Represents a business location.

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

# BranchAccess

Defines which user can access which branch.

Relationship:

User
→ Branch
→ Roles

Properties:

* UserId
* BranchId
* RoleIds

Rules:

* A user may belong to multiple branches.
* A branch may have multiple users.
* A user may have different roles in different branches.
* BranchAccess must contain at least one role.
* Branch access grants and revocations must be auditable.
* Branch-scoped authorization must be preferred for operational actions.
* Global roles should be reserved for platform-level administration.

---

# Authentication

Version 1:

* Email
* Password
* Access Token
* Refresh Token

Rules:

* Passwords must be hashed using Argon2.
* Plain text passwords must never be persisted or logged.
* Access tokens must be short-lived.
* Refresh tokens must be stored securely.
* Refresh token rotation should be supported.
* Login success, login failure, logout, token refresh, and password reset must be auditable.

Future:

* MFA
* Google OAuth
* Microsoft OAuth
* SSO
* API Keys
* Machine Users
* Service Accounts
* AI Agents

---

# Authorization

Authorization determines whether an actor can perform an action.

Inputs:

* Actor UserId
* BranchId where applicable
* Permission Key
* Target Resource where applicable

Rules:

* Authorization checks must be explicit in application workflows.
* Submitted roleIds must never be trusted without actor authorization.
* Only SuperAdmin can grant SuperAdmin.
* Operational modules must not inspect Identity internals directly.
* Operational modules should depend on application authorization interfaces or verified authorization context.

---

## Permission Resolution

Effective permissions are calculated from:

1. Global roles assigned directly to the user.
2. Branch-scoped roles assigned through BranchAccess.

Rules:

* Global roles apply across all branches.
* Branch-scoped roles apply only within the associated branch.
* Branch-scoped authorization should be preferred for operational actions.
* Permission evaluation must be deterministic and auditable.
* Effective permissions are the union of all granted permissions.

---

## Authorization Performance

Authorization decisions may be cached.

Rules:

* Cached authorization data must be treated as a projection.
* Identity remains the source of truth.
* Cache invalidation must occur when roles, permissions, or branch access change.

---

# Audit Requirements

Every domain event must record:

* ActorUserId where applicable
* BranchId where applicable
* Timestamp
* CorrelationId where applicable
* CausationId where applicable

Identity domain events must include enough context to reconstruct:

* Who performed the action
* Which user or branch was affected
* When it happened
* Why it happened

Identity is the source of truth for audit attribution.

---

# Domain Events

Identity must publish:

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

---

## Domain Event Versioning

Domain events are contracts.

Rules:

* Published event names must remain stable.
* Event payload changes must be versioned.
* Consumers must not depend on internal implementation details.

---

## Non-Human Actors

The platform must support non-human actors.

Examples:

* API Integrations
* Background Jobs
* AI Agents
* Automation Workflows

Rules:

* Non-human actors must be auditable.
* Non-human actors must be identifiable.
* Every action must have a traceable actor identity.

---

# Future Requirements

* Multi Branch
* Multi Kitchen
* Franchise Support
* SaaS Multi-Tenancy
* MFA
* SSO
* API Keys
* Machine Users
* Service Accounts
* AI Agents

Future scalability rules:

* Tenant, franchise, and branch ownership boundaries must be planned before SaaS rollout.
* Authorization read paths may be cached, but Identity remains the source of truth.
* Domain events should be persisted through a durable outbox before operational modules depend on them.
* Identity must support human users and non-human actors without redesign.

---

# Open Questions

Future decisions:

* Should branch roles override global roles or merge with them?
* Can a user belong to multiple franchise organizations?
* Should machine users have branch-scoped access?
* How should AI agents be authorized?
* Will customers eventually receive portal access?

These questions remain intentionally unresolved.
