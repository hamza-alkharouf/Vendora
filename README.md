# 🚀 Vendora Monorepo

Welcome to **Vendora**, the ultimate multi-vendor marketplace platform. This repository contains the entire stack, orchestrated with Docker for the backend and Turborepo for the frontend..

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 15+, Mantine UI, Turborepo (Monorepo).
- **Backend:** NestJS, Prisma 6.2.1, PostgreSQL.
- **Infrastructure:** Docker, Redis.

---

## 🚦 Getting Started

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js v22+](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Environment Setup
Copy the example environment files to their respective locations:

```bash
# Root
cp vendora-backend/.env.example vendora-backend/.env
cp vendora-frontend/apps/admin/.env.example vendora-frontend/apps/admin/.env
cp vendora-frontend/apps/vendor/.env.example vendora-frontend/apps/vendor/.env
cp vendora-frontend/apps/storefront/.env.example vendora-frontend/apps/storefront/.env
```

### 3. Installation
Install all dependencies for both frontend and backend:

```bash
pnpm install:all
```

### 4. Running the Project
We use a **Hybrid Development** flow for maximum performance:
- **Backend:** Runs inside Docker.
- **Frontend:** Runs locally for fast Hot Reloading.

To start everything:
```bash
pnpm dev
```

Alternatively, you can run them in separate terminals:
- `pnpm dev:backend` (Starts Docker stack)
- `pnpm dev:frontend` (Starts Next.js portals)

---

## 🔗 Port Mapping
| Service | URL |
| :--- | :--- |
| **Admin Portal** | [http://localhost:3000](http://localhost:3000) |
| **Vendor Portal** | [http://localhost:3001](http://localhost:3001) |
| **Storefront** | [http://localhost:3002](http://localhost:3002) |
| **Backend API** | [http://localhost:4000](http://localhost:4000) |

---

## 🐳 Docker Commands
- `pnpm down`: Stop and remove all containers.
- `docker compose logs -f`: View real-time logs from the backend.

---

## 📂 Project Structure
```text
├── vendora-backend/      # NestJS API & Prisma Schema
├── vendora-frontend/     # Monorepo containing all portals
│   ├── apps/
│   │   ├── admin/        # Admin Dashboard
│   │   ├── vendor/       # Seller Dashboard
│   │   └── storefront/   # Customer Marketplace
│   └── packages/         # Shared UI and API types
└── docker-compose.yml    # Infrastructure orchestration
```

Happy Coding! 🚀
