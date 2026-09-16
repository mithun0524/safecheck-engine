# ADR-008 — Threat Intelligence Integration and Boundaries

Status: Accepted

## Context
SafeCheck evaluates URLs and domains. Deterministic text rules provide one layer of defense, but attackers frequently rotate domains. External threat intelligence (e.g., PhishTank) is needed to identify known bad indicators. However, fetching external intelligence introduces privacy risks, SSRF risks, and untrusted provider payloads.

## Decision
We introduce a dedicated `@safecheck/threat-intel` workspace to isolate external lookups from the core engine and deterministic detectors.
1. **Dependency Inversion**: `@safecheck/core` defines a `ThreatIntelPort` interface. It does not import from `@safecheck/threat-intel`. Providers implement this port, and the composition/application layer injects concrete providers into the engine constructor.
2. **Network Boundary**: Only the `threat-intel` package may perform network fetching (using Node's `fetch`). Core code will not make HTTP requests.
3. **Provider Trust Boundary**: All external provider responses must be validated via strict Zod schemas before being processed.
4. **Status Semantics**: Providers return standard statuses (`MATCH`, `NO_MATCH`, `SKIPPED`, `ERROR`). Only `MATCH` yields evidence. `NO_MATCH`, `SKIPPED`, and `ERROR` do not penalize or alter risk.
5. **Configuration**: Provider reliability is configured by the composer, not hardcoded.
6. **Privacy enforcement**:
   - `local` mode skips all threat intel network requests.
   - `strict` mode skips any provider that declares `requiresRawInput: true` (e.g., PhishTank API).
   - `standard` mode permits these lookups.
7. **Resilience**: A timeout of 2 seconds (`AbortSignal.timeout`) is enforced. Provider errors, rate limits (429), or malformed data are caught and ignored so the engine can proceed with remaining detectors.

## Consequences
Positive:
- Prevents malicious providers from injecting unvalidated data or taking down the engine.
- Prevents core from being polluted with network code.
- Obeys `ADR-004` (Privacy) seamlessly.

Negative:
- Maintenance overhead of maintaining explicit Zod schemas for every new provider.
- `strict` mode users receive reduced security benefit since they cannot utilize URL-based lookups without local feeds.

## Non-Negotiable
- Never parse external provider data blindly (e.g. `JSON.parse` without Zod).
- Never fail the entire `analyze()` call due to a provider timeout or error.
