# SafeCheck
## The Open-Source Safety Layer for Digital Communication

**Working tagline:**  
> **Before you click it, check it.**

**Core question:**  
> **“Bro, can I trust this?”**

**Document type:** Master Product / Project Blueprint  
**Status:** Concept → Pre-PRD  
**Initial market:** India  
**Long-term market:** Global  
**Primary model:** Open-source core + consumer utilities + developer ecosystem  
**Initial focus:** Scam, phishing, impersonation and malicious-link detection

---

# 1. Executive Summary

SafeCheck is an open-source, privacy-first safety engine designed to help people determine whether a digital interaction is potentially dangerous.

The core idea is deliberately simple:

> Give SafeCheck a message, URL, domain, QR code, email, image, or eventually an entire webpage, and it explains whether the interaction appears safe, suspicious, or dangerous — and, critically, **why**.

SafeCheck is not intended to be another antivirus product, generic AI chatbot, or security dashboard.

It is intended to become a reusable **safety intelligence layer** that developers, consumers, organizations, browser extensions, mobile applications, messaging tools, and security products can integrate.

The fundamental experience should take seconds:

```text
User receives suspicious message
            ↓
      "Check this"
            ↓
      SafeCheck Engine
            ↓
    Evidence + Risk Score
            ↓
 SAFE / SUSPICIOUS / DANGEROUS
            ↓
     Clear explanation
            ↓
       Recommended action
```

The initial implementation will focus on **text + URL + domain analysis**, with later expansion into QR codes, email, webpage analysis, screenshots/images, voice/deepfake signals, and behavioral scam patterns.

---

# 2. Why This Problem Matters

Digital scams are no longer an occasional nuisance.

They are becoming part of everyday digital communication.

McAfee's 2026 India research reports that Indians receive an average of **13 scam messages per day**, spend around **102 hours per year** trying to determine what is real or fake, and that **51% of surveyed Indians reported losing money to a scam**. The research also notes that modern scams increasingly resemble legitimate delivery notices, bank alerts, subscription renewals, tax messages, job offers and other routine communications.

TransUnion reported in June 2026 that **59% of Indian consumers surveyed said they had been targeted by digital fraud between August and December 2025**, with phishing being the most reported scheme. It also reported a suspected digital-fraud rate of 7.1% for Indian consumer transactions in 2025, almost twice the global rate of 3.8%.

This creates a fundamental usability problem:

People are being forced to become amateur cybersecurity analysts.

They have to ask:

- Is this SMS real?
- Is this bank link legitimate?
- Is this job offer genuine?
- Is this courier message real?
- Is this QR code safe?
- Is this domain actually owned by the company?
- Is this investment opportunity legitimate?
- Is this customer-support account real?
- Is this WhatsApp message from my relative?
- Is this government notification genuine?

Most people do not have the knowledge or time to answer these questions reliably.

SafeCheck exists to reduce that cognitive burden.

---

# 3. The Core Problem Statement

## Primary problem

> **People cannot reliably determine whether digital content is trustworthy before interacting with it.**

Traditional scam education tells users to look for:

- spelling mistakes,
- suspicious URLs,
- poor branding,
- unusual grammar,
- obvious urgency.

Those signals are becoming less reliable.

Modern scams increasingly use:

- professional language,
- copied branding,
- realistic websites,
- legitimate-looking domains,
- AI-generated content,
- social engineering,
- impersonation,
- contextual information,
- multi-step conversations.

McAfee specifically reports that nearly one in five suspicious social messages in its India research contained **no link at all**, meaning traditional “don't click suspicious links” advice is insufficient.

Therefore:

> SafeCheck must analyze **behavior and evidence**, not merely suspicious-looking URLs.

---

# 4. Product Vision

## Vision

> **Make trustworthy digital interaction as easy as checking a spelling mistake.**

A person should not need to understand cybersecurity to protect themselves.

SafeCheck should eventually become a common primitive embedded throughout the digital ecosystem.

Imagine:

```text
Browser
   ↓
SafeCheck

Email client
   ↓
SafeCheck

Messaging app
   ↓
SafeCheck

Banking app
   ↓
SafeCheck

Mobile OS
   ↓
SafeCheck

Developer application
   ↓
SafeCheck
```

