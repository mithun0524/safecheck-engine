# ADR 007: Risk Calculation v1

## Status
Accepted

## Context
Sprint 4 implements the first concrete risk-scoring mathematics for the SafeCheck engine. The engine transforms deterministic detector evidence into a deterministic risk assessment while strictly preserving the separation between risk score (how dangerous the evidence is) and risk confidence (how much we trust the evidence).

## Decisions

### 1. Severity Mapping
Evidence severity maps strictly to numeric multipliers:
- INFO = 0
- LOW = 1
- MEDIUM = 2
- HIGH = 3
- CRITICAL = 4

### 2. Base Risk Formula & Linear Normalization
For each deduplicated evidence item:
`contribution = severityNumeric × detectorConfidence × evidenceWeight`

`rawScore = Σ(contribution) + correlationBonuses`

We use transparent linear normalization (no logarithmic/asymptotic curves):
`riskScore = clamp(round(rawScore × 25), 0, 100)`

### 3. Confidence Formula
Risk confidence is the straightforward average of detector confidences over the final usable, deduplicated evidence set:
`riskConfidence = clamp(average(detectorConfidence), 0, 1)`
Factors like freshness, network coverage, and external source quality are deferred.

### 4. Approved Weights
We codify the following weights from the TRD:
- Verified phishing match: 1.00
- Multiple independent threat matches: 1.10
- Credential request: 0.80
- Confirmed brand-domain mismatch: 0.80
- Malicious redirect: 0.85
- Lookalike domain: 0.70
- Payment request: 0.55
- Urgency: 0.25
- Fear language: 0.20
- New domain: 0.15
- Generic suspicious wording: 0.10

### 5. Double-Counting Policy
- Exact duplicate evidence IDs are counted once.
- Distinct evidence representing distinct signals contribute individually.
- Explicit correlations add their fixed bonus exactly once.
- No implicit multipliers for "more evidence".

### 6. Correlations
Only explicitly defined correlations apply bonuses. Sprint 4 includes:
- CORR-001: urgency + credential-request (+10)
- CORR-002: urgency + payment-request (+8)
- CORR-003: fear-threat + credential-request (+12)
- CORR-004: reward-lure + payment-request (+10)

### 7. Contradiction Deferral
Contradiction mathematics are explicitly deferred for Sprint 4. The internal contradiction adjustment value is hardcoded to `0` pending a future ADR.

### 8. Inconclusive Threshold
The engine returns `INCONCLUSIVE` (with `INCONCLUSIVE_VERIFY` recommendation) if:
- Zero usable evidence is found.
- `riskConfidence < 0.50`.

### 9. Recommendation Precedence
The recommendation mapping is strictly deterministic and evaluated in this exact order:
1. `INCONCLUSIVE` -> `INCONCLUSIVE_VERIFY`
2. `HIGH/CRITICAL` AND credential-request -> `DO_NOT_SHARE_CREDENTIALS`
3. `HIGH/CRITICAL` AND payment-request -> `DO_NOT_PAY`
4. `CRITICAL` -> `DO_NOT_INTERACT`
5. `SUSPICIOUS` -> `PROCEED_WITH_CAUTION`
6. `LOW` AND `riskConfidence >= 0.50` -> `SAFE_TO_PROCEED`

### 10. Determinism Requirements
For identical inputs, execution yields identical scores, levels, confidence, recommendations, and correlations. No non-deterministic elements (Math.random, UUIDs, unordered iteration) are permitted in calculation.

## Consequences
- The linear normalization means a single Critical severity (4) signal with weight 1.0 and confidence 1.0 produces a score of exactly 100.
- Absence of evidence does not mean "Safe", it means "Inconclusive".
- The risk confidence calculation remains isolated from the score, keeping the engine explainable.
