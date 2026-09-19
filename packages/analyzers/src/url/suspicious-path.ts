import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { safeParseUrl } from '../utils/url.js';

export class SuspiciousPathDetector implements Detector {
  public id = 'url.suspicious-path';

  // Words commonly found in phishing URL paths
  private pathKeywords = [
    'login', 'secure', 'verify', 'account', 'update', 'banking', 'authenticate', 'signin', 'confirm', 'billing'
  ];

  supports(input: AnalysisInput): boolean {
    return input.type === 'url';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (context.signal.aborted) throw context.signal.reason;

    const parsed = safeParseUrl(input.value, input.type as 'url' | 'domain');
    if (!parsed) return this.emptyResult();

    const lowerPath = parsed.pathname.toLowerCase();
    
    // Check for unique matches to avoid triggering on repeated same words
    const matches = new Set<string>();
    for (const kw of this.pathKeywords) {
      if (lowerPath.includes(kw)) {
        matches.add(kw);
      }
    }

    // Conservative check: require at least 2 distinct suspicious keywords
    if (matches.size >= 2) {
      const matchArray = Array.from(matches);
      return {
        detectorId: this.id,
        indicators: [
          {
            id: `ind-${this.id}-1`,
            category: 'URL',
            type: 'URL.SUSPICIOUS_PATH',
            severity: 'MEDIUM',
            confidence: 0.7,
            explanation: `URL path contains a combination of suspicious keywords`,
          }
        ],
        evidence: [
          {
            id: `ev-${this.id}-1`,
            detectorId: this.id,
            type: 'observed_fact',
            category: 'url',
            severity: 'MEDIUM',
            confidence: 0.7,
            title: 'Suspicious Path Pattern',
            explanation: `The URL path contains multiple keywords (${matchArray.join(', ')}) often combined to create a false sense of security or urgency.`,
            source: { name: 'SuspiciousPathDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 0.7,
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
