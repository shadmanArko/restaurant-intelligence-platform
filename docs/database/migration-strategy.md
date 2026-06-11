# Database Migration Strategy

Status: Approved

Version: 1.0

## Purpose

Define how database schema changes are managed.

---

# Source of Truth

Drizzle schema files are the source of truth.

Database state must be reproducible from migrations.

---

# Rules

Every schema change requires:

1. Schema modification
2. Migration generation
3. Migration review
4. Typecheck
5. Tests
6. Commit

---

# Migration Workflow

1. Modify schema.
2. Generate migration.
3. Review generated SQL.
4. Apply migration locally.
5. Run tests.
6. Commit migration.

---

# Prohibited Practices

Do not:

* Manually modify production schema.
* Modify applied migrations.
* Delete historical migrations.
* Use ad-hoc SQL outside migrations.

---

# Backward Compatibility

Schema changes should be:

1. Additive
2. Backward compatible
3. Deployable independently

Preferred sequence:

Deploy A:

* Add column

Deploy B:

* Use column

Deploy C:

* Remove legacy column

---

# Data Protection

Migrations must never:

* Destroy production data
* Drop critical tables without explicit approval
* Remove audit history

---

# Audit Requirements

All schema changes must be tracked through Git.

Migration history must be reproducible from a clean environment.

---

# Future Requirements

* Automated migration validation
* CI migration checks
* Production migration automation