The long-term vision is:

> **SafeCheck becomes an open safety layer for the internet.**

---

# 5. Product Philosophy

SafeCheck should be built around five principles.

## 5.1 Evidence over vibes

The system must not simply say:

> “AI thinks this is a scam.”

Instead:

> **91/100 — High Risk**

And then:

- Domain does not match claimed organization.
- URL contains suspicious redirect behavior.
- Message creates artificial urgency.
- User is asked for credentials.
- Domain reputation is poor.

Every important classification should have explainable signals.

---

## 5.2 Privacy by default

Users may submit extremely sensitive information.

Therefore:

> **Local analysis should be preferred whenever technically possible.**

The architecture should support:

```text
Input
 ↓
Local analysis
 ↓
High-confidence result?
 ├── YES → Return result
 └── NO
       ↓
Optional cloud analysis
```

Cloud analysis should never be mandatory for the core experience where local analysis is sufficient.

---

## 5.3 Fast enough to use in real life

If analysis takes 30 seconds, users won't use it.

Target:

- local analysis: near-instant
- URL reputation lookup: sub-second where possible
- cloud enrichment: ideally <2–3 seconds
- complex webpage analysis: asynchronous where necessary

The product must feel like:

> “Check → answer.”

---

## 5.4 Never create false confidence

SafeCheck should never imply:

> “This is definitely safe.”

Instead, use calibrated language:

- Safe / Low Risk
- Probably Safe
- Suspicious
- High Risk
- Confirmed Malicious

Where evidence is insufficient:

> **Unable to confidently determine. Verify through an official channel.**

This is a critical safety principle.

---

## 5.5 Open source should be a feature

The core engine should be inspectable.

Users should be able to understand:

- what signals are used,
- what data is collected,
- how scoring works,
- what external intelligence sources are used,
- how models are evaluated,
- how false positives are handled.

Trust is part of the product.

---

# 6. Target Users

## Primary user groups

### A. Everyday internet users

People receiving:

- SMS
- WhatsApp messages
- emails
- social media messages
- payment requests
- links
- QR codes

Their question:

> “Is this real?”

---

### B. Families

Especially users helping parents or less technically experienced family members.

Example:

Parent:

> “Beta, this bank message came. Is it real?”

Instead of manually investigating:

> Share → SafeCheck.

---

### C. Developers

Developers want a reusable safety layer rather than building scam detection themselves.

Example:

```javascript
const result = await safecheck.analyze({
  text,
  url
});
```

---

### D. Businesses

Potential future users:

- fintech
- e-commerce
- marketplaces
- banks
- customer-support platforms
- HR/recruitment platforms
- communication platforms

---

### E. Security researchers

Researchers can use:

- detection rules,
- threat datasets,
- benchmarks,
- anonymized patterns,
- APIs,
- evaluation tools.

---

# 7. Initial Scope

SafeCheck should NOT attempt to solve every cybersecurity problem immediately.

## Version 0.1

Focus exclusively on:

### Text analysis

Detect:

- phishing language
- urgency
- financial pressure
- credential requests
- OTP requests
- impersonation
- fake rewards
- fake employment
- investment scams
- delivery scams
- KYC scams
- account suspension threats

### URL analysis

Detect:

- domain mismatch
- brand impersonation
- suspicious TLDs
- punycode/homoglyph attacks
- URL obfuscation
- excessive subdomains
- suspicious paths
- redirect chains
- URL shorteners
- credential-related paths
- known malicious URLs

### Domain intelligence

Analyze:

- domain age where available
- registration information where available
- reputation
- DNS characteristics
- TLS characteristics
- known abuse
- brand similarity
- known phishing databases

---

# 8. Future Scope

## Version 0.2

- QR code analysis
- email analysis
- screenshot analysis
- webpage metadata
- browser extension
- CLI

## Version 0.3

- webpage DOM analysis
- checkout manipulation
- dark-pattern detection
- suspicious downloads
- attachment analysis

## Version 0.4

- Android share-sheet integration
- multilingual scam detection
- Hindi and major Indian-language support
- community reporting

## Version 0.5+

- voice scam signals
- deepfake indicators
- scam conversation analysis
- enterprise API
- real-time threat intelligence
- collaborative threat graph

---

# 9. The Core Engine

