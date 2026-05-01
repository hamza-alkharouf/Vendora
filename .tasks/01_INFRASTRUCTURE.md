# Epic 1: Infrastructure & Setup

This epic focuses on scaffolding the basic repositories and ensuring the development environment is ready.

## Tasks
- [x] **Task 1.1: Backend Initialization**
  - Navigate to `vendora-backend`.
  - Initialize a new NestJS project (`npx @nestjs/cli new .`).
  - Configure strictly for API-first (remove default HTML serving if any).
- [x] **Task 1.2: Frontend Initialization**
  - Navigate to `vendora-frontend`.
  - Initialize TurboRepo with pnpm (`npx create-turbo@latest .`).
  - Scaffold 3 Next.js apps: `admin`, `vendor`, `storefront`.
  - Scaffold shared packages: `ui` (Mantine), `config-typescript`, `config-eslint`.
- [x] **Task 1.3: Dockerization**
  - Create a `docker-compose.yml` in the root `Vendora` folder to orchestrate:
    - PostgreSQL database.
    - Redis (for OTP/Caching).
    - Optional: Local Adminer/pgAdmin.

## Current Status: COMPLETED
*Epic 1 infrastructure is fully established. Ready for Epic 2 (Database Schema).*
