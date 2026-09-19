# ADR-010 — AI Evidence Layer and Trust Boundaries

Status: Accepted

## Context
Sprint 7 introduces an optional AI-powered evidence-generation layer to SafeCheck. Due to the inherent unpredictability of LLMs (hallucinations, prompt injections), SafeCheck requires an architectural boundary that isolates AI output from deterministic risk calculation.

## Decision
1. **Untrusted AI Boundary**: AI providers (implementing `AiEvidenceProvider`) are strictly treated as untrusted observation generators. They do not return SafeCheck `Evidence` or `Indicator` objects directly. They return an `AiObservationResult`.
2. **Trusted Mapping**: The Core Engine applies strict Zod validation (`AiObservationResultSchema`) to the AI output, dropping arbitrary fields like `riskScore` or `detectorId`. It then safely maps the observations to SafeCheck `Evidence`.
3. **Risk Integrity**: AI observations map to SafeCheck `Evidence` with a static `detectorId` (`'ai.observation'`) and a static `severity` (`'INFO'`). They carry a `0` risk weight and do NOT affect the deterministic `RiskCalculator` in Sprint 7.
4. **Privacy Modes**: 
   - `local`: The engine will only execute AI providers declaring `isLocal: true`.
   - `strict`: The engine will skip AI providers declaring `requiresRawInput: true`.
   - `standard`: The engine executes configured providers with standard abort timeouts.
5. **Prompt Injection Resilience**: Analyzed content is treated purely as data. If a prompt injection attack succeeds, the AI may output false observations. However, because AI observations are isolated to `INFO` severity and `0` risk weight, the prompt injection cannot alter the final risk score or recommendation. The deterministic engine remains fully authoritative.

## Consequences
Positive:
- AI hallucinations cannot artificially inflate or deflate the user's risk score.
- Malformed JSON from AI models will not crash the orchestration engine.
- Privacy mode is enforced uniformly via explicit provider capabilities.

Negative:
- AI currently only serves as a supplementary explanation engine rather than a core detection authority. (Future sprints may explore bounded risk voting for AI, but it is explicitly blocked for Sprint 7).
