import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { normalizeText } from './normalize.js';

export class RewardDetector implements Detector {
  public id = 'text.reward-lure';

  private patterns = [
    /\b(?:you(?:'ve|\s*have|\s*r)?\s*)(?:won|selected\s*for)\b/i,
    /\b(?:claim|get)\s*(?:your\s*)?(?:reward|prize|refund|bonus|free\s*gift)\b/i,
    /\b(?:congratulations|congrats).{0,20}(?:won|lottery|lucky\s*winner|prize)\b/i,
    // Multilingual POC
    /\b(?:aapk[io]\s*)?(?:lottery\s*lagi|inam\s*jeeta)\b/i,
    /\b(?:muft|free)\s*(?:gift|iphone|paise)\b/i
  ];

  supports(input: AnalysisInput): boolean {
    return input.type === 'text';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (input.type !== 'text') {
      throw new Error('Unsupported input type');
    }

    const normalized = normalizeText(input.value);
    let matched = false;

    for (const pattern of this.patterns) {
      if (context.signal.aborted) {
        throw context.signal.reason;
      }
      if (pattern.test(normalized)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      return {
        detectorId: this.id,
        indicators: [
          {
            id: `ind-${this.id}-1`,
            category: 'TEXT',
            type: 'TEXT.REWARD_LURE',
            severity: 'LOW',
            confidence: 0.8,
            explanation: 'Text contains language offering unexpected rewards, prizes, or refunds',
          }
        ],
        evidence: [
          {
            id: `ev-${this.id}-1`,
            detectorId: this.id,
            type: 'observed_fact',
            category: 'content',
            severity: 'LOW',
            confidence: 0.8,
            title: 'Reward/Lure Language Detected',
            explanation: 'The message attempts to lure the user with prizes or rewards.',
            source: { name: 'RewardDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 0.8,
        severityContribution: 2,
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
