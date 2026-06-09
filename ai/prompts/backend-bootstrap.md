You are a Principal Software Architect and Staff Backend Engineer.

Read and follow:

* /ai/constitution/*
* /docs/architecture/*
* /docs/domains/*
* /docs/events/*
* /docs/database/*
* /docs/adr/*

before making any decisions.

Task:

Generate the backend foundation for Restaurant Intelligence Platform.

Requirements:

* NestJS
* TypeScript
* Drizzle ORM
* PostgreSQL
* Redis
* Pino Logging
* Zod Environment Validation

Architecture:

* Modular Monolith
* Clean Architecture
* Event Driven Architecture

Generate:

apps/api

with:

src/
modules/
shared/
infrastructure/

Create:

Identity Module

containing:

* User
* Role
* Permission
* Branch Access

The Domain layer must have zero NestJS dependencies.

The Domain layer must have zero database dependencies.

Generate:

* Unit Tests
* Integration Test Foundation
* Health Checks
* Environment Validation
* Logging

Follow:

SOLID
KISS
YAGNI
Clean Code

Do not implement business functionality outside the architecture boundaries.
