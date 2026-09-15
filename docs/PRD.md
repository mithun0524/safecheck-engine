# SafeCheck
## Product Requirements Document — v1.0

**Product:** SafeCheck  
**Document:** Product Requirements Document  
**Version:** 1.0  
**Status:** Draft / Pre-Development  
**Product Type:** Open-source developer infrastructure + consumer utility  
**Initial Market:** India  
**Long-Term Market:** Global  
**Primary Platform:** Web + CLI + JavaScript SDK  
**Future Platforms:** Browser Extension, Python SDK, Android, API

---

# 1. Product Overview

## 1.1 Product Definition

SafeCheck is an open-source, privacy-first digital safety engine that analyzes suspicious messages, URLs and domains and determines whether they contain indicators of scams, phishing, impersonation or other malicious behavior.

The system provides:

1. A risk classification.
2. A numerical risk score.
3. Confidence.
4. Evidence explaining the classification.
5. Recommended user action.

The core experience is:

> **Paste it → Check it → Understand it → Act safely.**

---

# 2. Product Vision

## Vision

> **Make trustworthy digital interaction as easy as checking a spelling mistake.**

SafeCheck should eventually become a reusable safety layer that can sit between users and digital interactions.

```text
User
 │
 ▼
Digital Interaction
 │
 ▼
SafeCheck
 │
 ├── Risk
 ├── Evidence
 ├── Confidence
 └── Recommendation
 │
 ▼
Safer Decision
```

---

# 3. Problem Statement

Users increasingly encounter suspicious digital communication through:

- SMS
- WhatsApp
- Email
- social media
- payment links
- QR codes
- websites
- job offers
- delivery notifications
- bank/KYC messages
- investment offers
- customer-support impersonation

The average user does not have sufficient security expertise to confidently determine whether these interactions are legitimate.

Existing solutions often suffer from one or more of the following:

- focus primarily on malware rather than social engineering,
- require technical knowledge,
- provide little explanation,
- rely heavily on centralized cloud processing,
- are closed-source,
- operate only at the browser/device-security layer,
- or are too cumbersome for a quick “is this legit?” decision.

SafeCheck addresses the decision immediately preceding user interaction:

> **“Should I trust this?”**

---

# 4. Product Goals

## 4.1 Primary Goals

### G1 — Detect suspicious interactions

Detect common scam and phishing patterns in text, URLs and domains.

### G2 — Explain the result

Every meaningful risk classification must provide understandable evidence.

### G3 — Provide actionable recommendations

Tell the user what they should do next.

### G4 — Minimize false confidence

The system must clearly distinguish between:

- known malicious,
- highly suspicious,
- uncertain,
- probably safe.

### G5 — Prioritize privacy

Where technically feasible, analysis should happen locally.

### G6 — Build a reusable open-source engine

The detection engine must be usable independently from the consumer interface.

### G7 — Make integration extremely easy

A developer should be able to integrate basic analysis with a few lines of code.

---

# 5. Non-Goals

The MVP will NOT attempt to:

- replace antivirus software,
- guarantee that a website is safe,
- guarantee that a message is legitimate,
- provide legal/financial advice,
- automatically interact with suspicious websites,
- automatically contact banks or authorities,
- perform offensive security testing,
- perform unrestricted malware analysis,
- identify the real-world identity of an attacker,
- monitor private communications without explicit user action,
- automatically block all suspicious content.

The product should assist decision-making, not claim absolute certainty.

---

# 6. Target Users

## 6.1 Primary Persona — Everyday User

### Situation

Receives a suspicious SMS/WhatsApp/email.

### Goal

Determine whether it is legitimate.

### Pain

Doesn't know how to verify it.

### Desired action

Paste/share the content and receive an immediate answer.

---

## 6.2 Secondary Persona — Family Safety User

Someone helping parents, relatives or less technically experienced users.

### Example

> “My mom received this bank message. Is it real?”

They need:

- simple results,
- understandable explanations,
- minimal technical terminology.

---

## 6.3 Developer Persona

A developer building:

- a messaging platform,
- marketplace,
- browser extension,
- security tool,
- fintech application,
- community platform.

