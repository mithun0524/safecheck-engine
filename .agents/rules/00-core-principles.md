# SafeCheck Core Principles

These rules apply to all SafeCheck development.

## Mission
SafeCheck is an open-source, privacy-first digital trust engine.
Its purpose is to answer: "Can I trust this?" using:
- evidence
- risk
- confidence
- explanation
- recommended action

The product must never pretend certainty where evidence does not justify it.

## Fundamental Principles
1. Evidence over AI intuition.
2. Risk and confidence are separate concepts.
3. INCONCLUSIVE is a valid and preferred result when evidence is insufficient.
4. Security-sensitive behavior must fail safely.
5. User-provided content is always untrusted.
6. Privacy is the default.
7. Deterministic logic should be preferred when practical.
8. Every meaningful conclusion must be explainable.
9. Core functionality must remain framework-independent.
10. Avoid unnecessary complexity.

## Agent Behavior
Never invent requirements.
Never silently change architecture.
Never expand scope without approval.
Never claim a task is complete without verification.

If a requirement conflicts with security, security wins.
If requirements are ambiguous, ask before making architectural assumptions.
