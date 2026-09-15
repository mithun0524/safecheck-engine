# SafeCheck Architecture Rules

## Approved Dependency Direction
apps ↓
services ↓
packages

Core packages must never depend on application code.

## Core Engine
The SafeCheck core engine must remain independent from:
- Next.js
- React
- Fastify
- PostgreSQL
- Prisma
- Redis
- browser APIs
- cloud providers
- filesystem APIs

Infrastructure must be accessed through interfaces/adapters.

## Approved Stack
Primary language: TypeScript
Package manager: pnpm
Validation: Zod
Testing: Vitest
Web: Next.js + React
API: Fastify
Database: PostgreSQL + Prisma
Cache: Redis-compatible
CI: GitHub Actions
Containers: Docker

Do not introduce alternative frameworks without approval.

## Architecture Changes
Any change to:
- package boundaries
- dependency direction
- core engine design
- persistence strategy
- API architecture
- threat intelligence architecture
- URL fetching architecture
requires an ADR.

Do not redesign architecture while implementing a normal feature.

## Smallest Correct Change
Prefer the smallest implementation satisfying the requirement.
Do not refactor unrelated code.
Do not reorganize directories unnecessarily.
Do not introduce abstractions without a concrete need.