### Goal

Add scam detection without building the detection system themselves.

### Desired experience

```javascript
const result = await safecheck.analyze({
  text,
  url
});
```

---

## 6.4 Security Researcher

Needs:

- transparent rules,
- datasets,
- evaluation metrics,
- reproducibility,
- APIs,
- extensibility.

---

# 7. Jobs To Be Done

## JTBD-01

> When I receive a suspicious message, I want to quickly determine whether it is dangerous so I don't accidentally lose money or credentials.

## JTBD-02

> When I encounter a suspicious URL, I want to know whether the destination appears trustworthy before opening it.

## JTBD-03

> When SafeCheck identifies a threat, I want to understand why so I can make my own decision.

## JTBD-04

> When I build an application that exposes users to potentially malicious content, I want a simple API/SDK for safety analysis.

## JTBD-05

> When I contribute to SafeCheck, I want clear interfaces for adding detection rules, languages, integrations and intelligence sources.

---

# 8. MVP Definition

The MVP consists of four major components:

```text
1. Core Detection Engine
2. CLI
3. Web Checker
4. JavaScript SDK
```

The MVP supports:

### Input

- plain text
- URLs
- domains

### Detection

- phishing
- impersonation
- malicious/suspicious URLs
- credential theft
- OTP requests
- financial scams
- urgency/social engineering
- fake KYC
- job scams
- investment scams
- delivery scams

### Output

- risk score
- risk level
- classification
- confidence
- evidence
- recommended action

---

# 9. MVP User Flow

## 9.1 Web Flow

```text
Landing Page
      ↓
Paste Message / URL
      ↓
Click "Check"
      ↓
Normalize Input
      ↓
Analyze
      ↓
Risk Result
      ↓
Evidence
      ↓
Recommended Action
```

---

# 10. Core User Experience

## 10.1 Landing Page

Primary headline:

> **Before you click it, check it.**

Supporting copy:

> Analyze suspicious messages, links and domains in seconds.

Primary input:

```text
┌────────────────────────────────────────┐
│ Paste a suspicious message or URL...   │
│                                        │
│                                        │
└────────────────────────────────────────┘

              [ CHECK ]
```

No mandatory registration.

---

# 11. Result States

## 11.1 Low Risk

```text
🟢 LOW RISK

No significant threat indicators were detected.

Confidence: 94%

Always independently verify sensitive requests.
```

---

## 11.2 Suspicious

```text
🟡 SUSPICIOUS

This interaction contains several warning signs.

⚠ Unusual domain
⚠ Urgency language
⚠ Financial request

Recommendation:
Verify independently before interacting.
```

---

## 11.3 High Risk

```text
🔴 HIGH RISK

This appears to be a phishing attempt.

Detected:
✗ Brand impersonation
✗ Credential request
✗ Suspicious domain

Recommendation:
DO NOT CLICK OR PROVIDE INFORMATION.
```

---

## 11.4 Unknown

```text
⚪ INCONCLUSIVE

There isn't enough evidence to determine whether this
interaction is safe.

Recommendation:
Verify through an official channel.
```

This state is critical.

SafeCheck must never turn lack of evidence into false reassurance.

---

# 12. Risk Model

The product must distinguish **risk** from **confidence**.

### Risk

How dangerous the observed signals suggest the interaction may be.

### Confidence

How certain the system is about its classification.

Example:

```text
Risk:       91/100
Confidence: 97%
```

versus:

```text
Risk:       72/100
Confidence: 54%
```

The latter should be presented more cautiously.

---

# 13. Risk Levels

| Score | Level | User Interpretation |
|---:|---|---|
| 0–19 | Low Risk | No significant indicators |
| 20–39 | Probably Safe | Limited indicators |
| 40–59 | Suspicious | Verify independently |
| 60–79 | High Risk | Avoid interaction |
| 80–100 | Critical | Strong evidence of malicious activity |

Exact thresholds must be validated experimentally.

They are not final until benchmark testing is completed.

---

# 14. Evidence Requirements

Every non-trivial classification should provide evidence.

Each evidence item contains:

```json
{
  "type": "brand_impersonation",
  "severity": "high",
  "description": "The domain resembles a known brand but does not match its verified domain.",
  "confidence": 0.98
}
```

Possible evidence types:

- `brand_impersonation`
- `domain_mismatch`
- `known_malicious_domain`
- `suspicious_redirect`
- `credential_request`
- `otp_request`
- `financial_request`
- `urgency`
- `threatening_language`
- `reward_claim`
- `investment_promise`
- `job_offer`
- `kyc_request`
- `suspicious_url_structure`
- `homoglyph_domain`
- `punycode`
- `new_domain`
- `reputation_signal`

---

# 15. Recommendation Engine

The result should include a recommended action.

Possible actions:

```text
ALLOW
PROCEED_WITH_CAUTION
VERIFY_INDEPENDENTLY
DO_NOT_INTERACT
DO_NOT_PROVIDE_CREDENTIALS
DO_NOT_SEND_MONEY
```

Examples:

### Financial scam

> Do not send money. Verify through the institution's official application or known phone number.

### Phishing

> Do not open the link. Navigate to the organization's official website manually.

### Suspicious job offer

> Do not provide identity documents or payment until the employer is independently verified.

---

# 16. Detection Requirements

## DR-01 — Text normalization

The system must normalize:

- casing
- Unicode
- whitespace
- URLs
- punctuation
- common obfuscation
- transliteration where supported

---

## DR-02 — URL normalization

The system must normalize:

- URL encoding
- redirects where safely inspectable
- punycode
- subdomains
- ports
- paths
- query parameters
- fragments

---

## DR-03 — Brand impersonation

The engine should detect when a domain resembles a known organization.

Example:

```text
claimed brand:
SBI

actual:
sbi-kyc-secure-example.com
```

The system should recognize the mismatch.

---

## DR-04 — Social engineering

Detect patterns involving:

- urgency
- fear
- authority
- financial pressure
- account suspension
- rewards
- secrecy
- credential requests.

---

## DR-05 — Credential harvesting

Detect requests for:

- passwords
- OTPs
- PINs
- CVV
- banking credentials
- identity documents
- login links.

---

## DR-06 — Financial scams

Detect:

- investment guarantees
- unrealistic returns
- payment requests
- fake refunds
- fake invoices
- account-blocking threats
- fraudulent payment links.

---

# 17. Multilingual Requirements

MVP:

- English

Post-MVP priority:

1. Hindi
2. Kannada
3. Tamil
4. Telugu
5. Marathi
6. Bengali
7. Malayalam

The engine should eventually support:

- Hinglish
- Romanized Hindi
- code-switching
- spelling variations
- slang.

---

# 18. Input Contract

The analyzer must accept a generic input object.

Example:

```json
{
  "text": "Your account will be blocked...",
  "url": "https://example.com"
}
```

The engine should automatically determine which analyzers are relevant.

---

# 19. Output Contract

Example:

```json
{
  "risk_score": 91,
  "risk_level": "high",
  "classification": "phishing",
  "confidence": 0.96,
  "signals": [
    {
      "type": "brand_impersonation",
      "severity": "high"
    },
    {
      "type": "credential_request",
      "severity": "high"
    },
    {
      "type": "urgency",
      "severity": "medium"
    }
  ],
  "recommendation": {
    "action": "do_not_interact",
    "message": "Do not open the link or provide credentials."
  }
}
```

---

# 20. JavaScript SDK Requirements

Installation:

```bash
npm install safecheck
```

Basic usage:

```javascript
import { analyze } from "safecheck";

const result = await analyze({
  text: message,
  url
});
```

Requirements:

- simple API
- TypeScript support
- strong typings
- ESM support
- CommonJS compatibility where practical
- clear errors
- deterministic local mode
- optional remote enrichment.

---

# 21. CLI Requirements

Installation:

```bash
npm install -g safecheck
```

Usage:

```bash
safecheck "https://example.com"
```

or:

```bash
safecheck --file message.txt
```

Output:

```text
SafeCheck
─────────

Risk: 91/100
Level: HIGH
Classification: PHISHING

Signals:
  ✗ Brand impersonation
  ✗ Credential request
  ✗ Suspicious domain

Recommendation:
  DO NOT INTERACT
```

