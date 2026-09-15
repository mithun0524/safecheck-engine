---
name: security-audit
description: Conducts a comprehensive security audit of SafeCheck code to prevent vulnerabilities like SSRF and data leakage.
---

# SafeCheck Security Audit

## Phase 1 — Context Gathering
Read:
- AGENTS.md
- docs/SECURITY.md
- Code in question

## Phase 2 — Static Analysis
Analyze data flow from untrusted inputs to execution or storage.
Ensure all data is treated as DATA, not instructions.

## Phase 3 — Vulnerability Search
Actively look for:
- SSRF (localhost, private IP, metadata endpoint access)
- Improper LLM output handling / Prompt injection
- Unvalidated URL fetching or redirect following
- Exposed secrets or credentials in logs or errors

## Phase 4 — Fail-Safe Verification
Ensure that on error, the system fails safely (e.g., returning INCONCLUSIVE).
Verify that no sensitive data is leaked in error messages.

## Phase 5 — Report Generation
Return a structured report:
### Audited Scope
...
### Vulnerabilities Found
...
### Remediation Steps
...
### Approval Status (APPROVED / REJECTED)
...
