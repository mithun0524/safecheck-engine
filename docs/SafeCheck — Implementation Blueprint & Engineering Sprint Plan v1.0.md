# SafeCheck — Implementation Blueprint & Engineering Sprint Plan
## Version 1.0

# 1. Objective

This document converts the SafeCheck product, technical, security, evaluation, API, and OSS specifications into an executable engineering plan.

The objective is to reach:

> **SafeCheck v0.1 — a working open-source scam/phishing analysis engine**

with:

- text analysis
- URL analysis
- domain analysis
- deterministic detection
- threat intelligence
- evidence
- risk scoring
- confidence
- recommendations
- CLI
- TypeScript SDK
- REST API
- web interface
- automated tests
- benchmark suite
- CI/CD
- security controls

---

# 2. MVP Definition

The first public release should answer:

> **“I received this message/link. Should I trust it?”**

Supported:

```text
TEXT
URL
DOMAIN
```

Interfaces:

```text
Web
CLI
REST API
TypeScript SDK
Core library
```

---

# 3. MVP Architecture

```text
                         USER
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
         WEB              CLI              SDK
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                     REST API
                           │
                           ↓
                  Analysis Orchestrator
                           │
              ┌────────────┼─────────────┐
              ↓            ↓             ↓
            Rules       Threat Intel   Analyzers
              │            │             │
              └────────────┼─────────────┘
                           ↓
                      Risk Engine
                           │
                    Confidence Engine
                           │
                    Recommendation
                           │
                           ↓
                         RESULT
```

---

# 4. Technology Stack

## Core

```text
TypeScript
Node.js
Zod
Vitest
```

## Web

```text
Next.js
React
TypeScript
Tailwind CSS
```

## API

```text
Fastify
TypeScript
Zod
```

## Database

```text
PostgreSQL
Prisma
```

## Cache

```text
Redis-compatible cache
```

## Package Management

```text
pnpm
```

## Infrastructure

```text
Docker
GitHub Actions
```

No Kubernetes initially.

---

# 5. Repository Initialization

Create:

```text
safecheck/
```

Initialize:

```bash
pnpm init
```

Workspace:

```text
pnpm-workspace.yaml
```

Structure:

```text
safecheck/
├── apps/
├── packages/
├── services/
├── rules/
├── datasets/
├── evaluation/
├── docs/
├── examples/
├── infrastructure/
└── .github/
```

---

# 6. Phase 0 — Repository Foundation

## Sprint 0

Duration:

**1–2 days**

Tasks:

```text
Create repository
Set license
Create README
Create CONTRIBUTING.md
Create SECURITY.md
Create CODE_OF_CONDUCT.md
Create CHANGELOG.md
Configure pnpm
Configure TypeScript
Configure ESLint
Configure Prettier
Configure Git hooks
```

Deliverable:

```text
Clean buildable monorepo
```

---

# 7. Monorepo Packages

Create:

```text
packages/
├── core
├── schemas
├── analyzers
├── rules
├── threat-intel
├── sdk-js
├── cli
├── config
└── utils
```

Initial dependency direction:

```text
schemas
   ↑
core
   ↑
analyzers
rules
threat-intel
   ↑
api
sdk
cli
```

---

# 8. First Package — Schemas

Create:

```text
packages/schemas
```

Implement:

```text
Input
Risk
Confidence
Indicator
Evidence
Recommendation
AnalysisResult
Error
```

Use Zod.

Example:

```typescript
const AnalysisInput = z.object({
  type: z.enum([
    "text",
    "url",
    "domain"
  ]),
  content: z.string().min(1)
});
```

---

# 9. Schema Tests

Test:

```text
valid text
valid URL
valid domain
empty input
oversized input
invalid type
malformed JSON
```

Nothing should enter the engine without validation.

---

# 10. Core Engine

Create:

```text
packages/core/src/
```

Structure:

```text
core/
├── engine.ts
├── context.ts
├── detectors/
├── evidence/
├── risk/
├── confidence/
├── recommendation/
└── index.ts
```

