# ADR-003: Identity Domain

Status: Accepted

Date: 2026-06-09

## Context

The Restaurant Intelligence Platform requires authentication, authorization, branch access control, and auditability.

Every action performed within the platform must be attributable to a user.

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

must all be traceable to a user.

---

## Decision

The Identity Domain owns:

* Users
* Roles
* Permissions
* Branch Access

Identity is responsible for:

* Authentication
* Authorization
* Access Control
* Audit Attribution

Identity is not responsible for business operations.

---

## Domain Ownership

### Identity Owns

User

Role

Permission

BranchAccess

Authentication

Authorization

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

Status:

* Active
* Inactive
* Suspended

A User may belong to multiple branches.

A User may have multiple roles.

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

---

## Authentication Strategy

Version 1:

* Email + Password
* Access Token
* Refresh Token

Version 2:

* MFA
* Google OAuth
* Microsoft OAuth

Future:

* SSO
* API Keys
* Service Accounts

---

## Domain Events

Identity publishes:

* UserRegistered
* UserActivated
* UserDeactivated
* RoleAssigned
* RoleRemoved
* BranchAccessGranted
* BranchAccessRevoked

Identity consumes no external domain events.

---

## Security Requirements

Passwords must never be stored in plain text.

Passwords must be hashed using Argon2.

Refresh Tokens must be stored securely.

Access Tokens must be short-lived.

Authentication events must be auditable.

---

## Audit Requirements

Every operational action in the system must record:

* UserId
* BranchId
* Timestamp

where applicable.

Identity is the source of truth for user attribution.

---

## Future Requirements

Identity must support:

* Multi Branch
* Multi Kitchen
* Franchise Networks
* SaaS Multi-Tenancy
* API Integrations
* Machine Users
* AI Agents

without requiring redesign.

---

## Consequences

Positive:

* Strong auditability
* Clear authorization model
* Supports future growth
* Supports multiple branches

Negative:

* Additional implementation complexity
* Requires careful role design
* Requires permission management tooling

The benefits outweigh the complexity.
