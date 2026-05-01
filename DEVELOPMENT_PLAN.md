pickup

# Vendora - Comprehensive Master Development Plan & Standards

This document serves as the **absolute source of truth** and the foundational master plan for the **Vendora** project. It completely merges the strict technical standards of Vendora with the advanced marketplace logic and AI-ready concepts analyzed from the MercurJS reference architecture.

**This file replaces both `PROJECT_STANDARDS.md` and `PROJECT_ANALYSIS.md`.**

---

## 1. Project Overview & Architecture

Vendora is a high-performance, multi-vendor marketplace designed with a **Modular Monolith** architecture for the backend. Unlike the reference, Vendora strictly uses **NestJS** for the backend and **Next.js + Mantine** for the frontends.

**Crucial Architectural Rule:** The backend (`vendora-backend`) MUST be strictly **API-first and Client-Agnostic**. It must be designed from day one to serve both the current Web applications and future **Mobile Applications (iOS/Android)**. This means strict adherence to stateless JWT authentication, standardized JSON responses, and no tight coupling to web-specific rendering or session cookies.

### Repository Structure (Two-Repo Approach)

To allow independent deployments and separate GitHub repositories, the project is physically split into two main folders:

**1. `vendora-backend` (NestJS Repository):**
- The central API handling all business logic, database connections (Prisma), and marketplace engines.

**2. `vendora-frontend` (TurboRepo UI Workspace):**
A specialized frontend monorepo holding all client applications:
- `apps/admin`: Next.js (Mantine) - For platform operators.
- `apps/vendor`: Next.js (Mantine) - For sellers (requires Store Switcher context).
- `apps/storefront`: Next.js (Mantine) - For customers (Guest Cart & Cart Merging).
- `packages/shared-ui`: Shared Mantine components & theme.
- `packages/types`: Shared TypeScript interfaces.

### Infrastructure & Deployment

- **Dockerized Environment:** Both repositories must be containerized. The backend will have its own optimized Dockerfile, and the frontend workspace will have Dockerfiles for each Next.js app. `docker-compose` will be used to orchestrate them locally.

---

## 2. Strict Coding Standards (Non-Negotiable)

All AI-generated and human-written code MUST adhere to these rules:

### A. TypeScript (Strict Mode)

- **NO `any` types allowed.** Use `unknown` with type guards.
- **Interfaces over Types:** Use `interface` for domain models; use `type` only for unions/intersections.
- **Strict Null Checks:** Explicitly handle `null` and `undefined`.

### B. Separation of Concerns (SOC)

- **Backend (NestJS):**
  - `Controllers`: Strictly for routing, DTO validation, and responses. NO business logic.
  - `Services`: The ONLY place for business logic, DB interactions, and calculations.
  - `Repositories`: Encapsulate data access (Prisma/TypeORM).
- **Frontend (Next.js):**
  - `Components`: Strictly for UI rendering. Keep them "dumb".
  - `Hooks`: Custom hooks (`use...`) for complex logic, state, and side effects.
  - `API Layer`: API calls abstracted into dedicated functions/services.

### C. Frontend UI & Styling (Mantine Only)

- **Mantine UI ONLY:** Do NOT use MUI, Chakra, Ant Design, or Tailwind UI.
- **Tailwind CSS:** Allowed *only* for layout helpers (flex, grid, margins) if Mantine's layout components (`Grid`, `Flex`, `Stack`, `Group`) fall short.
- **Styling:** Rely on Mantine's `createTheme` and CSS variables.

### D. Internationalization (i18n), RTL, and Accessibility

- **Languages:** Must support English (LTR), Arabic (RTL), and Hebrew (RTL).
- **CSS:** Use logical properties (`margin-inline-start`, `padding-block`). No physical properties.
- **Text:** NO hardcoded text. Everything must use translation files (`/locales/{lang}.json`).
- **Accessibility:** WCAG 2.1 AA compliant. Use Semantic HTML, `alt` text, Focus traps in Modals (ESC to close), and maintain ≥ 4.5:1 contrast.

### E. Database & Backend Rules

- **Authentication:** **Phone OTP ONLY**. No password-based auth. Issue JWTs containing `userId`, `role`, and active `storeId`.
- **Store-Scoped Data:** Almost all data must be scoped by `store_id`. Validate permissions strictly.
- **Transactions:** Use DB transactions for multi-step operations (e.g., Order Splitting).

### F. SEO Optimization

- Use Next.js App Router Metadata API.
- Implement JSON-LD for Products, Organizations, and Breadcrumbs.
- Clean URLs and correct `hreflang` tags for en, ar, he.

---

## 3. Core Marketplace Logic (Inspired by MercurJS)

We will port the genius of the MercurJS marketplace systems into our NestJS architecture.

### A. Sellers & Members

- **Store Switcher:** A single user (email/phone) can be a member of multiple stores and switch between them.
- **Lifecycle:** Stores go through statuses: `pending_approval`, `open`, `suspended`, `terminated`.
- **Roles:** At least one Admin member must exist per store.

### B. Order Splitting & Cart Merging

- **Order Splitting:** A single customer checkout spanning multiple stores must be split into distinct `SubOrders`. Shipping, fulfillment, and status are tracked per `SubOrder`.
- **Cart Merging:** Guest carts (tracked via `guest_id` in localStorage) must seamlessly merge with the user's cart upon Phone OTP verification.

### C. Commission Engine

- **Types:** Percentage, Fixed, or Hybrid.
- **Hierarchy:** Platform-wide rules apply by default, but can be overridden by Seller-specific rules.
- **Calculation:** Calculated at order creation, deducted at payout.

### D. Advanced Subscription System