The engine should be modular.

```text
safecheck/
│
├── core/
│   ├── analyzer
│   ├── risk-engine
│   ├── scoring
│   ├── evidence
│   └── policy
│
├── analyzers/
│   ├── text
│   ├── url
│   ├── domain
│   ├── email
│   ├── qr
│   └── webpage
│
├── detectors/
│   ├── phishing
│   ├── impersonation
│   ├── urgency
│   ├── credential-theft
│   ├── financial-scam
│   ├── investment-scam
│   ├── job-scam
│   ├── delivery-scam
│   └── kyc-scam
│
├── intelligence/
│   ├── reputation
│   ├── threat-feeds
│   ├── domain-data
│   └── community-data
│
├── models/
│   ├── text-classifier
│   ├── similarity
│   └── optional-llm
│
├── adapters/
│   ├── javascript
│   ├── python
│   ├── browser
│   └── android
│
└── cli/
```

---

# 10. Detection Architecture

SafeCheck should use multiple layers.

```text
                INPUT
                  │
        ┌─────────▼──────────┐
        │ Input Normalization │
        └─────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │ Deterministic Rules │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │ Threat Intelligence │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │ ML Classification   │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │ Optional LLM Layer  │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │ Evidence Aggregator │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │ Risk Scoring Engine │
       └──────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │ User Explanation    │
       └─────────────────────┘
```

---

# 11. Risk Scoring

The initial scoring model can be deterministic and transparent.

Example:

```text
Domain impersonation       +30
Known malicious domain     +40
Credential request         +20
Urgency                    +10
Financial pressure         +15
Suspicious redirect        +15
New/untrusted domain       +10
Brand mismatch             +20
Known safe domain          -30
Verified organization     -20
```

The actual scoring system should eventually be calibrated using real evaluation datasets rather than arbitrary weights.

Output:

```json
{
  "risk_score": 92,
  "risk_level": "high",
  "classification": "phishing",
  "confidence": 0.97,
  "evidence": [],
  "recommended_action": "do_not_interact"
}
```

---

# 12. Explainability

Every result should contain evidence.

Example:

```text
🔴 HIGH RISK — 94/100

This message is likely attempting to impersonate SBI.

Why:

❌ The URL does not belong to the official SBI domain.
❌ The message asks you to complete KYC through a link.
❌ It uses urgent account-blocking language.
❌ The domain has suspicious reputation signals.

Recommended action:

Do not open the link.
Open the official SBI application or website manually.
```

The user should understand the result without knowing anything about cybersecurity.

---

# 13. Threat Intelligence

SafeCheck should not attempt to recreate all threat intelligence from scratch.

Potential data sources include:

- PhishTank
- OpenPhish
- public abuse feeds
- domain reputation sources
- DNS intelligence
- certificate transparency data
- community reports
- user-submitted indicators

PhishTank provides an API and downloadable verified phishing datasets, including URL, target, submission time, verification status and related metadata.

OpenPhish also provides phishing feeds and describes real-time consumption and offline database use cases. Its community feed is updated every 12 hours, while higher-tier feeds update more frequently.

SafeCheck must respect the terms, licenses and usage restrictions of every external data source.

---

# 14. AI's Role

AI should be used carefully.

AI is useful for:

- contextual classification
- language understanding
- multilingual analysis
- scam-category detection
- explanation generation
- extracting entities
- identifying social-engineering patterns

AI should NOT be the sole authority.

The architecture should prefer:

```text
Rules
+
Threat Intelligence
+
Statistical/ML Models
+
Optional LLM reasoning
=
Final assessment
```

rather than:

```text
LLM
 ↓
"Trust me bro"
```

This is especially important because the broader AI ecosystem has a significant trust problem. Stack Overflow's 2025 survey found that 46% of developers distrust AI output accuracy compared with 33% who trust it, while 66% reported frustration with AI outputs that are “almost right.”

SafeCheck should therefore make **evidence and confidence** first-class concepts.

---

# 15. Privacy Architecture

Privacy should be one of SafeCheck's strongest differentiators.

## Default principle

> Analyze locally whenever possible.

Potential architecture:

