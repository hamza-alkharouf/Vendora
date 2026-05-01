# Skill: API-First & Mobile Readiness

## Description
Ensures the backend is completely client-agnostic, allowing seamless integration with current Next.js web apps and future iOS/Android mobile apps.

## Rules
1. **Stateless Authentication**:
   - Never use HTTP-Only Cookies or browser-specific session storage for authentication.
   - Use JWT (JSON Web Tokens) passed in the `Authorization: Bearer <token>` header.
   - The JWT payload must contain `userId`, `role`, and active `storeId` (for vendors).
2. **Standardized JSON Responses**:
   - All endpoints must return consistent JSON structures.
   - Example Success: `{ "data": { ... }, "meta": { "pagination": ... } }`
   - Example Error: `{ "error": "NOT_FOUND", "message": "Product not found" }`
3. **No Web Coupling**:
   - Do not return HTML views from the backend.
   - Do not rely on web-specific headers (like `Origin` or `Referer`) for core business logic, as mobile apps might not send them consistently.
