---
name: implement-feature
description: Safely implement an approved SafeCheck feature while preserving architecture, security, tests, and scope.
---

# SafeCheck Feature Implementation

## Phase 1 — Understand
Read:
- AGENTS.md
- relevant rules
- relevant documentation
- relevant ADRs
- existing implementation

Do not modify files yet.

## Phase 2 — Plan
Identify:
- objective
- affected packages
- required files
- interfaces
- tests
- security considerations

Keep the plan minimal.

## Phase 3 — Architecture Check
Confirm:
- dependency direction remains valid
- core remains framework independent
- no unnecessary dependencies
- no scope expansion

If architecture must change: STOP and request approval.

## Phase 4 — Implement
Implement only the requested functionality.
Follow existing patterns.
Do not refactor unrelated code.

## Phase 5 — Test
Add:
- unit tests
- edge cases
- regression tests
- security tests where applicable

## Phase 6 — Verify
Run applicable:
- lint
- typecheck
- tests
- build

## Phase 7 — Diff Review
Inspect the complete diff.
Check:
- scope
- security
- accidental changes
- secrets
- debug code
- unnecessary dependencies

## Phase 8 — Report
Return:
### Implemented
...
### Files Changed
...
### Tests
...
### Verification
...
### Risks
...
### Remaining Work
...

Never claim success without verification.
