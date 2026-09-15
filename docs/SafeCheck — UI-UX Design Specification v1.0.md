# SafeCheck — UI/UX Design Specification
## Version 1.0

### 1. Design Objective

SafeCheck must answer one question extremely quickly:

> **“Can I trust this?”**

The interface must prioritize:

1. **Clarity**
2. **Speed**
3. **Evidence**
4. **Actionability**
5. **User control**
6. **Privacy**

The product must never make users feel that a high-confidence visual indicator automatically means something is safe.

The UI should communicate:

> **Risk + Confidence + Why + What to do next**

---

# 2. Design Philosophy

### 2.1 Evidence over decoration

The result screen should not be dominated by an arbitrary AI-generated score.

Instead:

**Risk**
→ **Why**
→ **Evidence**
→ **Recommended action**

### 2.2 Progressive disclosure

A normal user sees a simple answer.

A technical user can expand the analysis.

Example:

```text
⚠️ HIGH RISK

This message shows multiple signs of a phishing attempt.

[ Why? ]

• Urgent payment request
• Suspicious domain
• Brand impersonation detected

[ View technical evidence ]
```

Technical evidence can then expose:

```text
Domain age: 11 days
TLS: Valid
Threat feed matches: 2
Redirects: 4
Brand similarity: 91%
Rule IDs: SC-URL-014, SC-BRAND-003
```

---

# 3. Design System

## 3.1 Visual language

SafeCheck should feel:

- trustworthy
- modern
- lightweight
- technical
- neutral
- privacy-focused

Avoid:

- excessive gradients
- flashy AI aesthetics
- fake “cybersecurity” visuals
- skull/hacker imagery
- excessive animations
- alarmist language

---

# 4. Risk States

SafeCheck uses five primary states.

### SAFE

```text
✓ LOW RISK

No significant risk indicators were detected.
```

Important:

**LOW RISK ≠ guaranteed safe.**

Secondary text:

```text
No known threat indicators were found.
Always verify important requests independently.
```

---

### SUSPICIOUS

```text
! SUSPICIOUS

Some characteristics of this content deserve caution.
```

Recommended action:

```text
Don't click or pay yet.
Verify the sender through an official channel.
```

---

### HIGH RISK

```text
⚠ HIGH RISK

Multiple indicators associated with scams or phishing were detected.
```

Recommended action:

```text
Do not click, pay, download, or share sensitive information.
```

---

### CRITICAL

```text
⛔ CRITICAL RISK

Strong evidence indicates this may be malicious or fraudulent.
```

Recommended action:

```text
Stop interaction immediately.
Use an official website/app to verify the request.
```

---

### INCONCLUSIVE

```text
? INCONCLUSIVE

SafeCheck does not have enough reliable evidence to determine the risk.
```

Recommended action:

```text
Treat this as unverified.
Do not make financial or security-sensitive decisions based on this result alone.
```

---

# 5. Core Navigation

The web application should have a minimal navigation structure.

```text
┌─────────────────────────────────────────────┐
│ SafeCheck        Check     Docs     GitHub   │
├─────────────────────────────────────────────┤
│                                             │
│              Can I trust this?              │
│                                             │
│  Paste a message, URL, domain, or text.     │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ Paste something here...               │  │
│  │                                       │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│        [ 🔍 Check with SafeCheck ]          │
│                                             │
│          Your data. Your control.           │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 6. Homepage

## 6.1 Hero

Primary headline:

> **Before you click it, check it.**

Supporting text:

> Analyze suspicious messages, links, domains, and websites using transparent, open-source security intelligence.

Primary CTA:

**Check Something**

Secondary CTA:

**Explore the Engine**

---

## 6.2 Input Component

The primary input should accept:

- URLs
- domains
- SMS messages
- WhatsApp messages
- email text
- social media messages
- payment requests
- job offers
- arbitrary text

Placeholder:

```text
Paste a message, link, domain, or suspicious text...
```

Actions:

```text
[ Paste ]
[ Clear ]
[ Check ]
```

---

# 7. Analysis Loading State

The loading state must communicate meaningful progress.

Instead of:

> “AI is thinking...”

Use:

```text
Analyzing...