```text
               USER DATA
                   │
                   ▼
          Local SafeCheck Core
                   │
          ┌────────┴────────┐
          │                 │
     Sufficient          Insufficient
       signal                signal
          │                 │
          ▼                 ▼
       RESULT       Optional cloud enrichment
```

Cloud requests should minimize data.

Instead of:

> Send entire WhatsApp conversation.

Prefer:

> Extract only the relevant URL/domain/necessary text.

Sensitive data should not be retained by default.

---

# 16. User Experience

The first product experience should be extremely simple.

## Landing page

Headline:

> **Before you click it, check it.**

Subheading:

> Analyze suspicious messages, links and websites in seconds.

Input:

```text
Paste a message or URL...

[ CHECK ]
```

No account required.

No onboarding.

No unnecessary dashboard.

---

# 17. Core Result Experience

### Safe

```text
🟢 LOW RISK

No significant threat indicators detected.

Confidence: 94%

Still verify sensitive requests through official channels.
```

### Suspicious

```text
🟡 SUSPICIOUS

This interaction contains several warning signs.

⚠️ Unusual domain
⚠️ Urgency language
⚠️ Financial request

Recommendation:
Verify independently before interacting.
```

### Dangerous

```text
🔴 HIGH RISK

This appears to be a phishing attempt.

❌ Brand impersonation
❌ Credential request
❌ Malicious domain reputation

DO NOT CLICK.
```

---

# 18. Browser Extension

The browser extension becomes the first major consumer product.

Possible UI:

```text
┌─────────────────────────────┐
│ 🛡 SafeCheck                │
│                             │
│ 🔴 High Risk                │
│                             │
│ This site appears to        │
│ impersonate a known brand.  │
│                             │
│ 4 risk signals detected.    │
│                             │
│ [See why]                   │
│                             │
│ [Go back]                   │
└─────────────────────────────┘
```

The extension should avoid blocking everything.

It should provide graduated intervention.

---

# 19. Share-Based Mobile Experience

One of the most powerful experiences:

```text
WhatsApp
   ↓
Share
   ↓
SafeCheck
   ↓
Analyze
   ↓
Result
```

This eliminates the need for intrusive messaging-app integrations.

---

# 20. CLI / Developer Experience

Example:

```bash
safecheck "https://example.com"
```

Output:

```text
SafeCheck
─────────

Risk: 87/100
Level: HIGH
Category: PHISHING

Signals:
  ✗ Domain impersonation
  ✗ Suspicious URL structure
  ✗ Known phishing indicator

Recommendation:
  DO NOT INTERACT
```

---

# 21. SDK

JavaScript:

```javascript
import SafeCheck from "safecheck";

const result = await SafeCheck.analyze({
  text: message,
  url
});
```

Python:

```python
from safecheck import analyze

result = analyze(
    text=message,
    url=url
)
```

---

# 22. API

Potential endpoint:

```http
POST /v1/analyze
```

Request:

```json
{
  "text": "Your account will be blocked...",
  "url": "https://example.com"
}
```

Response:

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
      "type": "urgency",
      "severity": "medium"
    }
  ],
  "recommended_action": "do_not_interact"
}
```

---

# 23. Dark-Pattern Expansion

A major future expansion is website manipulation detection.

This is a natural extension because the underlying philosophy is identical:

> **Help users understand whether digital interaction is trustworthy.**

A 2026 Datum Intelligence report estimated Indian consumers lose ₹25,000–₹28,000 crore annually to dark patterns such as hidden charges, forced add-ons, drip pricing, false urgency and subscription traps. The study reported that 88% of India's 304 million online buyers were affected.

SafeCheck could eventually identify:

- hidden fees
- preselected add-ons
- fake countdown timers
- misleading buttons
- forced continuity
- difficult cancellation
- disguised advertising
- deceptive checkout flows
- drip pricing

Example:

```text
🟡 POTENTIAL DARK PATTERNS

Checkout changed from:

₹799

to:

₹1,066

Detected:
+ ₹79 handling
+ ₹39 platform fee
+ ₹49 convenience fee
+ ₹99 protection

