# SafeCheck — Open-Source Architecture & Governance Specification
## Version 1.0

# 1. Purpose

This document defines how SafeCheck will be structured, developed, released, governed, and extended as an open-source project.

The goal is to create a project that is:

- easy to understand
- easy to run locally
- easy to contribute to
- difficult to accidentally break
- attractive to developers
- useful independently of the hosted SafeCheck service
- capable of accepting community-built detectors and integrations

The central principle:

> **The open-source project must be genuinely useful on its own.**

The hosted service should provide convenience and scale—not lock users into proprietary functionality.

---

# 2. Open-Source Philosophy

SafeCheck should follow:

```text
Open Engine
+
Open Rules
+
Open Schemas
+
Open Documentation
+
Open Evaluation Methodology
+
Community Contributions
```

The project should avoid becoming:

```text
Open-source wrapper
+
closed detection engine
+
closed rules
```

That would undermine the project's purpose.

---

# 3. Repository Strategy

Use a monorepo initially.

Recommended:

```text
safecheck/
│
├── apps/
├── packages/
├── services/
├── rules/
├── datasets/
├── evaluation/
├── docs/
├── examples/
├── scripts/
├── infrastructure/
└── .github/
```

---

# 4. Repository Structure

Complete initial structure:

```text
safecheck/
│
├── apps/
│   ├── web/
│   └── docs/
│
├── packages/
│   ├── core/
│   ├── schemas/
│   ├── analyzers/
│   ├── rules/
│   ├── threat-intel/
│   ├── sdk-js/
│   ├── cli/
│   ├── config/
│   └── utils/
│
├── services/
│   ├── api/
│   ├── worker/
│   ├── fetcher/
│   └── intelligence/
│
├── rules/
│   ├── text/
│   ├── url/
│   ├── domain/
│   ├── brand/
│   └── regional/
│
├── datasets/
│   ├── examples/
│   ├── public/
│   └── manifests/
│
├── evaluation/
│   ├── benchmarks/
│   ├── regression/
│   ├── adversarial/
│   └── reports/
│
├── docs/
│   ├── architecture/
│   ├── detection/
│   ├── api/
│   ├── security/
│   └── contributing/
│
├── examples/
│   ├── basic/
│   ├── custom-detector/
│   └── custom-rule/
│
├── infrastructure/
│   ├── docker/
│   ├── terraform/
│   └── deployment/
│
├── scripts/
│
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── CODEOWNERS
│   └── dependabot.yml
│
├── LICENSE
├── README.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── GOVERNANCE.md
├── pnpm-workspace.yaml
└── package.json
```

---

# 5. Package Boundaries

The most important architectural rule:

> **No package should depend upward into an application layer.**

Dependency direction:

```text
apps
 ↓
services
 ↓
packages
 ↓
core
```

Never:

```text
core
 ↓
web
```

---

# 6. Core Package

Package:

```text
@safecheck/core
```

Contains:

- analysis orchestration
- detector interfaces
- evidence model
- risk engine
- confidence engine
- recommendation engine
- analyzer registry

Must remain framework-independent.

It should not depend on:

- React
- Next.js
- Fastify
- PostgreSQL
- Redis
- browser APIs

---

# 7. Schemas Package

```text
@safecheck/schemas
```

Contains:

- input schemas
- output schemas
- error schemas
- shared enums
- API contracts

Example:

```typescript
export const RiskLevel = z.enum([
  "low",
  "suspicious",
  "high",
  "critical",
  "inconclusive"
]);
```

---

# 8. Analyzer Package

```text
@safecheck/analyzers
```

Contains implementations for:

```text
Text
URL
Domain
Brand
Behavior
```

Future:

```text
OCR
Image
QR
Email
Webpage
```

---

# 9. Rules Package

```text
@safecheck/rules
```

Responsible for loading and validating declarative rules.

Rules should remain separate from detector implementation.

Example:

```text
Detector:
"Detect credential requests."

Rule:
"What constitutes a credential request?"
```

---

# 10. Threat Intelligence Package

```text
@safecheck/threat-intel
```

Provides adapters for external providers.

Architecture:

```text
ThreatIntelProvider
       │
 ┌─────┼─────┐
 ↓     ↓     ↓
Feed A Feed B Feed C
```