✓ Parsing input
✓ Extracting indicators
● Checking threat intelligence
○ Running risk analysis
○ Building evidence
```

This reinforces that SafeCheck is not simply asking an LLM for an opinion.

---

# 8. Result Screen

The result page is the most important screen.

Recommended structure:

```text
┌──────────────────────────────────────────────┐
│ ← New Check                                  │
│                                              │
│              ⚠ HIGH RISK                    │
│                                              │
│              Risk Score: 87/100              │
│              Confidence: High                │
│                                              │
│  This message contains multiple indicators  │
│  commonly associated with phishing scams.   │
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  WHY WE FLAGGED THIS                         │
│                                              │
│  ⚠ Suspicious domain                         │
│  ⚠ Urgent payment language                   │
│  ⚠ Brand impersonation                      │
│  ⚠ Recently registered domain                │
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  WHAT YOU SHOULD DO                          │
│                                              │
│  Don't click the link or send money.         │
│  Verify the request through the official     │
│  website or app.                             │
│                                              │
│  [ View Evidence ]                           │
│  [ Report Threat ]                            │
│  [ Check Another ]                           │
└──────────────────────────────────────────────┘
```

---

# 9. Risk Score

The score should be displayed as supporting information, not the primary truth.

Example:

```text
87 / 100
HIGH RISK
```

The UI should always display:

```text
Risk: HIGH
Confidence: HIGH
```

rather than only:

```text
87%
```

This distinction prevents users from interpreting the score as a probability.

---

# 10. Evidence Cards

Every major detection should have an evidence card.

Example:

### Suspicious Domain

```text
⚠ Suspicious Domain

The link uses a domain that does not match
the organization it appears to represent.

Evidence
Domain: secure-example-login[.]com
Claimed brand: Example Bank
Similarity: 94%

Source
SafeCheck domain analysis

[ Show technical details ]
```

Evidence should contain:

- detection
- explanation
- relevant value
- source
- confidence
- timestamp where applicable

---

# 11. Evidence Sources

The UI should distinguish between evidence types.

Possible badges:

```text
THREAT INTELLIGENCE
DOMAIN ANALYSIS
URL ANALYSIS
TEXT ANALYSIS
BRAND ANALYSIS
USER REPORT
COMMUNITY SIGNAL
AI ANALYSIS
```

AI-derived evidence should never appear equivalent to verified threat intelligence.

---

# 12. Recommendation Component

Every non-low-risk result should provide a clear action.

### Suspicious

```text
Recommended action

Pause before interacting.
Verify the sender independently.
```

### High Risk

```text
Recommended action

Do not click the link.
Do not provide credentials.
Verify using the organization's official website.
```

### Critical

```text
Recommended action

Stop interacting with this content.
If you already entered credentials or sent money,
follow your bank/service provider's incident process.
```

---

# 13. “Why?” Interaction

Users should be able to understand the result without technical knowledge.

Example:

```text
Why is this suspicious?

This message asks you to make an urgent payment
and directs you to a domain that does not match
the organization mentioned in the message.

[ Got it ]
```

This should be available directly beside major detections.

---

# 14. Technical Evidence

Advanced users can expand:

```text
Technical Evidence
────────────────────────────

Input Type
URL

Domain
example-login.com

Domain Age
11 days

Threat Intelligence
2 provider matches

Redirect Count
4

HTTPS
Valid

Brand Similarity
91%

Rules Triggered
SC-URL-014
SC-BRAND-003
SC-TEXT-011

Analysis Version
SafeCheck Engine 1.0.0
```

---

# 15. Input Privacy Indicator

The homepage should make privacy understandable.

Example:

```text
🔒 Privacy-first

SafeCheck does not store your submitted content
by default.

[ Learn how data is processed ]
```

For local execution:

```text
🔒 Analyzed locally

Your content was processed on this device.
```

For cloud execution:

```text
☁ Cloud analysis

This check requires remote threat intelligence.
See exactly what data is transmitted.
```

---

# 16. URL Analysis UX

When a URL is submitted:

```text
URL
https://example.com/login
```

SafeCheck should extract:

```text
Domain
example.com

Path
/login

Protocol
HTTPS

Redirects
3

Domain reputation
Suspicious

Threat intelligence
1 match

Brand association
Possible bank impersonation
```

The user should not need to understand DNS, certificates, WHOIS, redirects, or reputation databases.

---

# 17. Text Analysis UX

For a message:

```text
Congratulations! Your account has been
blocked. Verify immediately or your account
will be permanently suspended.
```

SafeCheck could produce:

```text
⚠ HIGH RISK

Detected signals:

• Urgency / fear
• Account-threat language
• Credential request
• Impersonation indicators

Likely tactic:
Credential phishing
```

---

# 18. Screenshot Analysis

Future UI.

User uploads:

```text
[ Drop screenshot here ]

or

[ Upload Image ]
```

SafeCheck performs:

```text
OCR
 ↓
Text extraction
 ↓
URL extraction
 ↓
Brand detection
 ↓
Visual analysis
 ↓
