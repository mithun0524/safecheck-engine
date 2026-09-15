# SafeCheck — API & SDK Specification
## Version 1.0

## 1. Purpose

This document defines the public interfaces through which developers and SafeCheck clients interact with the SafeCheck engine.

Primary interfaces:

- REST API
- JavaScript/TypeScript SDK
- CLI
- Internal engine API
- Webhooks — future
- OpenAPI specification

The central design principle is:

> **One analysis engine, many interfaces.**

```text
                    ┌──────────────┐
                    │ SafeCheck    │
                    │ Core Engine  │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
       REST API           SDK              CLI
          ↓                ↓                ↓
        Web          Developer Apps     Developers
```

---

# 2. API Design Principles

The API must be:

- RESTful
- predictable
- versioned
- JSON-first
- strongly typed
- stateless
- observable
- secure by default
- backwards compatible

All public API responses must use a consistent schema.

---

# 3. Base URL

Production:

```text
https://api.safecheck.dev
```

Versioned API:

```text
https://api.safecheck.dev/v1
```

Development:

```text
http://localhost:3000/v1
```

---

# 4. Authentication

Public API authentication should use API keys.

Example:

```http
Authorization: Bearer sc_live_xxxxxxxxx
```

Two key types:

```text
sc_test_...
sc_live_...
```

### Test keys

Used for:

- development
- integration testing
- sandbox requests

### Live keys

Used for production.

API keys must never be exposed in:

- browser frontend code
- Git repositories
- client-side JavaScript
- public logs

---

# 5. Core Endpoint

## POST `/v1/analyze`

Analyzes arbitrary supported input.

Request:

```json
{
  "input": {
    "type": "text",
    "content": "Your account will be blocked. Verify immediately."
  }
}
```

Response:

```json
{
  "id": "chk_01JSAFE...",
  "risk": {
    "score": 72,
    "level": "high"
  },
  "confidence": {
    "score": 84,
    "level": "high"
  },
  "input": {
    "type": "text"
  },
  "indicators": [],
  "evidence": [],
  "recommendation": {
    "action": "do_not_interact",
    "message": "Do not interact until the request is independently verified."
  },
  "metadata": {
    "engineVersion": "1.0.0",
    "rulesVersion": "2026.09.1"
  }
}
```

---

# 6. Supported Input Types

Initial API:

```text
text
url
domain
```

Future:

```text
email
image
qr
webpage
```

---

# 7. Text Request

```json
{
  "input": {
    "type": "text",
    "content": "Your KYC has expired. Click here immediately."
  }
}
```

Maximum text size:

```text
100 KB
```

Requests exceeding the limit return:

```text
413 INPUT_TOO_LARGE
```

---

# 8. URL Request

```json
{
  "input": {
    "type": "url",
    "content": "https://example.com/login"
  }
}
```

The server must parse and normalize the URL before analysis.

Normalization must not:

- execute JavaScript
- automatically download files
- expose internal network services
- follow arbitrary redirects from the main API process

---

# 9. Domain Request

```json
{
  "input": {
    "type": "domain",
    "content": "example.com"
  }
}
```

The API should normalize:

```text
HTTPS://EXAMPLE.COM/
```

into:

```text
example.com
```

where appropriate.

---

# 10. Analysis Options

Optional:

```json
{
  "input": {
    "type": "text",
    "content": "..."
  },
  "options": {
    "ai": true,
    "threatIntel": true,
    "languageDetection": true
  }
}
```

Defaults:

```text
ai = false
threatIntel = true
languageDetection = true
```

This keeps deterministic analysis the default.

---

# 11. Privacy Mode

```json
{
  "options": {
    "privacyMode": "strict"
  }
}
```

Supported modes:

```text
standard
strict
local
```

### Standard

Allows required remote analysis.

### Strict

Minimizes submitted information and disables unnecessary enrichment.

### Local

No cloud analysis.

Local mode is primarily implemented through the SDK/CLI rather than the hosted API.

---

# 12. Result Object

Canonical result:

```typescript
interface AnalysisResult {
  id: string;

  risk: Risk;

  confidence: Confidence;

  input: InputSummary;

  indicators: Indicator[];

  evidence: Evidence[];

  recommendation: Recommendation;

  metadata: AnalysisMetadata;
}
```

