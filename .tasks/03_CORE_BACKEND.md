# Epic 3: Core Backend APIs

This epic focuses on the central identity and security layer of Vendora.

## Tasks
- [x] **Task 3.1: Auth Module Setup**
  - Create `AuthModule`, `AuthService`, and `AuthController`.
  - Install `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`.
- [x] **Task 3.2: Phone OTP Implementation**
  - Implement a mock OTP service (for now) that "sends" codes via console.
  - Create endpoints: `POST /auth/request-otp` and `POST /auth/verify-otp`.
- [x] **Task 3.3: JWT Strategy & Guards**
  - Implement `JwtStrategy`.
  - Create a custom `@Roles()` decorator and `RolesGuard`.
- [x] **Task 3.4: Store Management Module**
  - Create `StoreModule` to handle store registration.
  - Implement `GET /stores/my-stores` for vendors to switch context.

## Current Status: COMPLETED
*Epic 3 core APIs (Auth & Stores) are fully implemented and protected.*