---

# 11. Engine Interface

Implement:

```typescript
const engine = new SafeCheckEngine();

const result = await engine.analyze({
  type: "text",
  content: message
});
```

The engine must return the canonical `AnalysisResult`.

---

# 12. Detector Interface

Implement:

```typescript
interface Detector {
  id: string;

  supports(
    input: AnalysisInput
  ): boolean;

  analyze(
    input: AnalysisInput,
    context: AnalysisContext
  ): Promise<DetectionResult>;
}
```

---

# 13. First Detector

Start with:

```text
TextUrgencyDetector
```

Detect:

```text
urgent
immediately
act now
last warning
account will be closed
```

But do not classify these alone as scams.

Return:

```text
TEXT.URGENCY
```

---

# 14. Second Detector

Create:

```text
CredentialRequestDetector
```

Detect:

```text
OTP
password
PIN
CVV
verification code
security code
login credentials
```

Return:

```text
TEXT.CREDENTIAL_REQUEST
```

---

# 15. Third Detector

Create:

```text
PaymentRequestDetector
```

Detect:

```text
UPI
bank transfer
payment
send money
deposit
gift card
crypto
```

Context must be considered.

---

# 16. Fourth Detector

Create:

```text
ThreatLanguageDetector
```

Detect:

```text
account blocked
legal action
police
arrest
suspended
penalty
```

---

# 17. Fifth Detector

Create:

```text
SecrecyDetector
```

Detect:

```text
don't tell anyone
keep this confidential
do not contact the bank
```

---

# 18. Text Correlation

Implement initial correlation rules.

Example:

```text
urgency
+
credential request
```

creates a stronger signal.

Example:

```text
urgency
+
credential request
+
account threat
```

creates a high-risk pattern.

---

# 19. URL Parser

Create:

```text
UrlAnalyzer
```

Extract:

```text
scheme
hostname
port
path
query
fragment
```

Normalize safely.

---

# 20. URL Detectors

Initial detectors:

```text
IP host
punycode
suspicious port
URL obfuscation
credential-in-URL
excessive path complexity
```

Do not automatically mark any single one as malicious.

---

# 21. Domain Analyzer

Create:

```text
DomainAnalyzer
```

Initial capabilities:

```text
domain normalization
TLD extraction
subdomain extraction
brand similarity
domain syntax analysis
```

---

# 22. Lookalike Detection

Implement:

```text
Levenshtein distance
Damerau-Levenshtein
homoglyph normalization
token similarity
```

Example:

```text
paypal.com
paypa1.com
```

should produce:

```text
DOMAIN.BRAND_LOOKALIKE
```

---

# 23. Brand Registry

Create:

```text
packages/analyzers/src/brands/
```

Initial registry:

```text
banks
payment providers
major technology companies
e-commerce
delivery
government
social platforms
```

Keep the registry versioned.

---

# 24. Risk Engine v0.1

Implement the initial weighted model.

Conceptually:

```text
risk =
Σ(
  severity
  × confidence
  × weight
)
```

Then:

```text
correlation bonuses
+
strong-evidence rules
-
contradiction penalties
```

Normalize:

```text
0–100
```

---

# 25. Risk Thresholds

Initial:

```text
0–24
LOW

25–49
SUSPICIOUS

50–79
HIGH

80–100
CRITICAL
```

`INCONCLUSIVE` is determined separately based on insufficient evidence/coverage.

---

# 26. Confidence Engine

Implement:

```text
evidence quality
source reliability
source independence
freshness
analyzer coverage
contradictions
```

Return:

```text
score
level
```

---

# 27. Recommendation Engine

Map evidence to action.

Examples:

```text
Credential request
→ Don't provide credentials.

Payment scam
→ Don't send money.

Suspicious URL
→ Don't click.

Uncertain
→ Verify independently.
```

---

# 28. Unit Test the Engine

Test cases:

