import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { normalizeText } from './normalize.js';

export class ThreatDetector implements Detector {
  public id = 'text.fear-threat';

  private patterns = [
    /\b(?:arrested|legal\s*action|police|lawsuit|prosecuted)\b/i,
    /\b(?:penalty|fine)\s*(?:of|will be|applied)\b/i,
    /\b(?:account|card|access)\s*(?:compromised|hacked|breached|at\s*risk)\b/i,
    /\b(?:payment|transaction)\s*(?:failed|declined|rejected)\b/i,
    // Multilingual POC
    /\b(?:police|fir)\s*(?:complaint|case|arrest)\b/i,
    /\b(?:jail|jurmana|fine)\s*(?:hoga|lagega)\b/i,
    /\b(?:account\s*block|card\s*block)\b/i
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
            type: 'TEXT.THREAT',
            severity: 'MEDIUM',
            confidence: 0.8,
            explanation: 'Text contains threats, legal consequences, or fear-based pressure',
          }
        ],
        evidence: [
          {
            id: `ev-${this.id}-1`,
            detectorId: this.id,
            type: 'observed_fact',
            category: 'content',
            severity: 'MEDIUM',
            confidence: 0.8,
            title: 'Fear/Threat Language Detected',
            explanation: 'The message contains threatening or fear-inducing language.',
            source: { name: 'ThreatDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 0.8,
        severityContribution: 5,
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
