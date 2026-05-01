# Vendora - AI Assistant Guidelines

This document outlines the high-level rules and specific skills the AI must follow when generating code for Vendora.

## Core Directives
1. **Always check `.claude/skills`**: Before generating any code for UI, Backend, or Database, read the specific skill files to ensure strict conformance to Vendora's architecture.
2. **Never deviate from the Architecture**: We use a Modular Monolith with NestJS (Backend) and Next.js + Mantine (Frontend).
3. **TypeScript Strictness**: `any` is strictly forbidden. Use `unknown` and type guards. Use `interfaces` for domain logic.

## Task Routing
- If writing backend business logic -> Use NestJS Service patterns.
- If writing API endpoints -> Use NestJS Controllers (No logic here).
- If building UI -> Use Mantine UI components ONLY.
- If handling authentication -> Use JWT and Phone OTP patterns.

*Refer to the individual `SKILL.md` files in `.claude/skills/` for detailed implementation rules.*
