# Skill: NestJS Separation of Concerns (SOC)

## Description
Enforces strict architectural boundaries within the NestJS backend to ensure maintainability, testability, and a clear modular monolith structure.

## Rules
1. **Controllers are Dumb**: 
   - A `Controller`'s ONLY job is to receive the HTTP request, validate it using DTOs (`class-validator`), call the appropriate `Service` method, and return the response.
   - Absolutely **NO** business logic (if/else algorithms, database calls) inside Controllers.
2. **Services are Smart**:
   - All business logic, algorithms, and orchestration belong in `@Injectable()` Services.
   - Services should call Repositories/Prisma to fetch or mutate data.
3. **Database Access**:
   - Use Prisma or TypeORM consistently.
   - For multi-step operations (e.g., Order Splitting, Cart Merging), you MUST use Database Transactions.
4. **Error Handling**:
   - Throw standard NestJS HTTP Exceptions (`NotFoundException`, `BadRequestException`) from Services, which will be caught automatically by NestJS filters.

5. **Mandatory Lint Conformance**:
   - The use of `any` is strictly forbidden. The ESLint rule `@typescript-eslint/no-explicit-any` is set to `error`.
   - After any significant edit, the AI must mentally or explicitly check for lint errors. If a lint error is found, it MUST be fixed before completing the task.
