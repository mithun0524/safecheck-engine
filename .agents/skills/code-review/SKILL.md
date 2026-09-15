---
name: code-review
description: Performs a thorough code quality and architecture review for SafeCheck PRs or diffs.
---

# SafeCheck Code Review

## Phase 1 — Context Gathering
Read:
- AGENTS.md
- docs/ARCHITECTURE.md
- `.agents/rules/04-code-quality.md`
- The PR or diff

## Phase 2 — Architecture Check
Verify:
- Dependency direction (apps -> services -> packages)
- Core engine independence
- Minimal dependencies

## Phase 3 — Code Quality Check
Review for:
- Explicit types (no `any`)
- Pure, small functions
- No magic numbers
- No duplicated business logic
- Proper error handling

## Phase 4 — Test Coverage Check
Ensure new features or fixes have corresponding tests.
Verify tests run and pass.

## Phase 5 — Feedback Generation
Provide structured feedback:
### Architecture
...
### Code Quality
...
### Tests
...
### Action Items
...
### Approval Status (APPROVED / REJECTED)
...