The CLI should support machine-readable output:

```bash
safecheck --json "https://example.com"
```

---

# 22. Web Application Requirements

## Functional Requirements

### FR-WEB-01

User can paste text.

### FR-WEB-02

User can paste a URL.

### FR-WEB-03

System automatically detects URLs contained in text.

### FR-WEB-04

User can submit analysis without creating an account.

### FR-WEB-05

System displays analysis progress.

### FR-WEB-06

System displays risk level.

### FR-WEB-07

System displays risk score.

### FR-WEB-08

System displays evidence.

### FR-WEB-09

System displays recommended action.

### FR-WEB-10

User can copy/share the result.

### FR-WEB-11

User can report an incorrect result.

---

# 23. Developer Requirements

The core engine must be independent of the web application.

Architecture:

```text
safecheck-core
      ↑
 ┌────┼────┐
 │    │    │
CLI  Web  SDK
```

This ensures that the product is not locked to one frontend.

---

# 24. Privacy Requirements

## PR-01

No account should be required for basic checking.

## PR-02

No personal information should be collected unnecessarily.

## PR-03

Local analysis should be preferred.

## PR-04

Cloud enrichment must be optional where possible.

## PR-05

Sensitive content should not be retained by default.

## PR-06

Telemetry should be opt-in where feasible.

## PR-07

Privacy documentation must clearly explain:

- what is processed,
- where it is processed,
- what is stored,
- how long it is stored,
- what external services receive.

---

# 25. Security Requirements

SafeCheck itself is a security-sensitive product.

It must:

- validate all inputs,
- sandbox remote analysis where applicable,
- avoid executing untrusted content unnecessarily,
- prevent SSRF,
- protect API endpoints,
- rate-limit abuse,
- sanitize rendered content,
- prevent XSS,
- isolate third-party intelligence providers,
- maintain dependency security.

The system must never fetch arbitrary URLs from privileged internal networks.

---

# 26. Performance Requirements

### Local text analysis

Target:

> <100 ms for basic deterministic analysis.

### URL analysis

Target:

> <1 second excluding external network latency.

### Full analysis

Target:

> <2–3 seconds for standard cases.

### Web UI

Initial interaction should feel immediate.

---

# 27. Availability

Consumer web checker target:

> 99.9% availability after production maturity.

SDK/local engine:

> Must remain functional without SafeCheck cloud infrastructure where local analysis is supported.

This is a key open-source principle.

---

# 28. Architecture Requirements

The architecture must be modular.

```text
                Input
                  │
                  ▼
          Input Normalizer
                  │
        ┌─────────┼──────────┐
        ▼         ▼          ▼
       Text       URL       Domain
        │         │          │
        └─────────┼──────────┘
                  ▼
           Detection Layer
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
     Rules        ML         Intel
       │          │          │
       └──────────┼──────────┘
                  ▼
            Risk Engine
                  │
                  ▼
          Evidence Builder
                  │
                  ▼
        Recommendation Engine
                  │
                  ▼
               Output
```

---

# 29. AI/ML Requirements

AI/ML is optional for MVP where deterministic approaches provide sufficient quality.

If ML is introduced, it must:

- be benchmarked,
- expose confidence,
- support versioning,
- support regression testing,
- have documented training/evaluation methodology.

LLMs should primarily assist with:

- contextual classification,
- explanation,
- multilingual understanding,
- semantic pattern detection.

LLM output must not directly determine the final verdict without validation.

---

# 30. Threat Intelligence Requirements

Threat intelligence should be modular.

Provider interface:

```typescript
interface ThreatProvider {
  lookup(input: Indicator): Promise<ThreatResult>;
}
```

Possible providers:

- public phishing databases
- abuse feeds
- domain reputation
- community reports
- future commercial feeds

Providers must be independently replaceable.

---

# 31. Rules Engine

Detection rules should be:

- versioned,
- testable,
- independently deployable,
- documented,
- attributable.

Example:

```yaml
id: credential_request
severity: high

conditions:
  - asks_for: otp
  - asks_for: password
  - asks_for: cvv

score: 20
```