```text
legitimate message
simple urgency
OTP scam
payment scam
job scam
bank impersonation
ambiguous message
Unicode attack
obfuscated text
```

Every bug discovered later becomes a permanent regression test.

---

# 29. Threat Intelligence Layer

Create:

```text
packages/threat-intel/
```

Interface:

```typescript
interface ThreatIntelProvider {
  id: string;

  check(
    indicator: string
  ): Promise<ThreatIntelResult>;
}
```

---

# 30. First Threat Provider

Integrate one provider first.

The adapter should support:

```text
lookup
match
confidence
freshness
provider status
```

Do not hard-code the provider into the core engine.

---

# 31. Second Threat Provider

Add another independent source.

Then implement:

```text
provider agreement
provider reliability
freshness weighting
```

The purpose is not simply “more feeds.”

It is:

> **independent evidence.**

---

# 32. Threat Intelligence Cache

Add Redis.

Cache:

```text
domain reputation
URL reputation
threat matches
```

with TTL.

Never cache private user messages by default.

---

# 33. Database

Create PostgreSQL schema for:

```text
users
api_keys
analyses
threat_indicators
community_reports
provider_status
```

Do not store raw input unless explicitly required.

---

# 34. Prisma

Create:

```text
packages/database
```

or:

```text
services/api/prisma
```

Use Prisma migrations.

---

# 35. API Service

Create:

```text
services/api
```

Implement:

```http
POST /v1/analyze
GET /v1/analyses/:id
GET /health
```

---

# 36. API Pipeline

```text
HTTP
 ↓
Authentication
 ↓
Rate Limit
 ↓
Schema Validation
 ↓
Analysis
 ↓
Response Validation
 ↓
JSON
```

---

# 37. Authentication

Implement API keys.

Store:

```text
key hash
key prefix
user/account ID
scopes
createdAt
revokedAt
```

Never store raw production API keys.

---

# 38. Rate Limiting

Initial:

```text
anonymous:
10/min

authenticated:
60/min
```

Use Redis-compatible storage.

---

# 39. API Security

Before public URL analysis:

```text
SSRF protection
DNS validation
private IP blocking
redirect validation
fetch timeout
response size limits
```

---

# 40. URL Fetch Worker

Do NOT initially make full webpage rendering mandatory.

MVP can analyze:

```text
URL
domain
threat intelligence
```

without downloading the entire webpage.

This drastically reduces attack surface.

Full webpage analysis should come later.

---

# 41. Web Application

Create:

```text
apps/web
```

Core page:

```text
/
```

UI:

```text
Paste content
↓
Check
↓
Loading
↓
Risk
↓
Evidence
↓
Recommendation
```

---

# 42. First UI

Build only:

```text
Navbar
Hero
Input box
Check button
Loading state
Result card
Evidence cards
Recommendation
```

Do not build:

```text
accounts
history
community
dashboard
settings
```

until the core workflow works.

---

# 43. Result UI

Example:

```text
⚠ HIGH RISK

86 / 100

Confidence: High

Why?

• Suspicious domain
• Credential request
• Brand mismatch

What should you do?

Do not click the link or enter credentials.

[ View Evidence ]
```

---

# 44. SDK

Create:

```text
packages/sdk-js
```

Package:

```text
@safecheck/sdk
```

Implement:

```typescript
client.checkText()
client.checkUrl()
client.checkDomain()
client.analyze()
```

---

# 45. CLI

Create:

```text
packages/cli
```

Commands:

```bash
safecheck check <input>
safecheck check --file <file>
safecheck check --json
safecheck --version
```

---

# 46. CLI Output

Human-readable:

```text
SafeCheck

Risk: HIGH
Confidence: HIGH

Indicators:
⚠ Credential request
⚠ Urgency
⚠ Suspicious URL

Recommendation:
Do not interact.
```

JSON mode must contain only JSON.

---

# 47. Benchmark System

Create:

```text
evaluation/
├── datasets/
├── runner/
├── metrics/
├── regression/
└── reports/
```

