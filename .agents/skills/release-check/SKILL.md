---
name: release-check
description: Verifies all SafeCheck rules, tests, and security measures before a release.
---

# SafeCheck Release Verification

## Phase 1 — Audit Commits
Review the git history since the last release.
Ensure no secrets were committed.

## Phase 2 — Full CI Check
Run all scripts:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Phase 3 — Security Regression Check
Verify that all core security tests pass.
Confirm no new untrusted dependencies were added without an ADR.

## Phase 4 — Prepare Release Notes
Draft the changelog based on conventional commits.

## Phase 5 — Go/No-Go Decision
Output:
### CI Status
...
### Security Status
...
### Release Notes
...
### Decision (GO / NO-GO)
...
