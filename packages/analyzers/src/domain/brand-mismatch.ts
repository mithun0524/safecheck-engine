import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { safeParseUrl } from '../utils/url.js';
import { BRAND_REGISTRY } from './registry.js';

export class BrandMismatchDetector implements Detector {
  public id = 'brand-domain-mismatch';

  supports(input: AnalysisInput): boolean {
    return input.type === 'url' || input.type === 'domain';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (context.signal.aborted) throw context.signal.reason;

    const parsed = safeParseUrl(input.value, input.type as 'url' | 'domain');
    if (!parsed) return this.emptyResult();

    const hostname = parsed.hostname.toLowerCase();

    for (const [brandName, brand] of Object.entries(BRAND_REGISTRY)) {
      // Check if the brand name is being used in the hostname (e.g. as a subdomain)
      const usesBrandName = brand.comparisonLabels.some(label => hostname.includes(label));
      
      if (usesBrandName) {
        // Is it actually the official domain?
        const isOfficial = brand.officialDomains.some(d => hostname === d || hostname.endsWith(`.${d}`));
        
        if (!isOfficial) {
          return {
            detectorId: this.id,
            indicators: [
              {
                id: `ind-${this.id}-1`,
                category: 'DOMAIN',
                type: 'DOMAIN.BRAND_MISMATCH',
                severity: 'HIGH',
                confidence: 0.9,
                explanation: `Hostname uses brand '${brandName}' but does not match an official domain.`,
              }
            ],
            evidence: [
              {
                id: `ev-${this.id}-1`,
                detectorId: this.id,
                type: 'observed_fact',
                category: 'domain',
                severity: 'HIGH',
                confidence: 0.9,
                title: 'Brand Domain Mismatch',
                explanation: `The URL attempts to masquerade as '${brandName}' (e.g., using it in a subdomain) but does not resolve to the brand's official infrastructure.`,
                source: { name: 'BrandMismatchDetector', type: 'rule' },
              }
            ],
            detectorConfidence: 0.9,
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