Implement benchmark runner.

Command:

```bash
pnpm benchmark
```

---

# 48. Initial Benchmark

Start with:

```text
100 legitimate
100 suspicious
100 confirmed scam
100 adversarial
```

This is only an engineering smoke benchmark.

Expand significantly before claiming production accuracy.

---

# 49. Evaluation Metrics

Calculate:

```text
precision
recall
F1
false-positive rate
false-negative rate
confusion matrix
```

Later:

```text
ECE
Brier score
latency
cost
```

---

# 50. Regression Suite

Create:

```text
evaluation/regression/
```

Every known failure becomes:

```text
SC-REG-0001
SC-REG-0002
...
```

PRs cannot degrade critical benchmark metrics beyond defined thresholds.

---

# 51. Security Test Suite

Create:

```text
security/
```

Tests:

```text
SSRF
XSS
SQL injection
prompt injection
Unicode attacks
oversized payloads
malformed URLs
rate-limit bypass
API-key leakage
```

---

# 52. CI/CD

GitHub Actions:

```text
.github/workflows/
├── ci.yml
├── security.yml
├── benchmark.yml
└── release.yml
```

---

# 53. CI Pipeline

```text
Pull Request
      ↓
Install
      ↓
Lint
      ↓
Typecheck
      ↓
Unit Tests
      ↓
Integration Tests
      ↓
Security Tests
      ↓
Benchmark
      ↓
Build
```

---

# 54. Security CI

Run:

```text
dependency scan
secret scan
SAST
container scan
```

Fail builds on critical vulnerabilities where appropriate.

---

# 55. Docker

Create containers for:

```text
API
Worker
Web
PostgreSQL
Redis
```

Local development:

```bash
docker compose up
```

should launch the complete stack.

---

# 56. Local Developer Experience

Target:

```text
git clone
cd safecheck
pnpm install
docker compose up
pnpm dev
```

Then:

```text
http://localhost:3000
```

should open SafeCheck.

---

# 57. Environment Variables

Example:

```text
DATABASE_URL=
REDIS_URL=
SAFECHECK_API_KEY=
THREAT_PROVIDER_KEY=
AI_PROVIDER_KEY=
```

Provide:

```text
.env.example
```

Never commit:

```text
.env
```

---

# 58. Logging

Use structured logs.

Example:

```json
{
  "requestId": "req_123",
  "inputType": "url",
  "durationMs": 421,
  "riskLevel": "high"
}
```

Never log raw submitted content.

---

# 59. Observability

Initial metrics:

```text
requests_total
analysis_duration_ms
analysis_errors_total
threat_provider_latency
threat_provider_errors
cache_hit_rate
```

---

# 60. Documentation

Before release, publish:

```text
Getting Started
Architecture
API
SDK
CLI
Detection Engine
Rules
Security
Privacy
Contributing
Benchmarking
```

---

# 61. Developer Examples

Create:

```text
examples/
├── basic-api
├── sdk
├── cli
└── custom-detector
```

A developer should be able to copy an example and have it work.

---

# 62. First Public Release

Target:

```text
v0.1.0
```

Release contents:

```text
Core engine
Text detection
URL detection
Domain detection
Threat intelligence
Risk engine
Confidence
CLI
SDK
REST API
Web UI
Benchmark
Security baseline
Documentation
```

---

# 63. What NOT to Build Before v0.1

Do NOT start with:

```text
Mobile app
Browser extension
Complex AI agent
Voice detection
Deepfake detection
Full webpage browser
Dark-pattern detector
Enterprise dashboard
Kubernetes
Microservice explosion
```

These are future multipliers.

The engine comes first.

---

# 64. Sprint Sequence

## Sprint 0

Repository foundation.

```text
1–2 days
```

## Sprint 1

Schemas + Core Engine.

```text
2–4 days
```

## Sprint 2

Text detectors + risk engine.

```text
3–5 days
```

## Sprint 3