---

# 13. Risk Object

```typescript
interface Risk {
  score: number;
  level:
    | "low"
    | "suspicious"
    | "high"
    | "critical"
    | "inconclusive";
}
```

Score:

```text
0–100
```

---

# 14. Confidence Object

```typescript
interface Confidence {
  score: number;
  level:
    | "low"
    | "medium"
    | "high";
}
```

Risk and confidence must never be merged.

---

# 15. Indicator Object

```typescript
interface Indicator {
  id: string;

  category:
    | "text"
    | "url"
    | "domain"
    | "brand"
    | "threat_intel"
    | "behavior";

  type: string;

  severity: number;

  confidence: number;

  description: string;

  evidenceIds: string[];

  source: string;
}
```

---

# 16. Evidence Object

```typescript
interface Evidence {
  id: string;

  type: string;

  title: string;

  explanation: string;

  value?: string;

  severity: number;

  confidence: number;

  source: string;

  timestamp?: string;
}
```

Example:

```json
{
  "id": "ev_123",
  "type": "brand_domain_mismatch",
  "title": "Possible brand impersonation",
  "explanation": "The destination domain does not match the organization referenced in the message.",
  "severity": 4,
  "confidence": 0.94,
  "source": "brand-analyzer"
}
```

---

# 17. Recommendation Object

```typescript
interface Recommendation {
  action:
    | "allow"
    | "verify"
    | "avoid"
    | "do_not_interact"
    | "inconclusive";

  message: string;

  steps?: string[];
}
```

Example:

```json
{
  "action": "do_not_interact",
  "message": "Do not click the link.",
  "steps": [
    "Open the organization's official app.",
    "Verify the request there.",
    "Do not share OTPs or passwords."
  ]
}
```

---

# 18. Metadata

```typescript
interface AnalysisMetadata {
  engineVersion: string;
  rulesVersion: string;
  analyzedAt: string;
  durationMs: number;

  analyzers: string[];

  threatIntel?: {
    providersQueried: number;
    providersAvailable: number;
  };
}
```

---

# 19. Retrieve Analysis

## GET `/v1/analyses/:id`

Example:

```http
GET /v1/analyses/chk_01JSAFE...
```

Returns the canonical analysis result.

This endpoint should only work for analyses associated with the authenticated account.

---

# 20. Stateless Privacy Mode

For anonymous web checks, SafeCheck should support an ephemeral mode.

Example:

```http
POST /v1/analyze
X-SafeCheck-Mode: ephemeral
```

The system:

1. processes input
2. returns result
3. does not retain raw input

The analysis ID may still exist temporarily for debugging/request tracing.

---

# 21. Batch Analysis

Future endpoint:

```http
POST /v1/analyze/batch
```

Request:

```json
{
  "inputs": [
    {
      "type": "url",
      "content": "https://example.com"
    },
    {
      "type": "domain",
      "content": "example.org"
    }
  ]
}
```

Maximum initial batch:

```text
100 items
```

---

# 22. Async Analysis

For expensive operations:

```http
POST /v1/analyses
```

Response:

```json
{
  "id": "job_123",
  "status": "queued"
}
```

Status:

```http
GET /v1/analyses/job_123
```

Possible states:

```text
queued
processing
completed
failed
```

MVP text analysis should remain synchronous.

---

# 23. Health Endpoint

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

Detailed internal endpoint:

```http
GET /health/dependencies
```

should not be publicly exposed.

---

# 24. API Error Format

Every error must use:

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "The provided input could not be analyzed.",
    "requestId": "req_123"
  }
}
```

---

# 25. Error Codes

Initial codes:

```text
INVALID_REQUEST
INVALID_INPUT
UNSUPPORTED_INPUT
INPUT_TOO_LARGE
RATE_LIMITED
UNAUTHORIZED
FORBIDDEN
ANALYSIS_FAILED
ANALYSIS_TIMEOUT
DEPENDENCY_UNAVAILABLE
THREAT_INTEL_UNAVAILABLE
INTERNAL_ERROR
```

---

# 26. HTTP Status Mapping

```text
200
Successful analysis

202
Async analysis accepted

400
Invalid request

401
Missing/invalid authentication

403
Insufficient permission

404
Analysis not found

413
Input too large