Risk analysis
```

Result:

```text
⚠ HIGH RISK

This screenshot appears to imitate a banking
login page.

Detected:
• Bank logo similarity
• Credential request
• Suspicious domain
• Login form
```

---

# 19. QR Code Analysis

Future flow:

```text
Scan QR
   ↓
Extract URL
   ↓
Analyze destination
   ↓
Display risk
```

Important:

The QR code itself should not automatically open the destination.

SafeCheck acts as an interception layer.

---

# 20. Browser Extension UX

The browser extension should be extremely lightweight.

Extension popup:

```text
┌──────────────────────────┐
│ 🛡 SafeCheck             │
│                          │
│ Current Page             │
│ example-login.com        │
│                          │
│ ⚠ HIGH RISK              │
│                          │
│ Possible impersonation   │
│ detected.                │
│                          │
│ [ Why? ]                 │
│ [ View Evidence ]        │
└──────────────────────────┘
```

Optional inline warning:

```text
⚠ SafeCheck detected potential risk
on this website.

[ View details ]
```

The extension should avoid blocking legitimate websites by default.

---

# 21. Mobile Share-Sheet UX

One of the highest-value future workflows.

User receives:

```text
"Your bank account will be suspended.
Click here immediately..."
```

They tap:

```text
Share → SafeCheck
```

SafeCheck opens:

```text
Analyzing shared content...

⚠ HIGH RISK

Don't click the link.

[ Why? ]
[ Report ]
```

Goal:

**<10 seconds from suspicious message to understandable result.**

---

# 22. CLI UX

Developers should be able to use:

```bash
safecheck check "https://example.com"
```

Output:

```text
SafeCheck

Risk: HIGH
Confidence: HIGH
Score: 87/100

Indicators:
  ⚠ Suspicious domain
  ⚠ Threat intelligence match
  ⚠ Brand impersonation

Recommendation:
  Do not interact with this URL.

Engine: 1.0.0
```

JSON mode:

```bash
safecheck check https://example.com --json
```

This enables automation and CI/CD integration.

---

# 23. SDK UX

Example:

```typescript
const result = await safecheck.analyze(input);

if (result.risk.level === "high") {
  console.log(result.recommendation);
}
```

The SDK should expose structured evidence rather than requiring developers to parse human-readable strings.

---

# 24. Error States

SafeCheck must distinguish:

### Invalid input

```text
We couldn't recognize this input.

Try pasting a URL, domain, or message.
```

### Threat provider unavailable

```text
Some threat intelligence sources are currently unavailable.

Result confidence has been reduced.
```

### Analysis timeout

```text
The analysis could not be completed in time.

Try again later.
```

### Incomplete evidence

```text
We couldn't collect enough reliable evidence.

Result: INCONCLUSIVE
```

Never silently convert infrastructure failure into:

```text
LOW RISK
```

---

# 25. Accessibility

SafeCheck must support:

- keyboard navigation
- screen readers
- visible focus states
- sufficient contrast
- semantic HTML
- reduced motion
- text alternatives
- accessible error messages
- no color-only risk indicators

For example:

```text
⚠ HIGH RISK
```

rather than relying solely on a red background.

---

# 26. Responsive Design

Primary breakpoints:

```text
Mobile
≤ 640px

Tablet
641–1024px

Desktop
> 1024px
```

Mobile should be the priority for the actual checking workflow.

Desktop can provide more detailed technical evidence.

---

# 27. Design Tokens

Example foundation:

```text
Spacing
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64

Radius
6 / 10 / 14 / 20

Typography
Display
Heading
Body
Caption
Mono

Risk states
LOW
SUSPICIOUS
HIGH
CRITICAL
INCONCLUSIVE
```

The exact visual palette should remain accessible and themeable.

---

# 28. Dark Mode

SafeCheck should support dark mode.

The dark interface should feel like a security tool without using stereotypical hacker aesthetics.

Prioritize:

- readable contrast
- restrained surfaces
- clear hierarchy
- minimal glow
- minimal animation

---

# 29. Interaction Rules

### Rule 1

Never hide the reason for a risk decision.

### Rule 2

Never present AI output as verified fact.

### Rule 3

Never tell users something is definitely safe solely because no threat was found.

### Rule 4

Always distinguish:

```text
Risk
Confidence
Evidence
Recommendation
```

### Rule 5

Important actions should require explicit user interaction.

### Rule 6

External URLs should never automatically open during analysis.

### Rule 7

Privacy information should be visible before submission.

---

# 30. Microcopy

Preferred:

> “No significant risk indicators were detected.”

Avoid:

> “100% SAFE!”

Preferred:

> “We found evidence associated with phishing.”

Avoid:

> “This is definitely a scam.”

Preferred:

> “Verify through the official website.”

Avoid:

> “Trust this link.”

---

# 31. Empty State

```text
🛡 SafeCheck

