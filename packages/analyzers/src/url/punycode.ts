import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { safeParseUrl } from '../utils/url.js';

export class PunycodeDetector implements Detector {
  public id = 'url.punycode';

  supports(input: AnalysisInput): boolean {
    return input.type === 'url' || input.type === 'domain';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (context.signal.aborted) throw context.signal.reason;

    const parsed = safeParseUrl(input.value, input.type as 'url' | 'domain');
    
    if (!parsed) {
      return this.emptyResult();
    }

    if (parsed.hostname.includes('xn--')) {
      return {
        detectorId: this.id,
        indicators: [
          {
            id: `ind-${this.id}-1`,
            category: 'URL',
            type: 'URL.PUNYCODE',
            severity: 'MEDIUM',
            confidence: 1.0,
            explanation: 'Hostname uses Punycode (IDN)',
          }
        ],
        evidence: [
          {
            id: `ev-${this.id}-1`,
            detectorId: this.id,
            type: 'observed_fact',
            category: 'url',
            severity: 'MEDIUM',
            confidence: 1.0,
            title: 'Punycode Hostname Detected',
            explanation: 'The hostname contains internationalized domain name (IDN) encoding, commonly used in homograph attacks to impersonate legitimate brands.',
            source: { name: 'PunycodeDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 1.0,
        severityContribution: 4,
      };
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
