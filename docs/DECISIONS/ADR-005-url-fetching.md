# ADR-005 — Strict SSRF Protection for URL Fetching

Status: Accepted

## Context
SafeCheck needs to fetch external URLs for analysis. This introduces the risk of Server-Side Request Forgery (SSRF), where an attacker could force the engine to scan internal network resources.

## Decision
All URL fetching functionality must be isolated and subjected to strict SSRF protections.
This includes DNS resolution checks, blocking private/loopback IP ranges, and preventing DNS rebinding attacks.

## Consequences
Positive:
- Prevents critical security vulnerabilities.
- Safe to deploy in cloud environments with metadata endpoints.

Negative:
- Custom HTTP fetching logic is required.
- Standard libraries (like generic `fetch` or `axios` without custom agents) cannot be used directly.

## Non-Negotiable
Never allow the engine to fetch `localhost`, `127.0.0.0/8`, `169.254.169.254`, or any private network range.
