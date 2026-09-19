# ADR-009: Deterministic URL and Domain Analysis

## Status
Accepted

## Context
Sprint 6 introduces URL and domain analysis. The primary goal is to safely detect suspicious characteristics (like IP addresses, punycode, unusual ports, lookalikes, and URL obfuscation) from strings provided as inputs to SafeCheck.
Given our strict security and privacy requirements (as detailed in ADR-008 and general governance), we must avoid introducing Server-Side Request Forgery (SSRF) vulnerabilities, privacy leaks, or massive third-party databases.

## Decision
1. **Parser boundary**: URL parsing will strictly use the WHATWG `URL` constructor provided by the standard Node.js/browser environment. 
2. **Network boundary**: Detectors will execute in-memory regex and string analysis. They will NOT execute any live DNS lookups, WHOIS queries, or HTTP fetching.
3. **Brand Intelligence**: We will use a minimal static configuration object to map primary targeted brands (e.g., `paypal`, `microsoft`, `apple`) to their canonical domains. We reject a comprehensive internet-scale brand database to keep the package deterministic and lightweight. We also reject the use of a public suffix list for Sprint 6.
4. **Lookalike Domains (Homoglyph/Typosquatting)**: We will implement a native, zero-dependency Levenshtein distance algorithm. It will calculate the distance between the hostname and the explicit official-domain registry. A distance of 1 will be considered a lookalike. Exact matches and very short domains are conservatively excluded.
5. **Conservative Combinations**: For indicators like obfuscation and suspicious paths, single signals (e.g., credentials alone, or the word 'login') will yield lower severity or no evidence at all unless combined with other structural signals (e.g., credentials + double encoding) to produce high confidence.
6. **IP Address Risk Decision**: Flagging IP-address hostnames with HIGH severity is an explicit SafeCheck v1 risk-modeling decision. It does NOT mean IP-address URLs are inherently malicious, but within the context of consumer digital trust, they are highly anomalous and suspicious.

## Consequences
**Positive**:
- Eliminates SSRF vectors completely.
- Zero network dependencies ensures high performance, resilience, and privacy preservation.
- Deterministic behavior ensures tests run quickly offline.
- Explicit brand registry prevents over-triggering on unrelated domains.

**Negative**:
- Lack of live lookups means we cannot assess domain age, dynamic redirects, or WHOIS registration details.
- Small static brand registry limits detection to the most prevalent target brands.