Rules should not be buried inside application code.

---

# 32. Community Contribution

Contributors should be able to submit:

- detection rules,
- test cases,
- language patterns,
- threat indicators,
- integrations,
- documentation.

Every new rule must include tests.

---

# 33. Error Handling

SafeCheck must distinguish:

### No threat detected

from:

### Unable to analyze

Example:

```text
Analysis unavailable.
The domain could not be safely inspected.

This does NOT mean the site is safe.
```

Never translate technical failure into a safe result.

---

# 34. Abuse Prevention

Potential abuse includes:

- mass URL scanning,
- intelligence harvesting,
- automated scraping,
- API abuse,
- malicious payload submission,
- denial-of-service attempts.

Controls:

- rate limits
- request size limits
- authentication for high-volume APIs
- provider quotas
- abuse monitoring
- sandboxing
- request validation.

---

# 35. Accessibility Requirements

The web interface should target WCAG 2.2 AA where practical.

Requirements:

- keyboard navigation
- screen-reader compatibility
- sufficient contrast
- semantic HTML
- non-color-only risk indicators
- accessible error states
- readable typography.

Risk must never be communicated through color alone.

Example:

```text
🔴 HIGH RISK
```

rather than simply a red card.

---

# 36. Analytics

Analytics should be privacy-preserving.

Important metrics:

### Product

- analyses/day
- successful analyses
- analysis latency
- repeat usage
- result distribution

### Safety

- confirmed malicious rate
- false-positive reports
- false-negative reports
- confidence calibration

### Developer

- SDK downloads
- CLI installs
- API calls
- active integrations
- contributors.

No sensitive message content should be used for analytics by default.

---

# 37. Feedback System

Every result should allow:

```text
Was this helpful?

[ 👍 ] [ 👎 ]
```

For incorrect results:

```text
Why was this result incorrect?

○ False positive
○ False negative
○ Wrong category
○ Explanation incorrect
○ Other
```

This feedback can improve the system while preserving privacy.

---

# 38. Reporting System

Users may optionally report suspicious content.

The system should extract only necessary indicators.

Example:

```text
URL:
example.com

Category:
Phishing

Brand:
Bank

User confirmation:
Likely scam
```

Personal conversations should not automatically become public datasets.

---

# 39. Data Model

Core entities:

```text
Analysis
Indicator
Evidence
Threat
Rule
Provider
Classification
Recommendation
Feedback
Report
```

Conceptual relationship:

```text
Analysis
 │
 ├── Indicators
 │
 ├── Evidence
 │
 ├── Classification
 │
 ├── Risk
 │
 └── Recommendation
```

---

# 40. Acceptance Criteria — MVP

The MVP is considered functional when:

### AC-01

A user can submit a plain-text scam message.

### AC-02

The system detects common scam indicators.

### AC-03

A user can submit a URL.

### AC-04

The system analyzes URL/domain characteristics.

### AC-05

The system returns a risk level.

### AC-06

The system returns evidence.

### AC-07

The system returns an actionable recommendation.

### AC-08

The system can represent uncertainty.

### AC-09

The CLI can perform the same core analysis.

### AC-10

The JavaScript SDK can perform the same core analysis.

### AC-11

Core analysis can function without the web frontend.

### AC-12

Automated tests cover all production detection rules.

### AC-13

The system does not expose submitted content unnecessarily.

### AC-14

Technical failures cannot result in a false “safe” classification.

---

# 41. Quality Gates

The MVP cannot launch merely because the UI works.

It must pass:

## Detection quality

- benchmark evaluation
- false-positive testing
- false-negative testing
- adversarial examples

## Security

- dependency audit
- SSRF testing
- XSS testing
- input fuzzing
- API abuse testing

## Privacy

- data-flow review
- telemetry review
- retention review

## Performance

- latency benchmarks
- concurrent request testing
- memory profiling.

---

# 42. MVP Success Metrics

Initial targets should be treated as hypotheses and revised after baseline testing.

### Consumer

- 10,000 analyses during initial public launch period
- >25% returning users
- <3 second median analysis time

### Detection

