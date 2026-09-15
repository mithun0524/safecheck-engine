import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { normalizeText } from './normalize.js';

export class JobScamDetector implements Detector {
  public id = 'text.job-scam';

  // Combinations
  private highIncomePatterns = [
    /\b(?:guaranteed|high)\s*(?:income|salary|earnings|returns)\b/i,
    /\b(?:earn|make)\s*(?:\$|rs\.?|₹|inr)\s*\d+(?:,\d+)*(?:\s*per\s*(?:day|week|month))?\b/i
  ];
  
  private lowEffortPatterns = [
    /\b(?:work\s*from\s*home|part\s*time)\b/i,
    /\b(?:no\s*interview|easy\s*tasks|like\s*videos|rate\s*hotels)\b/i
  ];

  private feePatterns = [
    /\b(?:registration|training|security)\s*(?:fee|deposit|charge)\b/i,
    /\b(?:pay\s*upfront|refundable\s*deposit)\b/i
  ];

  supports(input: AnalysisInput): boolean {
    return input.type === 'text';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (input.type !== 'text') {
      throw new Error('Unsupported input type');
    }

    const normalized = normalizeText(input.value);

    // Job scams often combine 2 or 3 of these
    let matchesHighIncome = false;
    let matchesLowEffort = false;
    let matchesFee = false;

    if (context.signal.aborted) throw context.signal.reason;
    matchesHighIncome = this.highIncomePatterns.some(p => p.test(normalized));
    
    if (context.signal.aborted) throw context.signal.reason;
    matchesLowEffort = this.lowEffortPatterns.some(p => p.test(normalized));
    
    if (context.signal.aborted) throw context.signal.reason;
    matchesFee = this.feePatterns.some(p => p.test(normalized));

    // Must match at least a combination of 2 to be confident
    const matchCount = [matchesHighIncome, matchesLowEffort, matchesFee].filter(Boolean).length;

    if (matchCount >= 2) {
      return {
        detectorId: this.id,
        indicators: [
          {
            id: 'ind-job-scam-1',
            category: 'TEXT',
            type: 'TEXT.JOB_SCAM_PATTERN',
            severity: 'HIGH',
            confidence: 0.85,
            explanation: 'Text contains combinations of suspicious employment patterns (e.g. high income + fees)',
          }
        ],
        evidence: [
          {
            id: 'ev-job-scam-1',
            detectorId: this.id,
            type: 'observed_fact',
            category: 'content',
            severity: 'HIGH',
            confidence: 0.85,
            title: 'Job Scam Pattern Detected',
            explanation: 'The message contains typical job scam combinations such as guaranteed income with upfront fees.',
            source: { name: 'JobScamDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 0.85,
        severityContribution: 7,
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
