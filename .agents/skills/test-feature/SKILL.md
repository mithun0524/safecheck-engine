---
name: test-feature
description: Designs and implements robust unit, integration, and security tests for a feature.
---

# SafeCheck Feature Testing

## Phase 1 — Understand Feature
Read:
- Product requirement or feature description
- Implementation code
- `.agents/rules/03-testing.md`

## Phase 2 — Design Test Cases
Draft scenarios:
- Positive (happy path)
- Negative (expected failures)
- Edge cases
- Malformed inputs
- Adversarial inputs (SSRF, oversized, unicode abuse)

## Phase 3 — Implement Tests
Write tests using Vitest (or the configured test runner).
Mock external dependencies cleanly.

## Phase 4 — Run Tests
Execute tests locally (e.g., `pnpm test`).
Do not fake test results.

## Phase 5 — Report Results
Provide output:
### Test Plan
...
### Executed Tests
...
### Results & Coverage
...
### Missing Coverage
...
