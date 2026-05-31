# Event Catalog

Version: 1.0
Status: Active

---

# Purpose

This document defines all business events within the Restaurant Operating System.

Events represent facts that already happened.

Events are immutable.

Events are business language.

---

# Event Principles

Events:

- Are facts
- Use past tense
- Are immutable
- Are versioned
- Have a clear owner

Examples:

Correct:

OrderPlaced

InventoryConsumed

BatchCompleted

Incorrect:

PlaceOrder

ConsumeInventory

CompleteBatch

---

# Event Structure

Every event contains:

event_id
event_type
event_version
aggregate_id
occurred_at
correlation_id
causation_id
payload

---

# Event Categories

1. Customer Events
2. Order Events
3. Menu Events
4. Recipe Events
5. Production Events
6. Inventory Events
7. Purchasing Events
8. Accounting Events
9. Branch Events
10. Analytics Events

---

# Customer Events

CustomerCreated

CustomerUpdated

CustomerAddressAdded

CustomerFeedbackRecorded

CustomerSegmentUpdated

---

# Order Events

OrderPlaced

OrderConfirmed

OrderCancelled

OrderCompleted

OrderPaymentRecorded

OrderRefundIssued

---

# Menu Events

MenuItemCreated

MenuItemUpdated

MenuPriceChanged

MenuItemActivated

MenuItemDeactivated

---

# Recipe Events

RecipeCreated

RecipeUpdated

RecipeVersionPublished

RecipeArchived

---

# Production Events

ProductionBatchCreated

ProductionStarted

IngredientConsumed

ProductionCompleted

ProductionYieldRecorded

ProductionVarianceDetected

---

# Inventory Events

InventoryReceived

InventoryConsumed

InventoryAdjusted

InventoryTransferred

InventoryReturned

InventoryWasted

InventoryAuditCompleted

InventoryVarianceDetected

---

# Purchasing Events

SupplierCreated

SupplierUpdated

PurchaseOrderCreated

GoodsReceived

PurchaseRecorded

SupplierPriceChanged

---

# Accounting Events

JournalPosted

ExpenseRecorded

RevenueRecorded

COGSRecorded

AccountBalanceAdjusted

---

# Branch Events

BranchCreated

BranchUpdated

BranchActivated

BranchDeactivated

---

# Analytics Events

SalesMetricsCalculated

InventoryMetricsCalculated

CustomerMetricsCalculated

ForecastGenerated

AnomalyDetected

---

# Event Ownership

Customer Domain
owns Customer Events

Order Domain
owns Order Events

Inventory Domain
owns Inventory Events

Accounting Domain
owns Accounting Events

No domain may publish events owned by another domain.

---

# Event Versioning

Initial version:

v1

Example:

OrderPlaced.v1

Future breaking changes require:

OrderPlaced.v2

Never modify historical versions.

---

# Correlation ID

Tracks a complete workflow.

Example:

Customer Order
→ Inventory Consumption
→ Accounting Entries

All related events share the same correlation_id.

---

# Causation ID

Tracks the event that triggered another event.

Example:

OrderPlaced
→ InventoryConsumed

InventoryConsumed stores:

causation_id = OrderPlaced

---

# Event Storage

Events must be persisted.

Events become:

Audit Trail

Analytics Source

Future AI Intelligence Source

---

# Long-Term Goal

Every meaningful business action should produce an event.

Events become:

History

History becomes:

Intelligence