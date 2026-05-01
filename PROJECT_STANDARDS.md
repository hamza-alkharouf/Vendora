# Vendora - Projpickupect Guidelines & Coding Standards

This document serves as the absolute source of truth for all AI-generated and human-written code in the Vendora project. These rules must be strictly adhered to.

## 1. Core Programming Rules (The "Skills")

### TypeScript (Strict Mode)

- **NO `any` types allowed.** Use `unknown` if the type is truly dynamic, then type-guard it.
- **Interfaces over Types:** Use `interface` for defining domain models and object shapes. Use `type` only for unions, intersections, or utility types.
- **Strict Null Checks:** Always handle `null` and `undefined` explicitly.

### Separation of Concerns (SOC)

- **Backend (NestJS):**
  - `Controllers`: Strictly for routing HTTP requests, handling DTO validation, and returning responses. NO business logic allowed here.
  - `Services`: The ONLY place for business logic, database interactions, and complex calculations.
  - `Repositories/Prisma`: Data access should be encapsulated.
- **Frontend (Next.js):**
  - `Components`: Strictly for UI rendering (using Mantine). Keep them "dumb" whenever possible.
  - `Hooks`: Custom hooks (`use...`) are the ONLY place for complex frontend logic, state management, and side effects.
  - `API Layer`: API calls must be abstracted into dedicated functions or services, not written inline inside components.

## 2. Frontend Guidelines (Next.js + Mantine)

### UI Stack (MANDATORY)

- **Mantine UI ONLY:** Do not use MUI, Chakra, Ant Design, or Tailwind UI components.
- **Tailwind CSS:** Allowed *only* for layout helpers (e.g., flexbox, grids, margins) if Mantine's layout components (`Grid`, `Flex`, `Stack`, `Group`) are insufficient.
- **Styling:** Rely on Mantine's `createTheme` and CSS variables. Avoid custom CSS unless absolutely necessary.

### Internationalization (i18n) & RTL

- Must support English (LTR), Arabic (RTL), and Hebrew (RTL).
- Use dynamic `dir` attributes.
- Use logical CSS properties (`margin-inline-start`, `padding-block`, etc.) instead of physical ones (`margin-left`).
- No hardcoded text. Everything must go through translation files (`/locales/{lang}.json`).

### Accessibility (WCAG 2.1 AA)

- Semantic HTML tags must be used.
- All images must have meaningful `alt` text.
- Forms must have clear labels, error states, and helper text using Mantine Forms.
- Maintain contrast ratios ≥ 4.5:1.
- Ensure full keyboard navigability (Focus traps in Modals, ESC to close).

### SEO Optimization

- Use Next.js App Router Metadata API.
- Implement structured data (JSON-LD) for Products, Organizations, and Breadcrumbs.
- Clean URLs (e.g., `/product/iphone-14`).
- Ensure `hreflang` tags are correctly generated for en, ar, he.

## 3. Backend Guidelines (NestJS + PostgreSQL)

### Architecture

- **Modular Monolith:** Structure the app in domain modules (Auth, Store, Product, Order).
- **Store-Scoped Data:** Almost all data must be scoped by `store_id`. Always validate that the requesting user has permissions for the given `store_id`.

### Authentication

- **Phone OTP ONLY:** No password-based auth.
- **JWT:** Issue JWTs containing `userId`, `role`, and potentially active `storeId`.

### Database (Prisma/TypeORM)

- **Schema First:** Define relationships clearly.
- **Transactions:** Use database transactions for multi-step operations (e.g., Order Splitting across multiple stores).

## 4. System Architecture

- **Admin Panel:** Next.js (Mantine)
- **Vendor Panel:** Next.js (Mantine) - Requires Store Switcher context.
- **Storefront:** Next.js (Mantine) - Handles Guest Cart and Cart Merging on login.
- **Backend:** NestJS - Central API for all 3 apps.

## 5. Specific Business Logic Rules

- **Order Splitting:** A single checkout by a customer may result in multiple `SubOrders` routed to different vendors.
- **Ranking Engine:** Sponsored > Featured > Organic.
- **Cart Merging:** Guest cart (`guest_id` in localStorage) must merge with the user's cart upon OTP verification at checkout.