Potential pattern:
Drip pricing
```

This gives SafeCheck a second enormous consumer problem domain.

---

# 24. Community Threat Intelligence

SafeCheck should eventually allow users to report suspicious content.

Example:

```text
[ Report this scam ]
```

The system extracts relevant indicators while removing personal information.

Possible dataset:

```text
scam_id
category
domain
brand
language
country
timestamp
signals
confidence
status
```

This can evolve into an open threat-intelligence ecosystem.

---

# 25. Multilingual Strategy

India-first means multilingual support should eventually be a core capability.

Initial languages:

1. English
2. Hindi
3. Kannada
4. Tamil
5. Telugu
6. Marathi
7. Bengali
8. Malayalam

Scam detection must handle:

- code-switching
- transliteration
- Hinglish
- slang
- spelling variations
- Romanized Indian languages

Example:

> “bhai account band ho jayega jaldi verify kr”

should still be recognized as urgency + account impersonation even though it is not formal Hindi or English.

---

# 26. Competitive Positioning

SafeCheck should NOT compete directly with traditional antivirus products.

Instead:

| Existing approach | SafeCheck |
|---|---|
| Device security | Digital interaction safety |
| Malware-focused | Scam + phishing + social engineering |
| Black-box | Explainable |
| Cloud-heavy | Local-first |
| Enterprise-first | Developer + consumer |
| Closed | Open-source core |
| Block everything | Risk + evidence + recommendation |
| Security dashboard | Simple answer |

SafeCheck's positioning:

> **The safety layer between humans and digital interactions.**

---

# 27. Open-Source Strategy

The open-source repository should be structured for contribution.

Potential repositories:

```text
safecheck/
safecheck-js/
safecheck-python/
safecheck-browser/
safecheck-android/
safecheck-rules/
safecheck-datasets/
safecheck-docs/
```

Initially, however, avoid fragmenting the project too aggressively.

Start with a monorepo if that simplifies development.

---

# 28. Contribution Model

Contributors should be able to work on:

### Detection rules

```text
detectors/phishing/
detectors/impersonation/
detectors/urgency/
```

### Threat intelligence adapters

```text
providers/phishtank/
providers/openphish/
```

### Language support

```text
languages/hi/
languages/kn/
languages/ta/
```

### Models

```text
models/text-classifier/
```

### Integrations

```text
integrations/browser/
integrations/android/
```

This allows contributors with different skill levels to participate.

---

# 29. Evaluation Framework

This is extremely important.

SafeCheck cannot simply claim:

> “94% accurate.”

It needs a reproducible benchmark.

Dataset categories:

- legitimate bank messages
- legitimate delivery notifications
- phishing messages
- fake KYC
- job scams
- investment scams
- fake customer support
- fake government messages
- malicious URLs
- benign URLs
- brand impersonation
- multilingual samples

Metrics:

### Classification

- Precision
- Recall
- F1
- ROC-AUC where appropriate

### Safety

- False negative rate
- False positive rate
- high-risk precision

### Performance

- latency
- memory usage
- CPU utilization
- model size

### Privacy

- data transmitted
- retained data
- local processing percentage

The project should publish evaluation methodology openly.

---

# 30. False Positives

False positives are dangerous.

If SafeCheck repeatedly marks legitimate messages as dangerous:

Users stop trusting it.

Therefore:

> **Trust calibration is more important than maximizing detection rate.**

Every high-risk classification should have strong evidence.

Borderline results should become:

> “Suspicious — verify independently.”

rather than:

> “SCAM!!!”

---

# 31. Safety Rules

SafeCheck should never encourage the user to interact with suspicious content for testing.

Instead of:

> “Click here to verify.”

say:

> “Open the organization's official application or manually type its known official website.”

For financial situations:

> “Contact the institution through a verified number or official application.”

The system should actively prevent risky recommendations.

---

# 32. Monetization

The open-source core remains free.

Potential commercial layers:

## Free

- local engine
- CLI
- basic SDK
- community rules
- consumer checker

## Pro/API

- high-volume API
- advanced threat intelligence
- enterprise SLA
- analytics
- custom rules
- private deployment

## Enterprise

- on-premise
- private threat intelligence
- compliance
- custom integrations
- dedicated support

The business should monetize **infrastructure and scale**, not basic safety.

---

# 33. Growth Strategy

The strongest acquisition strategy is not traditional advertising.

It is:

> **Education + utility + sharing.**

---

## 33.1 Free checker

Launch:

> `checkthis` / SafeCheck web utility

User pastes suspicious content.

No signup.

Immediate answer.

---

## 33.2 Shareable results

Allow users to share:

```text
SafeCheck detected this as HIGH RISK.