429
Rate limited

500
Internal error

502
Dependency failure

503
Service unavailable
```

---

# 27. Rate Limiting

Rate limits depend on account tier.

Initial defaults:

```text
Anonymous:
10 requests/minute

Developer:
60 requests/minute

Production:
300 requests/minute
```

Limits should eventually be configurable.

Headers:

```http
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
```

When exceeded:

```http
429 Too Many Requests
```

---

# 28. Idempotency

Analysis requests can optionally provide:

```http
Idempotency-Key: <unique-key>
```

Repeated requests with the same key should not create duplicate expensive jobs.

This is particularly important for:

- mobile retries
- browser extension retries
- unreliable networks
- batch processing

---

# 29. Request IDs

Every request receives:

```http
X-Request-ID: req_123456
```

The same ID should appear in:

- logs
- errors
- debugging responses

Never expose internal infrastructure details.

---

# 30. JavaScript SDK

Package:

```text
@safecheck/sdk
```

Installation:

```bash
npm install @safecheck/sdk
```

---

# 31. SDK Initialization

```typescript
import { SafeCheck } from "@safecheck/sdk";

const safecheck = new SafeCheck({
  apiKey: process.env.SAFECHECK_API_KEY
});
```

---

# 32. Analyze Text

```typescript
const result = await safecheck.analyze({
  type: "text",
  content: message
});
```

---

# 33. Analyze URL

```typescript
const result = await safecheck.analyze({
  type: "url",
  content: "https://example.com"
});
```

---

# 34. Convenience Methods

```typescript
await safecheck.checkText(message);

await safecheck.checkUrl(url);

await safecheck.checkDomain(domain);
```

These are syntactic sugar over the core API.

---

# 35. SDK Result

```typescript
if (result.risk.level === "high") {
  console.log("Avoid interaction");
}

for (const evidence of result.evidence) {
  console.log(evidence.title);
}
```

---

# 36. SDK Configuration

```typescript
const safecheck = new SafeCheck({
  apiKey,
  baseUrl,
  timeout: 5000,
  retries: 2,
  ai: false,
  threatIntel: true
});
```

Defaults should be conservative.

---

# 37. SDK Error Handling

```typescript
try {
  const result = await safecheck.checkUrl(url);
} catch (error) {
  if (error.code === "RATE_LIMITED") {
    // retry later
  }
}
```

SDK errors must expose structured codes.

---

# 38. CLI

Package:

```text
@safecheck/cli
```

Installation:

```bash
npm install -g @safecheck/cli
```

or:

```bash
npx safecheck
```

---

# 39. CLI Commands

### Analyze

```bash
safecheck check "https://example.com"
```

### File

```bash
safecheck check --file message.txt
```

### JSON

```bash
safecheck check "https://example.com" --json
```

### No AI

```bash
safecheck check "..." --no-ai
```

### Local

```bash
safecheck check "..." --local
```

### Version

```bash
safecheck --version
```

---

# 40. CLI Exit Codes

Useful for automation:

```text
0 = low risk
1 = suspicious
2 = high risk
3 = critical
4 = inconclusive
10 = invalid input
11 = authentication error
12 = service error
```

Example CI:

```bash
safecheck check "$URL"

if [ $? -ge 2 ]; then
  echo "Potentially dangerous URL"
  exit 1
fi
```

---

# 41. Machine-Readable Output

JSON output:

```bash
safecheck check "$URL" --json
```

Must produce valid machine-readable JSON with no terminal decorations.

Optional:

```bash
--format json
--format text
--format jsonl
```

---

# 42. OpenAPI

The REST API must publish an OpenAPI 3.x specification.

Repository:

```text
packages/api/openapi.yaml
```

It should be used to generate:

- documentation
- SDK types
- validation schemas
- API tests

The OpenAPI document becomes the canonical public API contract.

---

# 43. Schema Validation

Use runtime schema validation.

Recommended:

```text
Zod
```

Example:

```typescript
const AnalyzeRequest = z.object({
  input: z.object({
    type: z.enum(["text", "url", "domain"]),
    content: z.string().min(1)
  })
});
```

The same schema should be reusable across:

- API
- SDK
- tests
- CLI

---

# 44. API Versioning

Public APIs use:

```text
/v1
```

Breaking changes require:

```text
/v2
```

Non-breaking additions may be added to v1.

Examples:

Allowed:

```text
new optional response field
```

Not allowed:

```text
changing risk.level semantics
```

without a major API version.

---

# 45. Compatibility Policy

SafeCheck should maintain:

> **No surprise breaking changes.**

Deprecations require:

- documentation
- migration guide
- warning period
- replacement API
- sunset date

---

# 46. Web Application Integration

The web app should communicate with:

```text
Web UI
 ↓
