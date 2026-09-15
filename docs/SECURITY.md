# SafeCheck Technical Security Architecture

## Threat Model

SafeCheck's primary threat model assumes:
- All input (URLs, domains, text, uploaded files) is potentially hostile.
- LLM outputs can be influenced by prompt injection and must be treated as untrusted data.
- The execution environment must be protected against Server-Side Request Forgery (SSRF), especially during URL resolution.

## Core Security Constraints

1. **SSRF Protection:** Any URL fetching must strictly prevent access to `localhost`, loopback addresses, private IPv4/IPv6 ranges, link-local addresses, and cloud metadata endpoints. DNS rebinding protections must be in place.
2. **Data vs Instructions:** Analyzed content is strictly DATA. It must never be evaluated, executed, or used as instructions (e.g. no dynamic `eval`, no execution of arbitrary templates).
3. **LLM Security:** The outputs of LLMs are untrusted. They must have their schemas validated, their output sanitized, and their execution tightly bounded. LLMs are never permitted to make the final risk determination.
4. **Data Privacy:** Raw user data (messages, URLs, credentials, cookies, tokens) must not be logged or persisted by default.
5. **Fail-Safe Behavior:** When a security check fails or is uncertain, the system should fail securely. Returning `INCONCLUSIVE` is strongly preferred over fabricating a result or crashing unsafely.

For development rules, see `.agents/rules/02-security.md`.