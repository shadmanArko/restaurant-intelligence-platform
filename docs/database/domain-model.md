# Domain Model

Version: 1.0
Status: Active

---

# Purpose

This document defines the core domain model of the Restaurant Operating System.

The domain model is the source for:

- Database Design
- API Design
- Domain Events
- Business Rules
- Module Design

The database must follow the domain.

The domain must never follow the database.

---

# Aggregate Design Principles

Aggregates:

- Protect business consistency
- Enforce invariants
- Control state changes

Aggregates communicate using events.

Aggregates should be small.

---

# CUSTOMER DOMAIN

---

## Aggregate Root

Customer

---

## Entities

Customer

CustomerAddress

CustomerFeedback

---

## Value Objects

PhoneNumber

EmailAddress

CustomerName

Address

---

## Invariants

Customer must have:

- Name
- Primary Phone Number

Phone Number must be unique.

---

# ORDER DOMAIN

---

## Aggregate Root

Order

---

## Entities

Order

OrderItem

OrderPayment

OrderStatusHistory

---

## Value Objects

OrderNumber

Money

Quantity

---

## Invariants

Order must contain at least one item.

Completed orders cannot be modified.

Cancelled orders cannot be completed.

Order total must equal item totals.

---

# MENU DOMAIN

---

## Aggregate Root

MenuItem

---

## Entities

MenuItem

MenuCategory

MenuPrice

---

## Value Objects

MenuItemName

MenuDescription

---

## Invariants

Menu Item must belong to a category.

Menu Item must have an active price.

---

# RECIPE DOMAIN

---

## Aggregate Root

Recipe

---

## Entities

Recipe

RecipeIngredient

RecipeVersion

---

## Value Objects

IngredientQuantity

YieldQuantity

PortionSize

---

## Invariants

Recipe must contain ingredients.

Recipe versions are immutable.

Production batches must reference a recipe version.

---

# PRODUCTION DOMAIN

---

## Aggregate Root

ProductionBatch

---

## Entities

ProductionBatch

ProductionConsumption

ProductionYield

---

## Value Objects

BatchNumber

YieldQuantity

ProductionDate

---

## Invariants

Batch cannot complete without yield.

Batch must reference recipe version.

Consumption records cannot be deleted.

---

# INVENTORY DOMAIN

---

## Aggregate Root

InventoryItem

---

## Entities

InventoryItem

InventoryMovement

InventoryAdjustment

InventoryAudit

---

## Value Objects

StockQuantity

UnitOfMeasure

InventoryValue

---

## Invariants

Inventory cannot be adjusted without reason.

Every stock change creates a movement.

Inventory balances are derived.

Movement history is authoritative.

---

# PURCHASING DOMAIN

---

## Aggregate Root

PurchaseOrder

---

## Entities

PurchaseOrder

PurchaseOrderLine

GoodsReceipt

Supplier

---

## Value Objects

PurchasePrice

SupplierName

SupplierCode

---

## Invariants

Purchase Orders require supplier.

Received quantities cannot exceed ordered quantities.

---

# ACCOUNTING DOMAIN

---

## Aggregate Root

JournalEntry

---

## Entities

JournalEntry

JournalLine

LedgerAccount

---

## Value Objects

Money

AccountCode

DebitAmount

CreditAmount

---

## Invariants

Total Debit = Total Credit

Journal Entries are immutable.

Posted entries cannot be modified.

---

# BRANCH DOMAIN

---

## Aggregate Root

Branch

---

## Entities

Branch

BranchAddress

BranchSettings

---

## Value Objects

BranchCode

BranchName

---

## Invariants

Branch code must be unique.

Branch must have location.

---

# ANALYTICS DOMAIN

Analytics is read-only.

No aggregate roots.

Consumes events from:

- Orders
- Inventory
- Production
- Accounting
- Customers

---

# COMMON VALUE OBJECTS

These may be shared.

---

Money

Currency

Quantity

Percentage

DateRange

Address

PhoneNumber

EmailAddress

Identifier

---

# ENTITY IDENTIFIERS

All aggregates use:

UUID v7

Example:

customer_id

order_id

recipe_id

inventory_item_id

journal_entry_id

---

# AUDIT REQUIREMENTS

Every aggregate should support:

created_at

created_by

updated_at

updated_by

---

# SOFT DELETE POLICY

Allowed:

Reference Data

Examples:

Menu Categories

Tags

Settings

---

Forbidden:

Orders

Inventory Movements

Journal Entries

Production Batches

Purchases

Customers

---

# IMMUTABLE DOMAINS

Highest Protection

- Accounting
- Inventory Movements
- Production History
- Orders

Corrections occur through adjustments.

Never through deletion.

---

# FUTURE DOMAIN EXPANSIONS

Delivery

Loyalty

Forecasting

AI Intelligence

Supplier Scoring

Demand Prediction

These must extend existing domains.

Never bypass them.