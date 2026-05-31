# AI Governance

Version: 1.0
Status: Active
Authority: Highest

---

# Purpose

This document defines how AI systems participate in software engineering activities.

Applies to:

- OpenAI Codex
- ChatGPT
- GitHub Copilot
- Future AI Agents
- Internal AI Systems

All AI output must comply with:

- Engineering Principles
- Architecture Laws
- Security Policies
- Domain Rules

---

# AI Role

AI is an engineering accelerator.

AI is NOT:

- Product Owner
- Domain Expert
- Architect Authority

AI may assist.

Humans decide.

---

# AI Responsibilities

AI may:

- Generate code
- Generate tests
- Generate documentation
- Generate diagrams
- Generate migration scripts
- Generate ADR drafts
- Generate infrastructure definitions

AI may suggest:

- Refactoring
- Optimizations
- Design improvements

All suggestions require review.

---

# AI Restrictions

AI must never:

- Bypass architecture laws
- Remove security controls
- Change accounting rules
- Change inventory rules
- Modify audit requirements
- Remove tests
- Weaken validation

without explicit approval.

---

# Architecture Authority

The following documents override AI output:

1. Engineering Principles
2. Architecture Laws
3. ADRs
4. Domain Documentation

If AI output conflicts:

Documentation wins.

---

# AI Development Workflow

Every feature follows:

1. Understand Domain
2. Read Relevant Documentation
3. Design
4. Implement
5. Test
6. Review
7. Merge

AI must never skip steps.

---

# AI Context Loading

Before implementation AI should review:

/ai/constitution/
/docs/domains/
/docs/architecture/
/docs/events/
/docs/database/

Relevant documents only.

Never code blindly.

---

# AI Implementation Rules

Before generating code AI must identify:

- Domain
- Module
- Aggregate
- Use Case
- Events
- Security Requirements
- Testing Requirements

If unclear:

Ask.

Never assume.

---

# AI Prompt Structure

All major prompts should contain:

Context
Goal
Constraints
Architecture Rules
Acceptance Criteria

Example:

Context:
Inventory Domain

Goal:
Implement stock adjustment workflow

Constraints:
Follow Clean Architecture
Follow Architecture Laws
Use Domain Events
Add Tests

Acceptance Criteria:
Stock adjusted correctly
Events emitted
Tests pass

---

# AI Code Generation Rules

Generated code must:

- Compile
- Follow architecture
- Follow naming conventions
- Include tests
- Include error handling
- Include logging when appropriate

Generated code should be production quality.

---

# AI Review Checklist

Before accepting AI output verify:

Architecture:
- Layering respected
- Boundaries respected

Security:
- Validation present
- Authorization present

Testing:
- Unit tests present
- Integration tests present

Observability:
- Logging present
- Errors handled

Documentation:
- Updated if required

---

# AI Refactoring Rules

AI may refactor only when:

- Behavior remains unchanged
- Tests remain green
- Architecture improves

Refactoring must not introduce speculative abstractions.

---

# AI Testing Rules

AI-generated features must include:

Minimum:

- Unit Tests

Preferred:

- Unit Tests
- Integration Tests

Critical Domains:

- Accounting
- Inventory
- Payments

Require additional testing.

---

# AI Documentation Rules

Whenever architecture changes:

Update:

- ADR
- Domain Docs
- Event Catalog
- API Documentation

Documentation is part of implementation.

---

# AI Security Rules

AI must assume:

- User input is malicious
- Requests are untrusted
- Secrets are sensitive

Never hardcode:

- Passwords
- Tokens
- API Keys

Never expose internal details.

---

# AI Database Rules

AI must:

- Use migrations
- Preserve history
- Avoid destructive changes

Never:

DROP data

without explicit approval.

---

# AI Accounting Rules

Accounting domain is protected.

AI must not:

- Change journal logic
- Change double-entry logic
- Change ledger integrity

without explicit approval.

---

# AI Inventory Rules

Inventory is event-driven.

Stock balances are derived.

Movement history is authoritative.

AI must preserve this model.

---

# AI Event Rules

Every important business action should emit events.

Examples:

OrderPlaced
InventoryConsumed
PurchaseRecorded

Events are immutable.

---

# AI Decision Escalation

AI must request approval for:

- Architectural changes
- Security model changes
- Database redesign
- Event contract changes
- Domain model changes

When uncertain:

Ask.

Do not invent.

---

# Definition Of Acceptable AI Output

Acceptable output is:

- Correct
- Tested
- Secure
- Observable
- Documented
- Maintainable

Not merely functional.

---

# Golden Rule

AI exists to accelerate engineering.

AI does not replace engineering judgment.