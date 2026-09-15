# ADR-004 — Privacy by Default and Data Minimization

Status: Accepted

## Context
SafeCheck analyzes potentially sensitive user input, such as URLs, messages, and files. Storing this data poses a significant privacy risk and liability.

## Decision
Privacy is the default. SafeCheck will not store raw user content unless explicitly required by a feature and consented to by the user. Logs will only contain metadata (IDs, durations, status codes).

## Consequences
Positive:
- Reduced legal and security liability.
- Builds trust with end users.
- Compliance with data protection regulations out of the box.

Negative:
- Debugging issues reported by users in production may be harder without the raw payload.

## Non-Negotiable
Never log raw messages, URLs, credentials, tokens, or authorization headers.