URL/domain analyzers.

```text
3–5 days
```

## Sprint 4

Threat intelligence.

```text
3–5 days
```

## Sprint 5

API + authentication + rate limits.

```text
3–5 days
```

## Sprint 6

CLI + SDK.

```text
2–4 days
```

## Sprint 7

Web application.

```text
3–5 days
```

## Sprint 8

Benchmark + security hardening.

```text
4–7 days
```

## Sprint 9

OSS polish + release.

```text
2–4 days
```

---

# 65. Critical Path

The shortest route to a working product:

```text
Schemas
 ↓
Core
 ↓
Text Detector
 ↓
Risk Engine
 ↓
URL Analyzer
 ↓
Threat Intel
 ↓
API
 ↓
CLI
 ↓
Web
 ↓
Benchmark
 ↓
Release
```

---

# 66. Parallel Work

Once Core is stable:

```text
                CORE
                 │
      ┌──────────┼──────────┐
      ↓          ↓          ↓
     API        CLI        Web
      │          │          │
      └──────────┼──────────┘
                 ↓
             Integration
```

This allows faster development.

---

# 67. Definition of Each Sprint

Every sprint must end with:

```text
Code
+
Tests
+
Documentation
+
Benchmark impact
+
Security review
```

No “works on my machine” merges.

---

# 68. Engineering Rules

### Rule 1

Core must remain framework-independent.

### Rule 2

No UI-specific logic in Core.

### Rule 3

No provider-specific logic in Core.

### Rule 4

No raw user content in logs.

### Rule 5

No arbitrary URL fetching from the API process.

### Rule 6

No AI-generated score directly controls risk.

### Rule 7

Every detection must produce evidence.

### Rule 8

Every meaningful change gets regression coverage.

---

# 69. Git Workflow

Main:

```text
main
```

Feature branches:

```text
feat/text-urgency
feat/domain-lookalike
feat/phishing-provider
fix/risk-calculation
security/ssrf-validation
```

Pull request:

```text
branch
 ↓
CI
 ↓
review
 ↓
merge
```

---

# 70. First 20 Engineering Tasks

### Foundation

```text
1. Create GitHub repository
2. Initialize pnpm monorepo
3. Configure TypeScript
4. Configure linting/formatting
5. Configure CI
```

### Core

```text
6. Create schemas
7. Create Detector interface
8. Create Evidence model
9. Create Risk Engine
10. Create Confidence Engine
```

### Detection

```text
11. Urgency detector
12. Credential detector
13. Payment detector
14. Threat-language detector
15. Text correlation rules
```

### URL

```text
16. URL parser
17. Domain analyzer
18. Lookalike detector
19. Punycode detector
20. Threat-intelligence adapter
```

---

# 71. First Milestone

Milestone:

> **“Paste a scam message and receive an explainable result.”**

Demo:

```text
Input
 ↓
SafeCheck
 ↓
HIGH RISK
 ↓
Why?
 ↓
Evidence
 ↓
Recommendation
```

This should work before anything else is expanded.

---

# 72. Second Milestone

> **“Paste a suspicious URL and receive an explainable result.”**

Example:

```text
https://fake-bank-login.example
```

Output:

```text
HIGH RISK

Possible brand impersonation
+
suspicious domain
+
threat intelligence evidence
```

---

# 73. Third Milestone

> **“A developer can use SafeCheck in one command.”**

```bash
npx @safecheck/cli check "https://example.com"
```

---

# 74. Fourth Milestone

> **“A developer can integrate SafeCheck in five lines.”**

```typescript
const result = await safecheck.checkUrl(url);

console.log(
  result.risk.level
);
```

---

# 75. Fifth Milestone

> **“A stranger can clone the repo and contribute.”**

Target:

```text
clone
→ install
→ test
→ understand
→ modify
→ submit PR
```

without needing private project knowledge.

---

# 76. Release Checklist

Before v0.1:

### Product