Why:
❌ Fake domain
❌ Urgency
❌ Credential request
```

This naturally creates distribution.

---

## 33.3 Scam education

Publish content such as:

> “This fake SBI message is dangerous. Here's how we detected it.”

> “5 courier scams currently targeting Indians.”

> “Don't fall for this fake KYC message.”

> “How scammers use AI to make fake job offers.”

Each piece demonstrates the product.

---

# 34. Developer Growth

GitHub is a major acquisition channel.

The README should immediately communicate:

```text
# SafeCheck

Open-source safety intelligence for the internet.

Detect:
✓ Phishing
✓ Scam messages
✓ Malicious URLs
✓ Impersonation
✓ Social engineering

npm install safecheck
```

Then show a five-line example.

No massive documentation wall before the first useful example.

---

# 35. Viral Developer Features

Potentially powerful features:

### GitHub Action

```yaml
uses: safecheck/action@v1
```

Scan links in repositories.

### Slack bot

```text
/check https://...
```

### Discord bot

```text
!check https://...
```

### Browser extension

> Check this page

### API playground

> Paste → analyze → copy API request

These create multiple entry points into the same ecosystem.

---

# 36. Launch Strategy

## Phase 0 — Validation

Before writing the complete engine:

- collect 500–1,000 real examples
- categorize them
- identify recurring patterns
- identify false-positive cases
- benchmark existing services
- establish evaluation metrics

Goal:

> Prove that the problem can be solved reliably enough to be useful.

---

## Phase 1 — MVP

Build:

- text analyzer
- URL analyzer
- domain analyzer
- deterministic rule engine
- basic threat intelligence
- CLI
- JS SDK
- web demo

Target:

> First useful result in <2 seconds.

---

## Phase 2 — Public Launch

Release:

- GitHub
- npm
- PyPI
- documentation
- web checker
- browser extension

Launch message:

> **Before you click it, check it.**

---

## Phase 3 — Community

Add:

- reporting
- rules contributions
- datasets
- benchmarks
- multilingual support

Goal:

> Turn users into contributors.

---

## Phase 4 — Ecosystem

Add:

- mobile
- browser
- API
- integrations
- enterprise deployment

Goal:

> Make SafeCheck infrastructure.

---

# 37. First 90 Days

## Days 1–15

Research.

Deliverables:

- threat taxonomy
- 500+ examples
- competitor analysis
- detection requirements
- evaluation dataset
- architecture proposal

No major UI work yet.

---

## Days 16–30

Build engine foundation.

Deliverables:

- parser
- URL normalization
- rule engine
- risk scoring
- evidence model
- CLI

---

## Days 31–45

Detection.

Deliverables:

- phishing detectors
- impersonation detector
- urgency detector
- financial scam detector
- credential detector
- domain intelligence

---

## Days 46–60

Developer ecosystem.

Deliverables:

- JS SDK
- Python SDK
- documentation
- examples
- tests
- benchmark suite

---

## Days 61–75

Consumer layer.

Deliverables:

- web checker
- polished result UI
- shareable results
- browser extension prototype

---

## Days 76–90

Public launch.

Deliverables:

- GitHub launch
- Product Hunt / relevant communities
- Reddit launch posts
- developer outreach
- technical article
- scam-analysis content series
- contributor onboarding

---

# 38. Success Metrics

Do not optimize only for GitHub stars.

Track:

## Developer

- GitHub stars
- forks
- contributors
- npm downloads
- PyPI downloads
- API usage
- GitHub issues
- pull requests

## Consumer

- checks/day
- repeat users
- suspicious links analyzed
- average analysis latency
- share rate
- extension installs

## Safety

- precision
- recall
- false-positive rate
- false-negative rate
- confirmed scam detection rate

## Community

- scam reports
- new detection rules
- dataset contributions
- community validations

---

# 39. North-Star Metric

The strongest north-star metric should be:

> **Potentially harmful interactions successfully identified before user interaction.**

Not:

> Number of AI calls.

Not:

> Number of website visits.

Not:

> GitHub stars.

The project exists to prevent harm.

---

# 40. Long-Term Vision

SafeCheck should eventually understand:

```text
        ┌────────────────────┐
        │ Digital Interaction│
        └─────────┬──────────┘
                  │
       ┌──────────▼──────────┐
       │ SafeCheck Intelligence│
       └──────────┬──────────┘
                  │
    ┌─────────────┼──────────────┐
    │             │              │
   Text          URL            Image
    │             │              │
   Email         QR           Screenshot
    │             │              │
    └─────────────┼──────────────┘
                  │
          Risk + Evidence
                  │
        ┌─────────┴─────────┐
        │                   │
     Consumer           Developer
        │                   │
   Browser/App/API     SDK/API/CLI
