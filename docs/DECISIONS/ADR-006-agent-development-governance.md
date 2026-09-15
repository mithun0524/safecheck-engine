# ADR-006 — Agent Development Governance

Status: Accepted

## Context
SafeCheck is developed using AI coding agents.
AI agents can unintentionally introduce:
- architectural drift
- scope expansion
- insecure implementations
- unnecessary dependencies
- undocumented decisions
- untested behavior

## Decision
All AI-assisted development must follow:
- AGENTS.md
- .agents/rules/
- .agents/agents/
- .agents/skills/
- approved ADRs

Agents must not:
- silently change architecture
- expand MVP scope
- bypass security rules
- remove failing tests
- introduce dependencies without justification
- modify unrelated code

Architectural changes require a new ADR.

## Verification
A task is not complete until:
- implementation exists
- tests pass
- typecheck passes
- lint passes
- build passes
- diff is reviewed

## Principle
The agent is an implementation tool, not the product owner or architect.
Human approval is required for architectural changes.