The core engine should not depend directly on a specific provider.

---

# 11. SDK Package

```text
@safecheck/sdk
```

Provides the developer-facing API.

It should contain:

- client
- authentication
- request serialization
- response parsing
- retries
- errors
- types

---

# 12. CLI Package

```text
@safecheck/cli
```

Provides:

```bash
safecheck check ...
safecheck config ...
safecheck version
```

CLI logic should call the SDK/core rather than duplicate detection logic.

---

# 13. API Service

```text
services/api
```

Responsible for:

- HTTP
- authentication
- authorization
- rate limits
- request validation
- serialization
- observability

Detection remains in:

```text
@safecheck/core
```

---

# 14. Fetch Worker

```text
services/fetcher
```

Handles potentially dangerous external resources.

It is isolated from:

- database
- admin services
- internal application network

This is a security boundary.

---

# 15. Web Application

```text
apps/web
```

Responsible for:

- UI
- accessibility
- interaction
- visualization
- authentication UX

It must not implement:

```text
risk scoring
detector logic
threat intelligence logic
```

---

# 16. Documentation Website

```text
apps/docs
```

Should contain:

- getting started
- architecture
- API reference
- SDK documentation
- CLI documentation
- rule development
- detector development
- security
- contribution guide

---

# 17. Rule Repository Structure

```text
rules/
├── text/
│   ├── urgency/
│   ├── credential/
│   ├── payment/
│   └── threats/
│
├── url/
│   ├── obfuscation/
│   ├── redirect/
│   └── suspicious-path/
│
├── domain/
│   ├── lookalike/
│   └── reputation/
│
├── brand/
│
└── regional/
    ├── india/
    ├── southeast-asia/
    └── global/
```

---

# 18. Rule Format

Rules should be data-driven.

Example:

```yaml
id: SC-TEXT-CREDENTIAL-001

name: OTP Request

category: text

version: 1

severity: 4

weight: 0.80

conditions:
  any:
    - otp_request
    - password_request
    - pin_request

explanation:
  title: Credential request detected
  message: The content asks the recipient to provide a security credential.
```

---

# 19. Rule Validation

Every rule must pass:

```text
Schema validation
↓
Syntax validation
↓
Security validation
↓
Benchmark evaluation
↓
Regression evaluation
```

before merging.

---

# 20. Custom Detectors

Developers should be able to build:

```typescript
class MyDetector implements Detector {
  id = "my-detector";

  supports(input) {
    return input.type === "text";
  }

  async analyze(input, context) {
    return {
      indicators: []
    };
  }
}
```

Then register:

```typescript
engine.registerDetector(new MyDetector());
```

---

# 21. Plugin Architecture

Future plugin API:

```typescript
interface SafeCheckPlugin {
  name: string;
  version: string;

  detectors?: Detector[];
  rules?: Rule[];
  providers?: ThreatIntelProvider[];
}
```

This enables:

- enterprise rules
- research detectors
- regional intelligence
- custom integrations

---

# 22. Plugin Security

Plugins should NOT automatically receive:

- network access
- filesystem access
- secrets
- database access

A plugin should explicitly request capabilities.

Future:

```text
capabilities:
  - analyze:text
  - analyze:url
```

---

# 23. Community Contribution Types

Contributors can submit:

### Rules

New scam patterns.

### Detectors

New analysis techniques.

### Threat providers

New intelligence integrations.

### Dataset examples

New benchmark cases.

### Documentation

Guides and corrections.

### Integrations

Bots, extensions, apps.

### Bug fixes

Core improvements.

---

# 24. Good First Issues

Create labels:

```text
good first issue
help wanted
documentation
rule contribution
detector
security
benchmark
frontend
backend
```

The repository should continuously maintain beginner-friendly tasks.

---

# 25. Contribution Workflow

Standard flow:

```text
Fork
 ↓
Create branch
 ↓
Implement
 ↓
Tests
 ↓
Benchmark
 ↓
Security checks
 ↓
Pull Request
 ↓
Review
 ↓
CI
 ↓
Merge
```

---

# 26. Branch Naming

Examples:

```text
feature/domain-lookalike-detector
fix/url-parser
rule/upi-scam
docs/custom-detectors
test/unicode-evasion
```

---

# 27. Commit Convention