Nothing to check yet.

Paste a suspicious message, link,
or domain above.

You can also use SafeCheck through:
Web • CLI • SDK • Browser Extension
```

---

# 32. History

History should be **opt-in**, not automatic.

If enabled:

```text
Recent checks

⚠ example-login.com
High Risk
2 minutes ago

✓ example.com
Low Risk
Yesterday

? unknown-domain.com
Inconclusive
Yesterday
```

Users should be able to clear history locally.

Cloud history should require explicit consent.

---

# 33. Threat Reporting

Result page:

```text
Think this result is wrong?

[ Report incorrect result ]
```

Report options:

```text
○ False positive
○ Missed scam
○ Incorrect evidence
○ Incorrect brand
○ Other
```

Optional comment:

```text
Tell us what happened...
```

User content should not be retained unnecessarily.

---

# 34. Community Signals

Future feature.

Example:

```text
Community reports

23 users reported this domain
as suspicious.

First reported:
12 Sep 2026

Last reported:
15 Sep 2026
```

Community reports must be treated as **signals**, not proof.

---

# 35. Trust & Transparency Page

SafeCheck should expose:

```text
How SafeCheck works
────────────────────

1. Parse
2. Extract indicators
3. Check threat intelligence
4. Run deterministic rules
5. Analyze context
6. Calculate risk
7. Calculate confidence
8. Explain evidence
9. Recommend action
```

Also publish:

- detection methodology
- scoring methodology
- model versions
- rule versions
- threat providers
- limitations
- benchmark results
- known failure cases

---

# 36. Developer Experience

The developer section should contain:

```text
Documentation

Getting Started
CLI
JavaScript SDK
REST API
Core Engine
Analyzers
Rules
Threat Providers
Custom Detectors
Plugins
Contributing
Security
Architecture
```

The API documentation should include live examples.

---

# 37. Landing Page Information Architecture

Recommended structure:

```text
Navbar
│
├── Product
├── Developers
├── How It Works
├── Docs
├── GitHub
│
Hero
│
├── Input Checker
│
Problem
│
├── Scam examples
│
How It Works
│
├── Parse
├── Analyze
├── Verify
├── Explain
│
Capabilities
│
├── Messages
├── URLs
├── Domains
├── QR
├── Screenshots
│
Developer Section
│
├── CLI
├── SDK
├── API
│
Open Source
│
├── GitHub
├── Rules
├── Threat feeds
├── Contributions
│
Privacy
│
CTA
│
Footer
```

---

# 38. First-Time User Experience

A new user should be able to understand SafeCheck without reading documentation.

Target flow:

```text
Landing page
     ↓
Paste suspicious content
     ↓
Check
     ↓
Risk result
     ↓
Understand evidence
     ↓
Take action
```

No account should be required for basic checking.

---

# 39. UX Success Metrics

Measure:

### Time to result

Target:

**<5 seconds** for common text/URL checks.

### Time to comprehension

Target:

**<10 seconds**

User should understand:

- whether to be cautious
- why
- what to do

### Completion rate

Percentage of users who submit an input after landing.

### Evidence expansion rate

Percentage opening detailed evidence.

### False-confidence rate

Critical metric.

Measure cases where users incorrectly interpret:

```text
LOW RISK
```

as:

```text
GUARANTEED SAFE
```

### Recommendation adherence

Measure whether users understand the recommended action.

---

# 40. UX Testing Plan

Test with:

### Group A

Non-technical users.

### Group B

Developers.

### Group C

Security-conscious users.

### Group D

Older/less technically confident users.

Test scenarios:

1. suspicious SMS
2. fake bank message
3. fake job offer
4. suspicious URL
5. legitimate promotional message
6. ambiguous message
7. newly created legitimate domain

Success criterion:

Users should correctly understand the appropriate action without needing technical knowledge.

---

# 41. Design Principle for the Entire Product

SafeCheck should never attempt to make the user think:

> “The AI says this is safe.”

Instead, it should make the user think:

> **“Here is the evidence. Here is how confident SafeCheck is. Here is what I should do.”**

That distinction is fundamental to the product.

---

# 42. Final UX North Star

The ideal SafeCheck interaction is:

```text
PASTE
  ↓
ANALYZE
  ↓
RISK
  ↓
WHY
  ↓
ACTION
```

In under ten seconds.

The product should feel like:

> **Google Search for digital trust — but evidence-driven, privacy-first, and open source.**