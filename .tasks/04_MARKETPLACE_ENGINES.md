# Epic 4: Marketplace Engines

This epic covers the core logical engines that differentiate Vendora from a standard e-commerce site.

## Tasks
- [x] **Task 4.1: Product Catalog & Categories**
  - Implement `ProductsModule` with CRUD for vendors.
  - Implement `CategoriesModule` and `CollectionsModule`.
- [x] **Task 4.2: Order Splitting Engine**
  - Implement `OrdersModule`.
  - Create the `OrderSplittingService`: When a parent `Order` is created, automatically generate multiple `SubOrder` records based on the products' `storeId`.
- [x] **Task 4.3: Logistics & Shipping Engine**
  - Implement `ShippingModule`.
  - Logic to calculate dynamic shipping costs based on `ShippingZone` and vendor `ShippingRate`.
- [x] **Task 4.4: Smart Ads Pricing Service**
  - Implement `AdsModule`.
  - Logic to check for Premium/Standard boost availability and apply Peak Pricing.

## Current Status: COMPLETED
*Epic 4 Marketplace Engines (Orders, Shipping, Ads) are fully implemented and integrated.*