Recommended Conventional Commits:

```text
feat:
fix:
docs:
test:
refactor:
perf:
security:
chore:
```

Example:

```text
feat(detector): add domain lookalike detection
```

---

# 28. Pull Request Requirements

Every PR should describe:

```text
What changed?
Why?
How was it tested?
Did benchmark performance change?
Did security posture change?
Does documentation need updating?
```

---

# 29. Required Checks

CI should run:

```text
Type checking
Linting
Unit tests
Integration tests
Schema validation
Rule validation
Benchmark subset
Security scanning
Dependency scanning
Build
```

---

# 30. CODEOWNERS

Sensitive components should have designated maintainers.

Example:

```text
/packages/core/       @core-maintainers
/services/fetcher/   @security-maintainers
/rules/              @detection-maintainers
/infrastructure/     @infra-maintainers
```

---

# 31. Protected Branches

Main branch requires:

- pull request
- review
- passing CI
- no unresolved required checks

No direct pushes.

---

# 32. Security-Sensitive PRs

Changes involving:

- authentication
- SSRF
- sandboxing
- cryptography
- secrets
- permissions

require security review.

---

# 33. RFC Process

Large architectural changes should use RFCs.

Examples:

```text
RFC-001
Browser extension architecture

RFC-002
Plugin API

RFC-003
Community threat intelligence

RFC-004
Offline threat database
```

RFC lifecycle:

```text
Draft
 ↓
Discussion
 ↓
Review
 ↓
Accepted / Rejected
 ↓
Implementation
```

---

# 34. Governance

Initial governance can be maintainer-led.

As the project grows:

```text
Core Maintainers
      │
 ┌────┼──────────────┐
 ↓    ↓              ↓
Core Detection   Security   Community
```

Eventually establish a formal steering group if project scale warrants it.

---

# 35. Maintainer Responsibilities

Maintainers are responsible for:

- code quality
- security
- release management
- architecture
- community health
- review standards
- benchmark integrity

Maintainers should not arbitrarily change detection results without documented reasoning.

---

# 36. Detection Governance

Changes to:

- risk thresholds
- scoring weights
- critical rules
- threat-intel weighting

should require documented evaluation.

Example:

```text
Change:
Credential request weight
0.70 → 0.80

Reason:
Benchmark v1.4

Precision:
+1.1%

Recall:
+0.3%

False positives:
-0.2%
```

---

# 37. Dataset Governance

Dataset additions should document:

- source
- license
- collection method
- annotation
- privacy status
- expected labels

Never add private user content without appropriate authorization.

---

# 38. Sensitive Dataset Policy

Do not publish:

- personal phone numbers
- OTPs
- credentials
- private conversations
- private URLs containing tokens
- personally identifying information

unless properly anonymized and legally appropriate.

---

# 39. Open Benchmark vs Private Data

Use:

```text
Public benchmark
+
Private holdout
```

The public benchmark enables community development.

The private set prevents overfitting.

---

# 40. Licensing

Recommended approach:

### Core code

A permissive OSI-approved license such as:

```text
Apache-2.0
```

This encourages:

- adoption
- forks
- commercial usage
- integrations

### Documentation

Use an appropriate documentation/content license.

### Datasets

Each dataset must retain its own licensing requirements.

### Threat feeds

Only redistribute feeds where licensing permits.

---

# 41. Trademark

The open-source code and the SafeCheck brand should be treated separately.

This allows:

```text
SafeCheck-compatible forks
```

without automatically granting the right to impersonate the official SafeCheck service.

A trademark policy should be added when the project reaches meaningful public adoption.

---

# 42. Security Policy

Repository must include:

```text
SECURITY.md
```

Containing:

- supported versions
- vulnerability reporting
- response expectations
- disclosure process

---

# 43. Code of Conduct

Use a standard open-source Code of Conduct.

Goals:

- welcoming contributors
- respectful disagreement
- no harassment
- transparent moderation

---

# 44. Documentation Standard

Every major component should have:

```text
README
API reference
Example
Architecture explanation
Test instructions
Contribution guide
```

If developers cannot understand a package without reading its source code, documentation is insufficient.

---

# 45. Architecture Decision Records

Store decisions:

```text
docs/architecture/adr/
```

Example:

