# ADR-001 — Core Engine Framework Independence

Status: Accepted

## Context
SafeCheck needs to be a durable, reliable engine that can be consumed by various applications (CLI, SDK, Web API, UI). Modern web frameworks evolve quickly, and coupling the core engine to any specific framework could lead to architectural decay.

## Decision
The SafeCheck core engine must remain completely framework-independent.
It must not depend on Next.js, React, Fastify, or direct infrastructure APIs (like raw database or filesystem calls) without abstraction.

## Consequences
Positive:
- Highly testable core logic.
- Easy to port between environments (Node, edge, CLI).
- Reduced impact from dependency churn.

Negative:
- Requires strict discipline with interfaces and dependency injection.
- May feel "slower" to implement simple features initially due to required boilerplate.

## Non-Negotiable
Core packages must NEVER import from `apps/` or `services/`.
