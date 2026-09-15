# SafeCheck Testing Rules

Every implementation must be testable.

## Required
New functionality must include tests.
Bug fixes must include regression tests.
Security fixes must include security regression tests.

## Before Completion
Run:
pnpm lint
pnpm typecheck
pnpm test
pnpm build
when those scripts exist.

## Detector Testing
Every detector should test:
- positive cases
- negative cases
- edge cases
- malformed input
- adversarial input
- false positives
- false negatives

## Security Testing
Security-sensitive functionality must test:
- injection
- malformed input
- resource exhaustion
- Unicode abuse
- SSRF where applicable
- unexpected redirects
- oversized input
- invalid schemas

## Never
Never disable a test to make CI pass.
Never change expected behavior merely because the implementation fails.
Never claim tests passed without actually running them.