- **Fixed Subscription:** A recurring fee (monthly/annually) for using the platform. **Benefit:** 0% commission on sales (seller keeps all profits).
- **Commission-Based:** Instead of a monthly fee, a percentage (e.g., 1%) is deducted from each product sold. **Benefit:** No financial risk for the seller if they don't sell.
- **Onboarding Grace Period:** The first 3 months are completely free for every new store (no subscription or commission) to encourage sellers.
- **Account Suspension Policy:** If the free period ends or the subscription is not renewed, the store status changes to `suspended`. **Impact:** The store and its products disappear from the storefront, but the seller retains access to their dashboard to settle their status (no data is deleted).

### E. Payment & Settlement (iBURAQ & COD)

The system relies on two primary payment methods, with strict allocation for subscription operations:

- **Store Transactions (Customer to Vendor):**
  - **Cash on Delivery (COD):** The product and shipping value are collected manually upon delivery.
  - **Direct Transfer (iBURAQ):** The store displays its phone number or IBAN on the checkout page. The buyer transfers manually and attaches proof of transfer (or confirms it programmatically later). *Shipping totals for each store are calculated separately.*
- **Platform Fees (Vendor to Admin):**
  - **iBURAQ ONLY:** To ensure commitment and central collection, there is only one method for dealing with the platform. To subscribe to the platform (monthly/annually), the vendor MUST transfer funds to the platform's (Admin's) phone number or IBAN.

### F. Smart Ads Engine

- **Ad Scheduling:** Specify a start and end date. **Exclusion Option:** Ability to exclude specific days from the ad (e.g., "activate ad all week except Friday and Saturday").
- **Dynamic Pricing:**
  - **Standard Price:** Fixed price for a normal day (e.g., $10).
  - **Peak Pricing:** Admin dashboard to set specific dates (holidays, events) where the price automatically increases (e.g., $17).
- **Exposure Tiers:**
  - **Premium:** Very high display frequency on the homepage and search results.
  - **Standard:** Balanced display highlighting the product occasionally.

### G. Multi-Vendor Logistics & Shipping

- **Admin Controls (Platform Logistics):**
  - **Carrier Directory:** Admin dashboard to manage approved delivery companies (e.g., DHL, Aramex, local couriers).
  - **Geographic Zones:** Define coverage areas and cities (e.g., Ramallah, Nablus, Jerusalem).
- **Vendor Shipping Rates:**
  - Each store sets its own **shipping rate card** for the pre-defined geographic zones (e.g., Store A charges $5 for Zone X, Store B charges $7 for Zone X).
- **Checkout Calculation (Multi-Shipping):**
  - **Split Shipping:** If a customer buys from 3 different stores, the checkout summary displays distinct shipping costs for each store.
  - **Final Total:** `Cart Total = (Store 1 Products + Store 1 Shipping) + (Store 2 Products + Store 2 Shipping) + ...`.
  - **Sub-order Logic:** Upon checkout, a `SubOrder` is created per store, explicitly linking its specific products and its specific shipping fee to ensure correct payouts to the seller or carrier.

---

## 4. AI-Native Development Environment

Vendora is built to be understood and developed by AI agents perfectly.

- **`llms.txt` Standard:** We will implement an `llms.txt` and `llms-full.txt` file at the root of our documentation/project to feed exact context (Architecture, APIs, UI Rules) directly to Claude/ChatGPT, eliminating AI hallucination.
- **AI Skills (`.claude/skills`):** We will maintain localized Markdown files dictating how AI should write code.
  - Examples to create: `nestjs-soc-rules.md`, `mantine-ui-conformance.md`, `nextjs-app-router.md`.
  - The AI must use these skills to ensure forms use Mantine `useForm`, pages use proper layouts, and backend services use Prisma transactions.

---

## 5. Phased Implementation Roadmap

### Phase 1: Foundation (Monorepo & DB)

- Initialize TurboRepo with pnpm.
- Scaffold NestJS API and the three Next.js apps.
- **Docker Setup:** Create `docker-compose.yml` for local DB and development environment, and base `Dockerfile`s for apps.
- Design Prisma Schema (Users, Stores, Products, Orders, SubOrders, Commissions, AdSchedules, SubscriptionPlans with ExcludedDays, ShippingZones, ShippingRates).
- Set up Mantine Theme Provider with RTL support.
- Setup `llms.txt` and AI `.claude/skills` directories.

### Phase 2: Auth & Core Entities

- Implement Phone OTP integration in NestJS.
- JWT Generation and Auth Guards (Role & Store scoping).
- Build Seller Onboarding and Member management (Store Switcher).

### Phase 3: Marketplace Engines (The Complex Logic)

- Build the Product Catalog & Smart Ads Engine (implement `PricingService` with calendar-aware dynamic pricing).
- **Product Importer (CSV):** Implement a bulk upload module allowing vendors to quickly populate their catalog using CSV files.
- Implement Cart Merging (Guest to Authenticated).
- Build the Order Splitting Workflow (Transactions).
- Implement the Commission calculation and Payout Pipeline.
- **Cron Jobs:** Implement daily scripts to check subscription expiries and auto-suspend stores, as well as ad schedule processing.

### Phase 4: Frontend Dashboards

- **Admin App:** Approval workflows, commission rules, platform metrics, logistics controls.
- **Vendor App:** Store-scoped dashboards, product CRUD, **bulk CSV imports**, order fulfillment, smart ads boost.
- **Storefront App:** High-performance catalog, cart, checkout flow (multi-shipping).
- Enforce strict i18n, RTL, and WCAG accessibility across all apps.

### Phase 5: Launch Prep & SEO

- App Router Metadata and JSON-LD generation.
- Performance tuning and final AI documentation generation.
- **Production Deployment:** Finalize multi-stage Docker builds for NestJS and Next.js apps for optimized production hosting.