```text
ADR-001 Monorepo
ADR-002 TypeScript Core
ADR-003 Declarative Rules
ADR-004 Sandboxed URL Fetching
ADR-005 Risk/Confidence Separation
```

---

# 46. Release Strategy

Use semantic versioning:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.0.0
1.1.0
1.1.1
2.0.0
```

---

# 47. Release Channels

Possible channels:

```text
stable
beta
nightly
```

Most users should use:

```text
stable
```

Developers can test:

```text
beta
```

---

# 48. Automated Releases

Release pipeline:

```text
Git Tag
 ↓
CI
 ↓
Tests
 ↓
Security Scan
 ↓
Build
 ↓
Package
 ↓
Publish
 ↓
GitHub Release
```

---

# 49. Package Publishing

Potential packages:

```text
@safecheck/core
@safecheck/schemas
@safecheck/sdk
@safecheck/cli
@safecheck/analyzers
@safecheck/rules
```

Each package should only be published when useful independently.

---

# 50. Changelog

Every release should communicate:

```text
Added
Changed
Fixed
Security
Deprecated
Breaking
```

Example:

```text
## 1.3.0

Added
- Punycode detector
- Kannada scam rules

Improved
- Domain matching

Security
- Hardened redirect validation
```

---

# 51. Backward Compatibility

Avoid breaking:

- SDK APIs
- CLI commands
- rule schemas
- result schemas

without a major version.

---

# 52. Community Threat Intelligence

Long-term architecture:

```text
User Report
     ↓
Validation
     ↓
Abuse Detection
     ↓
Human / Automated Review
     ↓
Threat Candidate
     ↓
Independent Confirmation
     ↓
Threat Intelligence
```

Never immediately convert:

```text
1 report
```

into:

```text
confirmed malicious
```

---

# 53. Contributor Reputation

Future community systems may track:

```text
accepted contributions
false reports
rule quality
review history
```

But reputation should never become a social popularity contest.

Technical quality remains primary.

---

# 54. Contributor Recognition

Use:

- contributor list
- GitHub contributors
- release notes
- monthly highlights
- security researcher acknowledgements

Recognition increases community participation.

---

# 55. Research Contributions

SafeCheck should make it easy for researchers to contribute:

```text
New detector
+
Benchmark
+
Evaluation report
```

A researcher should be able to demonstrate:

> “This detector improves phishing recall by 3.2% while increasing false positives by only 0.1%.”

---

# 56. Reproducibility

Research results should ideally include:

```text
Engine version
Rule version
Model version
Dataset version
Configuration
Hardware
Runtime
```

This makes results reproducible.

---

# 57. Community Extensions

Potential ecosystem:

```text
safecheck-vscode
safecheck-discord
safecheck-slack
safecheck-telegram
safecheck-email
safecheck-firefox
safecheck-chrome
safecheck-android
safecheck-python
```

The official repository should not need to maintain all integrations.

---

# 58. Integration Guidelines

Third-party integrations should use:

```text
public API
SDK
or
core package
```

rather than copying internal code.

---

# 59. Official vs Community Integrations

Clearly label:

```text
Official
Community
Experimental
Deprecated
```

This protects users from assuming every integration is maintained by SafeCheck.

---

# 60. Project Health Metrics

Track:

```text
GitHub stars
Forks
Contributors
PRs
Issue resolution
Downloads
SDK usage
CLI installs
External integrations
Benchmark improvements
```

But:

> Stars are not the project's primary success metric.

The strongest signal is:

> **People actually use SafeCheck.**

---

# 61. Contributor Funnel

Optimize:

```text
Discover
 ↓
Clone
 ↓
Run locally
 ↓
Make first change
 ↓
Open PR
 ↓
Become contributor
 ↓
Become maintainer
```

Target:

> A developer should be able to run SafeCheck locally within minutes.

---

# 62. README Strategy

The README must immediately communicate:

```text
What is SafeCheck?
Why does it exist?
Show me a result.
How do I install it?
How do I use it?
How do I contribute?
```

Example opening:

```text
# SafeCheck

> Before you click it, check it.

An open-source, privacy-first engine for analyzing
suspicious messages, URLs, and domains.

