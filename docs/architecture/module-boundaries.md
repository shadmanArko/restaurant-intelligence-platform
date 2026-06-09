# Module Boundaries

Version: 1.0

Status: Active

---

# Purpose

This document defines communication rules between modules.

Modules must remain independent.

Communication should occur through:

* Application Services
* Domain Events

Direct coupling should be minimized.

---

# Core Modules

Identity

Customers

Orders

Menu

Recipes

Production

Inventory

Purchasing

Accounting

Analytics

---

# Customer Module

Owns:

* Customer Profiles
* Customer Addresses
* Customer Feedback

May publish:

* CustomerCreated
* CustomerUpdated

Must not depend on:

* Inventory
* Accounting
* Production

---

# Order Module

Owns:

* Orders
* Order Items
* Payments

May consume:

* Customer Events
* Menu Events

May publish:

* OrderPlaced
* OrderCompleted
* OrderCancelled

Must not directly update inventory.

---

# Menu Module

Owns:

* Menu Items
* Categories
* Pricing

May consume:

* Recipe Events

May publish:

* MenuPriceChanged

---

# Recipe Module

Owns:

* Recipes
* Recipe Versions

May publish:

* RecipeVersionPublished

Must not modify inventory.

---

# Production Module

Owns:

* Production Batches
* Batch Yield
* Batch Consumption

May consume:

* Recipe Events

May publish:

* ProductionCompleted
* IngredientConsumed

---

# Inventory Module

Owns:

* Inventory Items
* Inventory Movements
* Inventory Audits

May consume:

* Purchase Events
* Production Events
* Order Events

May publish:

* InventoryConsumed
* InventoryAdjusted
* InventoryReceived

Inventory is the source of truth for stock.

---

# Purchasing Module

Owns:

* Suppliers
* Purchase Orders
* Goods Receipts

May publish:

* GoodsReceived
* PurchaseRecorded

---

# Accounting Module

Owns:

* Journal Entries
* Ledger Accounts

May consume:

* Purchase Events
* Inventory Events
* Order Events

Accounting is the source of truth for finance.

---

# Analytics Module

Consumes events from all modules.

Analytics never owns operational data.

Analytics never modifies operational data.

---

# Dependency Rules

Allowed:

Orders → Customers

Production → Recipes

Inventory → Production Events

Accounting → Inventory Events

Analytics → All Events

Forbidden:

Inventory → Orders

Accounting → Customers

Recipes → Inventory

Production → Accounting

Analytics → Operational Modules

---

# Golden Rule

Modules may know about events.

Modules should not know internal implementation details of other modules.
