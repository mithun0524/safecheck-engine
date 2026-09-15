# SafeCheck Product Scope

## MVP
SafeCheck MVP includes:
- text analysis
- URL analysis
- domain analysis
- deterministic detectors
- threat intelligence
- evidence generation
- risk scoring
- confidence scoring
- recommendations
- REST API
- CLI
- TypeScript SDK
- web interface

## NOT MVP
Do not implement without explicit approval:
- mobile application
- browser extension
- QR analysis
- screenshot analysis
- OCR
- voice analysis
- deepfake detection
- autonomous web crawling
- arbitrary JavaScript execution
- enterprise billing
- social features
- unnecessary user accounts
- Kubernetes
- unnecessary microservices

## Scope Rule
If a requested task can be completed without introducing a new system, prefer the existing system.

If the agent discovers a potentially useful feature outside scope:
DO NOT IMPLEMENT IT.
Record it as a future idea or report it to the user.
