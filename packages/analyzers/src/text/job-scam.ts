import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { normalizeText } from './normalize.js';

export class JobScamDetector implements Detector {
  public id = 'text.job-scam';

  private patterns = {
    EMPLOYMENT: [
      /\b(?:work\s*from\s*home|part\s*time|full\s*time|hiring|recruiting|job\s*offer)\b/i,
      /\b(?:naukri|job\s*vacancy)\b/i
    ],
    UPFRONT_FEE: [
      /\b(?:registration|training|security)\s*(?:fee|deposit|charge)\b/i,
      /\b(?:pay\s*upfront|refundable\s*deposit|customs\s*fee)\b/i,
      /\b(?:advance\s*payment|processing\s*fee)\b/i
    ],
    GUARANTEED_INCOME: [
      /\b(?:guaranteed|high)\s*(?:income|salary|earnings|returns)\b/i,
      /\b(?:earn|make)\s*(?:\$|rs\.?|₹|inr)\s*\d+(?:,\d+)*(?:\s*per\s*(?:day|week|month))?\b/i,
      /\b(?:daily\s*payout|instant\s*withdrawal)\b/i
    ],
    TASK_OR_DEPOSIT: [
      /\b(?:like\s*videos|rate\s*hotels|subscribe\s*to\s*channels|complete\s*tasks)\b/i,
      /\b(?:prepaid\s*task|merchant\s*task)\b/i
    ],
    SENSITIVE_INFORMATION: [
      /\b(?:bank\s*details|aadhaar|pan\s*card|ssn|social\s*security)\b/i
    ]
  };

  supports(input: AnalysisInput): boolean {
    return input.type === 'text';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (input.type !== 'text') {
      throw new Error('Unsupported input type');
    }

    const normalized = normalizeText(input.value);
    const matchedCategories = new Set<string>();

    if (context.signal.aborted) throw context.signal.reason;

    for (const [category, regexList] of Object.entries(this.patterns)) {
      if (regexList.some(p => p.test(normalized))) {
        matchedCategories.add(category);
      }
    }

    if (matchedCategories.size >= 2) {
      // Stronger severity if 3 or more categories match
      const severity = matchedCategories.size >= 3 ? 'HIGH' : 'MEDIUM';
      const severityContribution = matchedCategories.size >= 3 ? 8 : 5;

      return {
        detectorId: this.id,
        indicators: [
          {
            id: `ind-${this.id}-1`,
            category: 'TEXT',
            type: 'TEXT.JOB_SCAM_PATTERN',
            severity: severity,
            confidence: 0.85,
            explanation: `Text contains suspicious combination of job patterns: ${Array.from(matchedCategories).join(', ')}`,
          }
        ],
        evidence: [
          {
            id: `ev-${this.id}-1`,
            detectorId: this.id,
            type: 'observed_fact',
            category: 'content',
            severity: severity,
            confidence: 0.85,
            title: 'Job Scam Pattern Detected',
            explanation: `The message contains a suspicious combination of employment-related patterns: ${Array.from(matchedCategories).join(', ')}.`,
            source: { name: 'JobScamDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 0.85,
        severityContribution,
      };
    }

    return {
      detectorId: this.id,
      indicators: [],
      evidence: [],
      detectorConfidence: 1.0,
      severityContribution: 0,
    };
  }
}
