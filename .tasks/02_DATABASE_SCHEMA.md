# Epic 2: Database & Schema

This epic focuses on defining the source of truth for Vendora's data using Prisma.

## Tasks
- [x] **Task 2.1: Prisma Initialization**
  - Install Prisma dependencies in `vendora-backend`.
  - Initialize Prisma (`npx prisma init`).
- [x] **Task 2.2: Schema Design**
  - Define models in `schema.prisma`:
    - `User`, `Store`, `StoreMember`.
    - `Product`, `SubscriptionPlan`, `StoreSubscription`.
    - `ShippingZone`, `ShippingRate`.
    - `Order`, `SubOrder`, `OrderItem`.
    - `AdSchedule`.
- [x] **Task 2.3: Initial Migration**
  - Run `npx prisma migrate dev` to create the database tables.
  - Generate Prisma Client.

## Current Status: COMPLETED
*Epic 2 database layer is fully operational. Ready for Epic 3 (Backend APIs).*
