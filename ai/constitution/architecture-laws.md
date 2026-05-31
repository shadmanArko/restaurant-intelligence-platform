# Architecture Laws

Version: 1.0
Status: Active
Authority: Highest

---

# Purpose

This document defines the architectural laws of the Restaurant Operating System.

These rules apply to:

- Humans
- AI Agents
- Codex
- Copilot
- Automation Tools

Violations require an Architecture Decision Record (ADR).

---

# Architecture Style

The platform follows:

- Modular Monolith
- Clean Architecture
- Event Driven Architecture
- Domain Driven Design (DDD Lite)
- Service Extraction Readiness

The platform does NOT use distributed microservices by default.

---

# Dependency Rule

Dependencies must always point inward.

Allowed:

Presentation
→ Application
→ Domain

Infrastructure
→ Application
→ Domain

Forbidden:

Domain
→ Infrastructure

Domain
→ Framework

Domain
→ Database

Domain
→ UI

---

# Layer Definitions

## Domain Layer

Contains:

- Entities
- Value Objects
- Aggregates
- Domain Events
- Domain Services

The Domain Layer must contain zero framework dependencies.

---

## Application Layer

Contains:

- Use Cases
- Commands
- Queries
- DTOs
- Orchestration Logic

The Application Layer coordinates business workflows.

---

## Infrastructure Layer

Contains:

- Database
- Redis
- Email
- File Storage
- External APIs

Infrastructure is replaceable.

---

## Presentation Layer

Contains:

- Controllers
- API Routes
- Request Validation
- Response Mapping

Presentation must not contain business logic.

---

# Module Boundaries

Modules are isolated.

Examples:

- Customers
- Orders
- Kitchen
- Inventory
- Accounting
- Analytics

Modules communicate through:

- Application Interfaces
- Events

Direct database coupling between modules is forbidden.

---

# Shared Code Rules

Shared code belongs only in:

/packages

Examples:

- Shared Types
- Shared Utilities
- Logging
- Common Contracts

Business logic must never be placed in generic utility packages.

---

# Event Architecture Rules

Events represent facts.

Examples:

- OrderPlaced
- PurchaseRecorded
- InventoryAdjusted

Events are immutable.

Events must be versionable.

---

# Event Naming Convention

Past tense.

Correct:

OrderPlaced
InvoiceGenerated
CustomerCreated

Incorrect:

PlaceOrder
GenerateInvoice
CreateCustomer

Commands are actions.

Events are facts.

---

# Command Naming Convention

Commands represent intent.

Examples:

CreateCustomer
PlaceOrder
RecordPurchase
GenerateInvoice

---

# Aggregate Rules

Aggregates protect business consistency.

Rules:

- One aggregate root
- Controlled modifications
- Invariant enforcement

Aggregates must not expose mutable state.

---

# Repository Rules

Repositories belong to Domain Contracts.

Implementation belongs to Infrastructure.

Allowed:

Domain
→ Repository Interface

Infrastructure
→ Repository Implementation

Forbidden:

Domain
→ Database Access

---

# Database Rules

PostgreSQL is the source of truth.

No direct SQL from UI.

All database access goes through Application Services.

---

# Accounting Rules

Accounting is a protected domain.

Requirements:

- Double Entry
- Immutable Journal Entries
- Auditability
- Historical Accuracy

Financial records must never be deleted.

---

# Inventory Rules

Inventory movements are events.

Examples:

Purchase
Consumption
Adjustment
Transfer
Waste

Inventory balances are derived from movements.

Balances are not the source of truth.

Movement history is the source of truth.

---

# Audit Rules

All critical actions must be traceable.

Examples:

Price Changes
Inventory Adjustments
Accounting Entries
Role Changes

Audit logs are append-only.

---

# API Rules

External clients never access domain entities directly.

Always use:

DTOs
View Models
Contracts

---

# Security Rules

Authentication required.

Authorization required.

No trust of client input.

Every request is considered hostile until validated.

---

# Offline Rules

The system must support offline-first workflows.

Offline data must be:

- Syncable
- Conflict Resolvable
- Traceable

Offline state is temporary.

Server state is authoritative.

---

# AI Rules

AI may:

- Generate code
- Generate tests
- Generate documentation

AI may not:

- Change architecture
- Change security models
- Change domain models

without explicit approval.

---

# Architecture Violation Policy

When architecture conflicts with convenience:

Architecture wins.

When architecture conflicts with speed:

Architecture wins.

When architecture conflicts with AI suggestions:

Architecture wins.