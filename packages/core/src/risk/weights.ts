/**
 * Defines the static weights for different types of evidence.
 * These act as multipliers in the risk contribution formula.
 */
export const EVIDENCE_WEIGHTS: Record<string, number> = {
  // Threat Intel (For future use, documented in TRD)
  'verified-phishing': 1.00,
  'multiple-threat-matches': 1.10,

  // Text Detectors (Sprint 3 & 4)
  'text.credential-request': 0.80,
  'text.payment-request': 0.55,
  'text.urgency': 0.25,
  'text.threat': 0.20, // TRD calls this "Fear language"
  'text.reward-lure': 0.10, // Mapped to generic suspicious wording / reward lure
  'text.secrecy': 0.10, // Mapped to generic suspicious wording
  'text.job-scam-pattern': 0.55, // Mapped to payment request/advance fee level

  // URL/Domain (Sprint 6 & Future use)
  'url.ip-address': 0.80,
  'url.punycode': 0.60,
  'url.unusual-port': 0.20,
  'url.obfuscation': 0.70,
  'url.suspicious-path': 0.30,
  'brand-domain-mismatch': 0.80,
  'malicious-redirect': 0.85,
  'lookalike-domain': 0.70,
  'new-domain': 0.15,
};

/**
 * Helper to get the weight for a given evidence ID/Type.
 * Defaults to 0.10 (Generic suspicious wording) if no explicit mapping exists.
 */
export function getEvidenceWeight(evidenceType: string): number {
  return EVIDENCE_WEIGHTS[evidenceType] ?? 0.10;
}
