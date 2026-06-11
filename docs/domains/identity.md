# Identity Domain

Status: Active

## Purpose

Manage authentication, authorization, branch access, and audit attribution.

Identity is the root of auditability across the platform.

Every business action must be attributable to an actor.

Identity provides access control for other modules.

Identity must not own operational business records.

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

## Ubiquitous Language

### Actor

A human or machine identity performing an action.

### User

A platform identity capable of authentication.

### Customer

A person or organization purchasing products from the business.

Customers are not platform users.

### Branch

A physical or virtual operating location.

### Permission

A capability granted through one or more roles.

### Role

A collection of permissions.

### Branch Access

The relationship granting a user permissions within a branch.
---

## Identity Boundaries

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

Identity provides access control and audit attribution for other domains.
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


# Audit Requirement

Every domain event must record:

* Actor UserId where applicable
* BranchId where applicable
* Timestamp
* CorrelationId where applicable
* CausationId where applicable

Identity domain events must include enough context to reconstruct:

* Who performed the action
* Which user or branch was affected
* When it happened
* Why it happened in a workflow

Identity must publish auditable events for:

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

# Future Requirements

* Multi Branch
* Multi Kitchen
* Franchise Support
* SaaS Multi-Tenancy
* SSO
* MFA
* API Keys
* Machine Users
* Service Accounts
* AI Agents

Future scalability rules:

* Tenant, franchise, and branch ownership boundaries must be planned before SaaS rollout.
* Authorization read paths may be cached, but Identity remains the source of truth.
* Domain events should be persisted through a durable outbox before operational modules depend on them.
* Identity must support human users and non-human actors without redesign.