SafeCheck API
 ↓
Analysis Orchestrator
 ↓
Core Engine
```

The web frontend must never contain the authoritative detection implementation.

---

# 47. Browser Extension Integration

The browser extension should use a lightweight API endpoint.

Example:

```http
POST /v1/analyze
```

Payload:

```json
{
  "input": {
    "type": "url",
    "content": "https://example.com"
  },
  "options": {
    "ai": false,
    "threatIntel": true
  }
}
```

The extension should request only the minimum data required.

---

# 48. Mobile Integration

Future mobile applications should use the same API contract.

Share-sheet:

```text
Shared Content
      ↓
Mobile App
      ↓
SafeCheck SDK/API
      ↓
Result
```

No separate detection implementation should be created for Android/iOS.

---

# 49. Webhooks

Future asynchronous operations may support:

```http
POST /v1/webhooks
```

Events:

```text
analysis.completed
analysis.failed
threat.updated
domain.status_changed
```

Webhook payload:

```json
{
  "event": "analysis.completed",
  "id": "evt_123",
  "data": {
    "analysisId": "chk_123"
  }
}
```

---

# 50. Webhook Security

Every webhook should include a signature.

Example:

```http
X-SafeCheck-Signature: sha256=...
```

Developers verify the signature using their webhook secret.

Replay protection should use:

```text
timestamp
event ID
signature
```

---

# 51. API Security

The API must implement:

- HTTPS
- authentication
- rate limiting
- request validation
- output validation
- abuse detection
- SSRF protection
- payload limits
- timeout controls
- dependency isolation

---

# 52. SSRF Protection

This is especially important for URL analysis.

The public API must never directly fetch arbitrary user-provided URLs from the primary application server.

Blocked destinations include:

```text
localhost
127.0.0.1
0.0.0.0
private IPv4 ranges
private IPv6 ranges
link-local addresses
cloud metadata endpoints
internal DNS targets
```

DNS rebinding must also be considered.

---

# 53. URL Fetch Architecture

If webpage fetching is enabled:

```text
API
 ↓
URL Validation
 ↓
DNS Resolution
 ↓
SSRF Policy
 ↓
Sandboxed Fetch Worker
 ↓
Response Sanitization
 ↓
Analyzer
```

The fetch worker must have:

- restricted network access
- CPU limits
- memory limits
- execution timeout
- response-size limit
- no access to internal services

---

# 54. Sensitive Data Handling

Raw input should not be logged.

Bad:

```text
POST /analyze
body = "Your OTP is 482913..."
```

Good:

```text
request_id
input_type
input_length
processing_time
detector_results
```

Sensitive values must be redacted from logs.

---

# 55. API Data Retention

Default:

```text
Raw submitted content:
not retained
```

Metadata may be retained for operational purposes.

If users opt into history:

```text
stored content
+
user-controlled deletion
```

Enterprise retention policies can be configurable later.

---

# 56. Caching

SafeCheck can cache non-sensitive external intelligence.

Examples:

```text
domain reputation
DNS results
threat feed status
brand metadata
```

Do not cache user-submitted messages by default.

URL/domain cache keys should be normalized.

---

# 57. Response Caching

Potentially cache:

```text
same normalized domain
same threat indicator
same external reputation result
```

But cached results must include freshness information.

Example:

```json
{
  "source": "phishtank",
  "checkedAt": "2026-09-15T18:00:00Z",
  "ageSeconds": 120
}
```

---

# 58. API Observability

Track:

```text
request count
latency
error rate
rate-limit events
detector latency
threat-provider latency
AI latency
cache hit rate
```

Never use raw submitted content as an analytics dimension.

---

# 59. Performance Targets

MVP synchronous analysis:

```text
p50 < 500ms
p95 < 2s
p99 < 5s
```

These targets exclude intentionally slow external webpage fetching.

URL reputation checks should use parallel providers where possible.

---

# 60. SDK Performance

SDK should:

- reuse HTTP connections
- implement bounded retries
- use exponential backoff
- respect server rate limits
- enforce request timeout
- avoid infinite retries

Retry only safe/idempotent operations.

---

# 61. Retry Strategy

Example:

```text
Attempt 1
 ↓