- high-risk classifications should achieve very high precision
- false-positive rate must remain low enough to preserve trust
- all benchmark results published transparently

### Developer

- 1,000+ package downloads during initial launch
- 25+ external users/integrations
- 10+ external contributors as an early community goal

### Open source

- meaningful GitHub issues/PRs
- contributor diversity
- external rules and detectors.

The project should optimize for **useful adoption**, not vanity metrics.

---

# 43. Release Strategy

## Alpha

Audience:

- founders/developers
- security researchers
- friends/community

Focus:

- detection quality
- architecture
- feedback.

---

## Beta

Audience:

- developers
- early consumers
- security community.

Add:

- browser extension
- improved intelligence
- reporting
- multilingual experiments.

---

## Public v1

Audience:

- general users
- developers
- organizations.

Requirements:

- stable SDK
- documentation
- privacy policy
- security review
- benchmark report
- contributor documentation.

---

# 44. Out-of-Scope for v1

Explicitly defer:

- voice analysis
- deepfake detection
- full malware sandbox
- automatic browser blocking
- banking integrations
- WhatsApp API integrations
- enterprise dashboards
- dark-pattern detection
- advanced webpage behavioral analysis
- automated takedown requests.

These belong to later product phases.

---

# 45. Future Product Expansion

## Phase 2

```text
QR
Email
Screenshot
Browser Extension
Python SDK
```

## Phase 3

```text
Webpage DOM
Dark Patterns
Mobile Share Sheet
Community Threat Intelligence
```

## Phase 4

```text
Multilingual Intelligence
Advanced Web Analysis
Enterprise API
Private Deployment
```

## Phase 5

```text
Voice
Deepfake Signals
Identity Impersonation
Real-time Digital Trust Graph
```

---

# 46. Product Moat

SafeCheck's long-term advantage should not be “we have an LLM.”

The moat should come from:

### 1. Detection knowledge

Continuously improving rules and models.

### 2. Community

Developers contribute new detectors and indicators.

### 3. Threat intelligence

Aggregated and validated signals.

### 4. Evaluation

A strong public benchmark becomes difficult to replicate.

### 5. Ecosystem

SDKs, integrations, extensions and applications.

### 6. Trust

Open-source + transparent evidence + privacy.

### 7. Distribution

The free checker becomes the consumer entry point while the SDK becomes developer infrastructure.

---

# 47. Product Flywheel

```text
More users
    ↓
More suspicious examples
    ↓
Better threat intelligence
    ↓
Better detection
    ↓
More accurate results
    ↓
More user trust
    ↓
More users
```

Developer ecosystem:

```text
More developers
      ↓
More integrations
      ↓
More analyses
      ↓
More edge cases
      ↓
Better rules
      ↓
Better engine
      ↓
More developers
```

---

# 48. Open-Source Flywheel

```text
Users
 ↓
Reports
 ↓
Threat intelligence
 ↓
Rules
 ↓
Contributors
 ↓
Better engine
 ↓
More integrations
 ↓
More users
```

This is the intended growth engine.

---

# 49. Launch Positioning

Primary statement:

> **Before you click it, check it.**

Secondary:

> Open-source, privacy-first protection against scams, phishing and digital impersonation.

Developer positioning:

> **The open-source safety layer for digital interactions.**

---

# 50. Launch Assets

Before public launch, prepare:

### Product

- web checker
- CLI
- JS SDK
- documentation

### Engineering

- GitHub repository
- CI/CD
- tests
- benchmark suite
- security policy
- contribution guide

### Community

- Discord/other community channel
- GitHub Discussions
- issue templates
- contributor onboarding

### Content

- launch article
- technical deep dive
- “How SafeCheck detects scams”
- real scam analysis examples
- developer tutorial
- demo video.

---

# 51. Documentation Requirements

Required documentation:

```text
README.md
CONTRIBUTING.md
SECURITY.md
PRIVACY.md
LICENSE
CODE_OF_CONDUCT.md
CHANGELOG.md
ARCHITECTURE.md
DETECTION.md
EVALUATION.md
API.md
```

---

# 52. Dependencies on Future Documents

