# Engineering Principles

Version: 1.0
Status: Active
Authority: Highest

---

# Purpose

This document defines the permanent engineering principles of the Restaurant Operating System (ROS).

All engineering decisions, architecture decisions, code changes, AI-generated code, documentation, reviews, and deployments must comply with these principles.

When conflicts occur, this document takes precedence over convenience, speed, and personal preference.

---

# Vision

Build a world-class Restaurant Operations & Intelligence Platform that is:

- Maintainable
- Extensible
- Auditable
- Testable
- Observable
- Secure
- AI-Augmented
- Event-Driven

The platform must be capable of serving a single restaurant, multiple branches, and future SaaS deployment without architectural rewrites.

---

# Core Philosophy

The system shall prioritize:

1. Correctness
2. Simplicity
3. Maintainability
4. Extensibility
5. Performance
6. Convenience

Convenience must never compromise correctness.

---

# Engineering Principles

## KISS

Keep systems as simple as possible.

Avoid:
- unnecessary abstractions
- speculative architecture
- premature optimization

Every abstraction must solve a real problem.

---

## YAGNI

You Aren't Gonna Need It.

Do not implement future features today.

Build extension points, not future implementations.

---

## SOLID

All code should follow SOLID principles.

Especially:

- Single Responsibility Principle
- Dependency Inversion Principle
- Open Closed Principle

Violations require explicit justification.

---

## Composition Over Inheritance

Favor composition whenever possible.

Inheritance should be rare and intentional.

---

## Explicit Over Implicit

Code should be obvious.

Avoid:
- hidden behavior
- magic conventions
- unclear side effects

---

## Readability Over Cleverness

Code is read more often than written.

Optimize for understanding.

---

# Architectural Principles

## Clean Architecture

Dependencies must always point inward.

Domain layer must never depend on:

- Frameworks
- Databases
- UI
- Infrastructure

---

## Domain First

Business rules are the most important asset.

Technology decisions must support domain rules.

Never compromise domain integrity.

---

## Modular Design

Every module must have clear boundaries.

Examples:

- Inventory
- Accounting
- Orders
- Customers
- Kitchen
- Analytics

Modules must communicate through defined contracts.

---

## Event Driven

Business actions produce events.

Examples:

- OrderPlaced
- InventoryConsumed
- PurchaseRecorded
- InvoiceCreated

Events are business facts.

Events must never be mutated.

---

## Service Extraction Ready

The architecture must allow future extraction into services without major rewrites.

However:

Do not introduce distributed systems complexity prematurely.

---

# Data Principles

## Data Is An Asset

Historical data is one of the platform's most valuable assets.

Never destroy historical business data.

---

## Auditability

All important actions must be traceable.

Examples:

- Inventory changes
- Financial changes
- Price changes
- User actions

---

## Immutability

Financial records should be append-only whenever possible.

Corrections should be performed through adjustments, not destructive updates.

---

# Security Principles

Security is a feature.

Never treat security as optional.

Requirements:

- Authentication
- Authorization
- Audit Logs
- Input Validation
- Least Privilege Access

---

# Testing Principles

Testing is mandatory.

Required layers:

- Unit Tests
- Integration Tests
- End-to-End Tests

Critical business logic must never ship without tests.

---

# Observability Principles

Every important action should be observable.

The platform must support:

- Structured Logging
- Metrics
- Tracing
- Audit Logs

Debugging should rely on data, not guesswork.

---

# AI Engineering Principles

AI is an implementation accelerator.

AI is not an architectural authority.

AI-generated code must:

- Follow constitution
- Pass tests
- Pass reviews
- Follow module boundaries

All AI output is subject to verification.

---

# Documentation Principles

Architecture decisions must be documented.

Major decisions require ADRs.

If knowledge is important, document it.

Institutional knowledge must not live only in people's heads.

---

# Definition Of Done

A feature is complete only when:

- Requirements are implemented
- Tests pass
- Documentation is updated
- Observability is present
- Security is reviewed
- Architecture rules are respected

---

# Non-Negotiable Rule

Long-term maintainability is more important than short-term speed.