100ms
 ↓
Attempt 2
 ↓
250ms
 ↓
Attempt 3
 ↓
500ms
```

Do not retry:

```text
400
401
403
413
```

unless the application explicitly changes the request.

---

# 62. Public API Documentation

Documentation should provide:

```text
Quick Start
Authentication
Analyze Text
Analyze URLs
Analyze Domains
Risk Model
Evidence
Errors
Rate Limits
SDK
CLI
Security
Privacy
OpenAPI
Examples
```

Every endpoint should have:

- request example
- response example
- error example
- SDK example
- curl example

---

# 63. Example Curl

```bash
curl https://api.safecheck.dev/v1/analyze \
  -H "Authorization: Bearer $SAFECHECK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "type": "url",
      "content": "https://example.com"
    }
  }'
```

---

# 64. Example TypeScript

```typescript
import { SafeCheck } from "@safecheck/sdk";

const client = new SafeCheck({
  apiKey: process.env.SAFECHECK_API_KEY!
});

const result = await client.checkUrl(
  "https://example.com"
);

console.log(result.risk.level);
console.log(result.recommendation.message);
```

---

# 65. Example Python Future SDK

A Python SDK should eventually expose:

```python
from safecheck import SafeCheck

client = SafeCheck(api_key="...")

result = client.check_url(
    "https://example.com"
)

print(result.risk.level)
```

The Python SDK should consume the same API contract rather than reimplementing the API semantics.

---

# 66. Package Architecture

Recommended monorepo:

```text
packages/
├── core/
├── rules/
├── analyzers/
├── threat-intel/
├── api/
├── sdk-js/
├── cli/
├── browser-extension/
└── schemas/
```

Shared contracts:

```text
packages/schemas
```

should contain canonical:

- request schemas
- response schemas
- error schemas
- enums
- types

---

# 67. Internal Engine API

Internal consumers should use:

```typescript
const result = await engine.analyze({
  type: "url",
  content: url
});
```

The REST API should simply adapt:

```text
HTTP request
 ↓
Schema validation
 ↓
Engine input
 ↓
Engine result
 ↓
HTTP response
```

No duplicate business logic.

---

# 68. API Boundary Rule

The API layer must NOT contain:

```text
scam detection rules
risk scoring
brand logic
threat intelligence semantics
```

Those belong to the engine.

The API handles:

```text
authentication
validation
transport
rate limiting
serialization
observability
```

---

# 69. Future Enterprise Features

Not part of MVP:

```text
Organization accounts
SSO
SCIM
Audit logs
Private threat feeds
Custom rules
Custom risk policies
Webhooks
Bulk analysis
Usage analytics
SLA
Dedicated infrastructure
```

These should be built on the same core API.

---

# 70. Definition of Done

The API/SDK system is complete for MVP when:

- `/v1/analyze` works
- text/URL/domain inputs are supported
- response schema is stable
- errors are standardized
- API authentication works
- rate limiting works
- SSRF protections exist
- raw content is not logged
- OpenAPI is published
- JS SDK works
- CLI works
- JSON output works
- automated API contract tests pass
- SDK integration tests pass
- documentation is published

---

# 71. Final Interface Model

SafeCheck should ultimately feel like this to developers:

```text
                    SafeCheck
                       │
             ┌─────────┴─────────┐
             │                   │
         REST API            Core Engine
             │                   │
       ┌─────┼─────┐             │
       ↓     ↓     ↓             │
     Web   Mobile  Extension     │
                                 │
                 ┌───────────────┼───────────────┐
                 ↓               ↓               ↓
               SDK             CLI          Custom Apps
```

The developer should never need to understand the internal detector architecture to use SafeCheck.

They should be able to do:

```typescript
const result = await safecheck.checkUrl(url);
```

and receive:

```text
Risk
Confidence
Evidence
Recommendation
```

That is the core developer experience.