This PRD becomes the source for:

```text
PRD
 │
 ├── TRD
 │
 ├── System Architecture
 │
 ├── Detection Specification
 │
 ├── API Specification
 │
 ├── UI/UX Specification
 │
 ├── Security & Privacy Specification
 │
 ├── Evaluation & Benchmark Specification
 │
 ├── Open-Source Governance
 │
 └── GTM Strategy
```

---

# 53. Critical Product Decisions

The following decisions are intentional:

### Decision 1

**Open-source core.**

### Decision 2

**Privacy-first architecture.**

### Decision 3

**Evidence-first explanations.**

### Decision 4

**Risk + confidence rather than binary safe/unsafe.**

### Decision 5

**Text + URL + domain as the MVP.**

### Decision 6

**No mandatory account.**

### Decision 7

**Developer SDK is a first-class product, not an afterthought.**

### Decision 8

**AI is one component of the detection stack, not the entire product.**

### Decision 9

**The system must be capable of saying “I don't know.”**

### Decision 10

**The core engine must be independent from the consumer UI.**

---

# 54. Open Questions

These should be resolved during TRD/research rather than guessed now.

### Detection

- Which threat-intelligence providers should be supported?
- Which datasets can legally be redistributed?
- Which signals can be evaluated locally?
- Which model architecture provides the best accuracy/latency trade-off?

### Privacy

- What information is required for remote enrichment?
- What should telemetry contain?
- Should anonymous threat reports be opt-in?

### Product

- Should the web checker be completely anonymous?
- Should users be able to save analysis history?
- Should results be shareable by default?

### Business

- Which API capabilities remain free?
- What constitutes enterprise value?
- Should hosted API usage be monetized?

### Community

- Who validates submitted rules?
- How are malicious/incorrect community contributions handled?
- How should rule provenance be represented?

---

# 55. Definition of Done — Product

SafeCheck v1 is ready for public release when:

- [ ] Text analysis works.
- [ ] URL analysis works.
- [ ] Domain analysis works.
- [ ] Risk scoring is calibrated.
- [ ] Evidence is explainable.
- [ ] Recommendations are actionable.
- [ ] Uncertainty is represented.
- [ ] Core engine is independently usable.
- [ ] JS SDK is published.
- [ ] CLI is published.
- [ ] Web checker is live.
- [ ] Automated tests cover detection rules.
- [ ] Benchmark dataset exists.
- [ ] Security testing is completed.
- [ ] Privacy architecture is documented.
- [ ] Documentation is complete.
- [ ] Contribution workflow exists.
- [ ] Feedback/reporting exists.
- [ ] Launch metrics are instrumented without unnecessary personal-data collection.

---

# 56. Final Product Principle

SafeCheck should never try to convince users:

> **“Trust SafeCheck.”**

Instead, the product should teach users:

> **“Here is the evidence. Now you can make a safer decision.”**

That distinction is fundamental.

The ultimate product isn't merely a scam classifier.

It is a **digital trust engine**.

---

# 57. Next Engineering/Product Artifacts

This PRD should now drive the following documents in order:

## 01 — TRD
Technical architecture, technology choices, services, databases, APIs, models, infrastructure and security architecture.

## 02 — System Architecture
Detailed component and data-flow architecture.

## 03 — Detection Specification
Exact detection taxonomy, rules, scoring model, ML/LLM pipeline and evidence schema.

## 04 — UI/UX Specification
Information architecture, user journeys, wireframes, interaction states and design system.

## 05 — API Specification
REST API, SDK contracts, authentication, errors, rate limits and versioning.

## 06 — Security & Privacy Specification
Threat model, attack surface, data handling, privacy architecture and security controls.

## 07 — Evaluation & Benchmark Specification
Datasets, metrics, adversarial testing, calibration and regression testing.

## 08 — Open-Source Governance
Repository structure, contribution model, licensing, security disclosures and release management.

## 09 — GTM & Growth Strategy
Launch, developer adoption, consumer acquisition, content, community and partnerships.

---

# Product North Star

> **SafeCheck makes the question “Can I trust this?” answerable in seconds — with evidence, not guesswork.**