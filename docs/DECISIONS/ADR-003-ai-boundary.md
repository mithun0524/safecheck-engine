# ADR-003 — AI Is Not the Final Risk Authority

Status: Accepted

## Context
SafeCheck may use LLMs for semantic analysis.

## Decision
LLMs may generate evidence.
LLMs may NOT directly determine final risk.
The final risk decision is produced by the deterministic risk engine.

## Consequences
Positive:
- explainability
- reproducibility
- reduced hallucination impact
- easier benchmarking
- safer failure behavior

Negative:
- additional architecture
- more engineering effort

## Non-Negotiable
An LLM response must never directly become:
riskScore = modelOutput.score
