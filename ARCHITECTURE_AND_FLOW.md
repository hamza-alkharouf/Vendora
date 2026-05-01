# Vendora - Architecture, Pages, and Data Flow

This document details the exact structure of the application, the database models, their relationships, and the user flows across the three frontends (Admin, Vendor, Storefront), based on the `DEVELOPMENT_PLAN.md`.

---

## 1. Database Schema & Relationships (Prisma Models)

### Core Models

*   **User**: The central identity entity.
    *   Fields: `id`, `phone` (unique), `name`, `role` (ADMIN, CUSTOMER).
    *   Relations: Has many `Orders`, `StoreMembers`.
*   **Store**: The vendor entity.
    *   Fields: `id`, `name`, `status` (`pending_approval`, `open`, `suspended`, `terminated`), `iburaq_iban`, `contact_phone`.
    *   Relations: Has many `Products`, `SubOrders`, `ShippingRates`, `StoreMembers`. One `StoreSubscription`.
*   **StoreMember**: Pivot table allowing users to manage multiple stores.
    *   Fields: `user_id`, `store_id`, `role` (OWNER, MANAGER).

### Marketplace Logistics & Monetization

*   **Product**:
    *   Fields: `id`, `store_id`, `title`, `description`, `price`.
    *   Relations: Has many `OrderItems`, `AdSchedules`.
*   **AdSchedule** (Smart Ads Engine):
    *   Fields: `id`, `product_id`, `tier` (PREMIUM, STANDARD), `start_date`, `end_date`, `excluded_days` (JSON array), `price_paid`.
*   **SubscriptionPlan**:
    *   Fields: `id`, `name`, `type` (FIXED, COMMISSION), `monthly_price`, `commission_rate`.
*   **StoreSubscription**:
    *   Fields: `id`, `store_id`, `plan_id`, `status` (ACTIVE, EXPIRED), `end_date`, `is_grace_period` (Boolean).
*   **ShippingZone** (Platform Managed):
    *   Fields: `id`, `name` (e.g., Ramallah, Nablus).
*   **ShippingRate** (Vendor Managed):
    *   Fields: `id`, `store_id`, `zone_id`, `price`.

### Order & Payment Flow

*   **Order** (Parent - Customer facing):
    *   Fields: `id`, `customer_id`, `shipping_zone_id`, `payment_method` (COD, IBURAQ), `iburaq_proof_url`, `total_price`.
    *   Relations: Has many `SubOrders`.
*   **SubOrder** (Child - Vendor facing):
    *   Fields: `id`, `order_id`, `store_id`, `status` (PENDING, SHIPPED, DELIVERED), `shipping_fee_charged`, `sub_total`.
    *   Relations: Has many `OrderItems`.
*   **OrderItem**:
    *   Fields: `id`, `suborder_id`, `product_id`, `quantity`, `price_at_purchase`.

---

## 2. Page Structure & App Navigation

### A. Storefront App (Customers)
*   **`/` (Home)**: Displays categories and products pushed by the **Smart Ads Engine** (Premium tier first).
*   **`/product/[id]`**: Product detail page with vendor info.
*   **`/cart`**: Multi-vendor cart. Groups items visually by `Store`.
*   **`/checkout`**: 
    1.  **Auth Step**: Phone OTP (Guest cart merges with authenticated cart).
    2.  **Shipping Step**: Select `ShippingZone`. System calculates shipping per store dynamically based on `ShippingRates`.
    3.  **Payment Step**: Select COD or iBURAQ. If iBURAQ, shows IBANs for each store involved and a file upload for transfer proofs.
*   **`/profile/orders`**: View parent `Orders` and their `SubOrders` statuses.

### B. Vendor App (Sellers)
*   **`/login`**: Phone OTP login.
*   **`/store-select`**: If a user is a `StoreMember` of multiple stores, they select the active store context here.
*   **`/dashboard`**: Store metrics, sales, and active subscription status.
*   **`/orders`**: View `SubOrders` assigned to this store. Update status (e.g., mark as SHIPPED).
*   **`/products`**: 
    *   List view (`_DataTable`).
    *   Sub-sections for **Collections**, **Categories**, and **Imports**.
    *   Create/Edit via side drawer (`RouteDrawer`) including **Variants** and **Media**.
*   **`/inventory`**: Manage stock levels across different locations (if applicable).
*   **`/customers`**: View details of customers who purchased from this specific store.
*   **`/promotions`**: Create store-specific discounts and coupons.
*   **`/ads`**: Select a product, choose dates, exclude days, and pay for Boost (Standard/Premium).
*   **`/shipping`**: Matrix view to input shipping prices for all system `ShippingZones`.
*   **`/billing`**: View current `StoreSubscription`. Upload iBURAQ proof to renew subscription directly to Platform Admin.

### C. Admin App (Platform Operators)
*   **`/login`**: Phone OTP.
*   **`/dashboard`**: Platform health, total stores, revenue from ads/subscriptions.
*   **`/orders`**: Global view of all parent `Orders` (Group IDs) and their related `SubOrders` across all vendors.
*   **`/products`**: Global read-only view of all products across the platform.
*   **`/inventory`**: Global stock monitoring.
*   **`/customers`**: Full directory of all registered platform users.
*   **`/vendors`**: List of all stores. Actions to Approve, Suspend, or Terminate.
*   **`/commissions`**: View calculated commissions and platform fees.
*   **`/subscriptions/approvals`**: Review uploaded iBURAQ proofs from vendors. Click "Approve" to extend their `end_date`.
*   **`/logistics/zones`**: Create/Edit `ShippingZones` (e.g., add a new city).
*   **`/ads/pricing`**: Manage **Peak Pricing** for the Smart Ads Engine (e.g., set ad price to $17 during Eid).

---

## 3. Core Business Flows

### Flow 1: New Vendor Registration & Billing
1. User logs into Vendor App with OTP -> Fills out store application.
2. Store is created with `pending_approval` status.
3. Admin reviews in Admin App -> Changes status to `open`.
4. System automatically assigns a 3-month **Grace Period** `StoreSubscription`.
5. After 3 months, a **Cron Job** flags the subscription as expired.
6. Vendor accesses `/billing`, sees they must pay. Vendor transfers via iBURAQ to Admin, uploads receipt.
7. Admin approves receipt in `/subscriptions/approvals` -> Store remains `open` for another cycle. If ignored, Cron Job sets store to `suspended`.

### Flow 2: Multi-Vendor Checkout & Split
1. Customer adds "Shirt" (Store A) and "Shoes" (Store B) to cart.
2. Checkout -> Selects "Nablus" zone.
3. System checks Store A's rate for Nablus ($5) and Store B's rate ($7).
4. Customer selects COD.
5. Order placed. Backend creates:
   - `Order` #100 (Total: Shirt Price + $5 + Shoes Price + $7).
   - `SubOrder` #100-A (Store A, Shipping: $5, Status: PENDING).
   - `SubOrder` #100-B (Store B, Shipping: $7, Status: PENDING).
6. Store A and Store B independently see their respective SubOrders in their Vendor apps and fulfill them.
