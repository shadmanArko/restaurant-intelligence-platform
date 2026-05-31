# ADR-001: Foundational Architecture Decisions

Status: Accepted

Date: 2025-XX-XX

---

# Context

The Restaurant Operating System (ROS) is intended to become the primary operational platform for restaurant and cloud-kitchen management.

The platform must support:

- Customer Management
- Orders
- Production
- Inventory
- Purchasing
- Accounting
- Analytics
- Future AI Intelligence

The platform must remain maintainable for many years while supporting future expansion.

---

# Decision

The following architectural decisions are accepted.

---

# Architecture Style

Adopt:

- Modular Monolith
- Clean Architecture
- Event Driven Architecture
- DDD Lite

The platform will be designed for future service extraction but will not start as distributed microservices.

---

# Monorepo Strategy

Adopt:

- Monorepo

Tooling:

- Turborepo
- pnpm

Reasoning:

- Shared types
- Shared contracts
- Shared tooling
- Better AI context
- Easier refactoring

---

# Frontend

Adopt:

- Next.js
- TypeScript
- Tailwind
- shadcn/ui

Reasoning:

- Mature ecosystem
- Strong TypeScript support
- Excellent developer experience
- PWA support

---

# Backend

Adopt:

- NestJS
- TypeScript

Reasoning:

- Enterprise patterns
- Dependency injection
- Modular architecture
- Strong testing support
- Event-driven compatibility

---

# Database

Adopt:

- PostgreSQL

Reasoning:

- Reliability
- ACID transactions
- Strong analytics capability
- Future AI compatibility

---

# ORM

Adopt:

- Drizzle ORM

Reasoning:

- SQL-first approach
- Type safety
- Explicit schema control
- Better long-term maintainability

---

# Cache

Adopt:

- Redis

Reasoning:

- Performance
- Event processing
- Queue support
- Session support

---

# Infrastructure

Adopt:

- Docker
- Docker Compose

Design systems to remain Kubernetes-ready.

---

# Event Strategy

Adopt:

- Domain Events
- Internal Event Bus

Initial implementation:

NestJS EventEmitter

Future options:

- RabbitMQ
- NATS
- Kafka

---

# AI Strategy

Adopt:

- AI Governance
- Codex Assisted Development
- AI Constitution
- AI Prompt Framework

Future:

- Local Models
- RAG
- Operational Intelligence

---

# Observability

Adopt:

- Structured Logging
- Pino
- Sentry
- OpenTelemetry Ready Architecture

---

# Security

Adopt:

- JWT Authentication
- Refresh Tokens
- RBAC
- Audit Logging
- Least Privilege

---

# Accounting

Adopt:

- Double Entry Accounting

Requirements:

- Immutable Journal Entries
- Auditability
- Historical Accuracy

---

# Inventory

Adopt:

- Movement Based Inventory

Inventory balances are derived.

Movement history is authoritative.

---

# Production Model

Adopt:

- Batch-Based Production

Workflow:

Raw Inventory
→ Production Batch
→ Finished Inventory
→ Sales

Reasoning:

Business model is cloud-kitchen oriented and not cook-to-order.

---

# Consequences

Positive:

- Strong architectural foundation
- High maintainability
- AI-friendly development
- Future scalability
- Operational intelligence capability

Negative:

- Higher initial design effort
- More documentation
- Additional discipline required

---

# Related Documents

Engineering Principles

Architecture Laws

AI Governance

System Overview

Domain Overview

Business Workflows

Domain Model

Event Catalog