import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { safeParseUrl } from '../utils/url.js';
import { levenshteinDistance } from '../utils/distance.js';
import { BRAND_REGISTRY } from './registry.js';

export class LookalikeDomainDetector implements Detector {
  public id = 'lookalike-domain';

  supports(input: AnalysisInput): boolean {
    return input.type === 'url' || input.type === 'domain';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (context.signal.aborted) throw context.signal.reason;

    const parsed = safeParseUrl(input.value, input.type as 'url' | 'domain');
    if (!parsed) return this.emptyResult();

    const hostname = parsed.hostname.toLowerCase();

    // Conservative check: very short domains are prone to false positive distance-1 matches
    if (hostname.length < 5) {
      return this.emptyResult();
    }

    // Fast path: if the hostname is an exact match for an official domain, it's not a lookalike
    for (const brand of Object.values(BRAND_REGISTRY)) {
      if (brand.officialDomains.some(d => hostname === d || hostname.endsWith(`.${d}`))) {
        return this.emptyResult(); // It's legitimate
      }
    }

    // Remove top-level domain for comparison if possible, or just compare the whole hostname.
    // Since we don't have a public suffix list, comparing 'paypa1.com' to 'paypal' will have distance 4.
    // Let's strip the last segment as a naive TLD removal strictly for the candidate string.
    // Example: 'paypa1.com' -> 'paypa1'
    const parts = hostname.split('.');
    const coreCandidate = parts.length > 1 ? parts.slice(0, -1).join('.') : hostname;

    for (const [brandName, brand] of Object.entries(BRAND_REGISTRY)) {
      for (const label of brand.comparisonLabels) {
        // We compare the core candidate to the comparison label (e.g. 'paypa1' vs 'paypal')
        const distance = levenshteinDistance(coreCandidate, label);
        
        // Distance 0 means exact match of label, but since it wasn't caught by the officialDomains
        // check, it means they are using the brand name with a DIFFERENT TLD. That's a lookalike/mismatch.
        // Distance 1 means typosquatting/homoglyph.
        if (distance === 1 || distance === 0) {
          return {
            detectorId: this.id,
            indicators: [
              {
                id: `ind-${this.id}-1`,
                category: 'DOMAIN',
                type: 'DOMAIN.LOOKALIKE',
                severity: 'HIGH',
                confidence: 0.8,
                explanation: `Hostname resembles the brand '${brandName}'`,
              }
            ],
            evidence: [
              {
                id: `ev-${this.id}-1`,
                detectorId: this.id,
                type: 'observed_fact',
                category: 'domain',
                severity: 'HIGH',
                confidence: 0.8,
                title: 'Lookalike Domain Detected',
                explanation: `The domain name closely resembles the known brand '${brandName}', which is a common typosquatting or homoglyph technique.`,
                source: { name: 'LookalikeDomainDetector', type: 'rule' },
              }
            ],
            detectorConfidence: 0.8,
            severityContribution: 8,
          };
        }
      }
    }

    return this.emptyResult();
  }

  private emptyResult(): DetectorResult {
    return {
      detectorId: this.id,
      indicators: [],
      evidence: [],
      detectorConfidence: 1.0,
      severityContribution: 0,
    };
  }
}