safecheck check https://example.com
```

---

# 63. Demo-First Repository

The repository should contain:

```text
30-second demo
60-second setup
5-minute contribution guide
```

A visitor should understand the project without reading the entire architecture.

---

# 64. Issue Templates

Templates:

```text
Bug Report
Feature Request
Detection Rule
False Positive
False Negative
Security Vulnerability
Documentation
RFC
```

---

# 65. False Positive Issue Template

Example:

```text
Input type:
URL / Text / Domain

SafeCheck result:
HIGH

Expected:
LOW

Why?

Reproduction:

SafeCheck version:
```

This directly feeds the evaluation pipeline.

---

# 66. False Negative Issue Template

Example:

```text
SafeCheck missed:

Input type:
URL

Expected:
CRITICAL

Observed:
LOW

Evidence:

Source:
```

Sensitive scam content should be handled carefully and not posted publicly when it exposes active malicious infrastructure or private information.

---

# 67. Security Researcher Workflow

Researchers should have a safe path:

```text
Discover bypass
 ↓
Private security report
 ↓
Validation
 ↓
Patch
 ↓
Regression test
 ↓
Disclosure
```

This encourages responsible security research.

---

# 68. Dependency Policy

Prefer:

> **Few high-quality dependencies over many convenient dependencies.**

Before adding a dependency evaluate:

- maintenance
- security history
- license
- bundle size
- transitive dependencies
- ecosystem health

---

# 69. Architecture Evolution

Do not prematurely introduce:

```text
Kubernetes
microservices everywhere
event buses
complex service meshes
distributed tracing infrastructure
```

MVP should remain understandable.

Recommended:

```text
Monorepo
+
modular packages
+
small number of services
```

Complexity should be earned.

---

# 70. Project Roadmap

### Phase 1

```text
Core
Rules
Text detector
URL detector
Threat intelligence
CLI
SDK
API
Web checker
```

### Phase 2

```text
Browser extension
QR
Screenshot
Multilingual
Community reports
```

### Phase 3

```text
Mobile
Webpage analysis
Dark-pattern detection
Advanced AI
Enterprise
```

---

# 71. Open-Source Moat

SafeCheck's long-term moat should come from:

```text
Community rules
+
Benchmark datasets
+
Detection research
+
Threat intelligence integrations
+
Integrations
+
Developer ecosystem
+
Trust
```

Not from hiding the algorithm.

---

# 72. Ecosystem Flywheel

```text
More Users
    ↓
More Reports
    ↓
Better Threat Intelligence
    ↓
Better Detection
    ↓
More Accurate Results
    ↓
More Trust
    ↓
More Users
```

Developer ecosystem adds another loop:

```text
More Developers
    ↓
More Detectors
    ↓
More Integrations
    ↓
More Users
```

---

# 73. Governance North Star

SafeCheck should remain:

> **Technically open, evidence-driven, security-conscious, and community extensible.**

No single contributor should be able to silently change the project's fundamental trust model.

---

# 74. Open-Source Definition of Done

SafeCheck is ready for public open-source launch when:

- repository structure is clean
- README explains the project
- local setup works
- core engine works independently
- CLI works
- SDK works
- API works
- basic web UI works
- benchmark exists
- security policy exists
- contribution guide exists
- code of conduct exists
- license is clear
- CI is operational
- issue templates exist
- architecture documentation exists
- first good-first-issues exist
- release process is documented

---

# 75. Final Project Model

SafeCheck should ultimately look like:

```text
                         SAFECHECK
                             │
              ┌──────────────┼──────────────┐
              ↓              ↓              ↓
          Open Core      Open Rules     Open Schemas
              │              │              │
              └──────────────┼──────────────┘
                             ↓
                     Developer Ecosystem
                             │
           ┌─────────────────┼──────────────────┐
           ↓                 ↓                  ↓
         SDKs             Integrations       Research
           │                 │                  │
           └─────────────────┼──────────────────┘
                             ↓
                           Users
                             │
                             ↓
                       Feedback/Data
                             │
                             ↓
                      Better Detection
```

# 76. Final Principle

The project should never depend on:

> “Trust us, our AI knows.”

It should instead build a community around:

> **“Here is the engine. Here are the rules. Here is the evidence. Here are the benchmarks. Inspect it, test it, improve it.”**

That is what can make SafeCheck a serious open-source security project rather than another disposable AI wrapper.