```text
✓ Text
✓ URL
✓ Domain
✓ Risk
✓ Confidence
✓ Evidence
✓ Recommendation
```

### Engineering

```text
✓ Core
✓ API
✓ SDK
✓ CLI
✓ Web
✓ Database
✓ Cache
```

### Security

```text
✓ SSRF controls
✓ Input validation
✓ Rate limits
✓ Secret handling
✓ Dependency scanning
✓ No raw-content logging
✓ XSS protection
```

### Evaluation

```text
✓ Benchmark
✓ Regression suite
✓ False-positive tests
✓ False-negative tests
✓ Adversarial tests
```

### OSS

```text
✓ README
✓ CONTRIBUTING
✓ SECURITY
✓ License
✓ Code of Conduct
✓ Issue templates
✓ CI
```

---

# 77. First Release Demo

The public launch demo should be extremely simple:

```text
SAFEcheck.dev

"Can I trust this?"

Paste:

Your bank account will be suspended.
Verify your KYC immediately:
https://fake-bank-login.example

        ↓

⚠ HIGH RISK

Risk: 91/100
Confidence: High

Why?

⚠ Account threat
⚠ Urgency
⚠ Credential/KYC request
⚠ Brand-domain mismatch

Recommendation:

Do not click the link.
Verify through your bank's official app.
```

Then immediately show:

```text
npm install @safecheck/sdk
```

and:

```typescript
const result = await safecheck.checkUrl(url);
```

This demonstrates both:

> **Consumer value**

and:

> **Developer value.**

---

# 78. Post-v0.1 Roadmap

After the engine proves itself:

### v0.2

```text
Browser extension
QR analysis
Better domain intelligence
More threat providers
Community reports
```

### v0.3

```text
Screenshot/OCR
Multilingual improvements
Android share sheet
```

### v0.4

```text
Webpage analysis
Dark-pattern detection
Advanced brand intelligence
```

### v0.5+

```text
Voice scam signals
Advanced AI
Campaign graph
Enterprise integrations
```

---

# 79. Engineering North Star

Do not ask:

> “What feature can we add next?”

Ask:

> **“What makes SafeCheck materially better at helping someone decide whether digital content deserves trust?”**

Every feature must strengthen:

```text
Detection
Evidence
Accuracy
Privacy
Speed
Usability
```

---

# 80. Final Build Strategy

The entire project can be reduced to:

```text
                SAFEcheck
                    │
                    ↓
             INPUT ANALYSIS
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
      TEXT         URL         DOMAIN
       │            │            │
       └────────────┼────────────┘
                    ↓
             EVIDENCE ENGINE
                    ↓
              RISK + CONFIDENCE
                    ↓
              RECOMMENDATION
                    ↓
              USER / DEVELOPER
```

The first objective is **not** to build a giant cybersecurity platform.

It is to make this tiny interaction incredibly good:

```text
Paste something suspicious.
        ↓
Check.
        ↓
Understand why.
        ↓
Know what to do.
```

Once that works reliably, everything else—extension, mobile, QR, screenshots, integrations, community intelligence, enterprise API—can grow around the same engine.

# 81. Immediate Starting Point

The actual implementation should begin in this exact order:

```text
DAY 1
Repository + monorepo

DAY 2
Schemas + core interfaces

DAY 3
Engine + evidence model

DAY 4
Urgency + credential detectors

DAY 5
Payment + threat-language detectors

DAY 6
Risk + confidence engine

DAY 7
First benchmark

DAY 8
URL/domain parser

DAY 9
Lookalike + Unicode detection

DAY 10
Threat intelligence adapter

DAY 11
API

DAY 12
CLI + SDK

DAY 13
Web UI

DAY 14
Security hardening

DAY 15
Benchmark + regression

DAY 16
Documentation

DAY 17
OSS polish

DAY 18
v0.1 release candidate
```

The **first code we should write is the monorepo + `@safecheck/schemas` + `@safecheck/core`**, not the UI.

That gives us the foundation everything else plugs into.