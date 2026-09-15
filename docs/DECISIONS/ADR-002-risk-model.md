# ADR-002 — Risk and Confidence Separation

Status: Accepted

## Context
When analyzing digital content, the system must evaluate how dangerous the content appears (Risk) and how certain the system is about that evaluation (Confidence). Combining these into a single "score" obscures the reality of the evidence.

## Decision
Risk and Confidence must be modeled as separate, distinct concepts.
- **Risk**: Indicates the severity of the threat (e.g., LOW, MEDIUM, HIGH, CRITICAL).
- **Confidence**: Indicates the reliability of the evidence supporting the risk assessment (e.g., LOW, MEDIUM, HIGH).

## Consequences
Positive:
- Users get a clearer picture (e.g., "High Risk, Low Confidence" implies a potential but unverified threat).
- Analyzers can produce distinct metrics based on their capability.

Negative:
- Slightly more complex UI and API responses.

## Non-Negotiable
A lack of evidence must result in an INCONCLUSIVE state, not a LOW risk state.
