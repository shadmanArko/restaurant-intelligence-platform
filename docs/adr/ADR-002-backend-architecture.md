# ADR-002: Backend Architecture

Status: Accepted

## Decision

The backend shall use:

* NestJS
* TypeScript
* Drizzle ORM
* PostgreSQL
* Redis

## Architecture

The backend shall follow:

* Modular Monolith
* Clean Architecture
* Event Driven Architecture
* DDD Lite

## Module Structure

Each module shall contain:

* Domain
* Application
* Infrastructure
* Presentation

layers.

## Domain Rules

The Domain layer:

* must not depend on NestJS
* must not depend on PostgreSQL
* must not depend on Drizzle

The Domain layer contains business logic only.

## Persistence

Drizzle ORM shall be used.

PostgreSQL is the source of truth.

## Event Strategy

Business actions generate domain events.

Events are immutable.

Events are versioned.

## Protected Domains

The following domains are protected:

* Accounting
* Inventory
* Production

Changes require:

* Tests
* Review
* Documentation

## Future Expansion

The architecture must support:

* Multiple Branches
* Cloud Kitchens
* Delivery Platforms
* AI Intelligence
* SaaS Deployment