```

Eventually:

> **SafeCheck should be able to answer whether a digital interaction is trustworthy, why it believes that, and what the user should do next.**

---

# 41. The Bigger Opportunity

The most important insight is that SafeCheck does not have to remain a “scam detector.”

The broader category is:

# Digital Trust Infrastructure

Scams are one part.

Dark patterns are another.

Malicious websites are another.

Fake identities are another.

AI-generated misinformation is another.

Suspicious downloads are another.

Deepfake impersonation is another.

The common question is:

> **“Can I trust this digital interaction?”**

That is the category SafeCheck can own.

---

# 42. Final Product Definition

## SafeCheck

> **An open-source, privacy-first digital trust engine that analyzes messages, URLs, websites and other digital interactions to identify scams, phishing, impersonation and deceptive behavior — while providing transparent evidence and actionable recommendations.**

### The three defining characteristics:

**1. Open**

Developers can inspect, extend and integrate it.

**2. Explainable**

Every important decision has evidence.

**3. Privacy-first**

Local analysis is preferred and cloud processing is minimized.

---

# 43. The MVP in One Sentence

> **Paste a suspicious message or URL, and SafeCheck tells you within seconds whether it looks dangerous — and exactly why.**

---

# 44. The Long-Term One-Liner

> **SafeCheck is the open-source safety layer between people and the internet.**

---

# 45. Documentation Roadmap

This master blueprint should become the source for the following project documents:

### 01 — Product Requirements Document (PRD)
Defines:
- user stories
- functional requirements
- non-functional requirements
- MVP scope
- acceptance criteria
- product metrics

### 02 — Technical Requirements Document (TRD)
Defines:
- architecture
- services
- modules
- APIs
- data models
- infrastructure
- security
- performance

### 03 — System Architecture Document
Defines:
- component architecture
- data flow
- threat-intelligence pipeline
- local/cloud execution
- model architecture

### 04 — UI/UX Specification
Defines:
- user journeys
- wireframes
- interaction states
- information architecture
- accessibility
- design system

### 05 — API Specification
Defines:
- endpoints
- authentication
- schemas
- errors
- rate limits
- SDK behavior

### 06 — Security & Privacy Specification
Defines:
- threat model
- data handling
- privacy guarantees
- encryption
- retention
- abuse prevention

### 07 — Detection Specification
Defines:
- threat taxonomy
- rules
- scoring
- model requirements
- evidence format
- confidence calibration

### 08 — Evaluation & Benchmark Specification
Defines:
- datasets
- test methodology
- metrics
- false-positive testing
- regression testing

### 09 — Open-Source Governance
Defines:
- contribution process
- code of conduct
- issue templates
- security disclosures
- maintainership
- release process

### 10 — Go-To-Market Strategy
Defines:
- launch
- developer acquisition
- content strategy
- community
- partnerships
- distribution

---

# 46. Immediate Next Step

Do **not** start coding from this document yet.

The next step should be converting this blueprint into a rigorous **PRD**.

The PRD should force us to answer:

- Who exactly is the first user?
- What is the MVP?
- What is explicitly out of scope?
- What does “safe” actually mean?
- What inputs are supported?
- What constitutes evidence?
- How should risk be scored?
- What happens when the system is uncertain?
- What are the exact user flows?
- What are the acceptance criteria?
- What metrics determine whether MVP succeeded?

After that:

**PRD → TRD → Architecture → Detection Spec → UI/UX → API Spec → Security/Privacy → Evaluation → OSS/GTM**

That gives us an actual engineering-grade project plan rather than jumping straight into implementation.