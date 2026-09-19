import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { safeParseUrl } from '../utils/url.js';

export class UnusualPortDetector implements Detector {
  public id = 'url.unusual-port';

  private standardPorts = new Set(['', '80', '443']);

  supports(input: AnalysisInput): boolean {
    return input.type === 'url';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (context.signal.aborted) throw context.signal.reason;

    const parsed = safeParseUrl(input.value, input.type as 'url' | 'domain');
    
    if (!parsed) {
      return this.emptyResult();
    }

    if (!this.standardPorts.has(parsed.port)) {
      return {
        detectorId: this.id,
        indicators: [
          {
            id: `ind-${this.id}-1`,
            category: 'URL',
            type: 'URL.UNUSUAL_PORT',
            severity: 'LOW',
            confidence: 1.0,
            explanation: 'URL specifies a non-standard port',
          }
        ],
        evidence: [
          {
            id: `ev-${this.id}-1`,
            detectorId: this.id,
            type: 'observed_fact',
            category: 'url',
            severity: 'LOW',
            confidence: 1.0,
            title: 'Unusual Port Detected',
            explanation: 'The URL directs to a non-standard network port.',
            source: { name: 'UnusualPortDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 1.0,
        severityContribution: 2,
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
