import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { normalizeText } from './normalize.js';

export class SecrecyDetector implements Detector {
  public id = 'text.secrecy';

  private patterns = [
    /\b(?:keep\s*this|strictly)\s*(?:confidential|secret|private)\b/i,
    /\b(?:do\s*not|don't)\s*(?:tell|share|inform)\s*(?:anyone|anybody|the\s*bank|family|friends)\b/i,
    // Multilingual POC
    /\b(?:kisi\s*ko)\s*(?:mat\s*batana|nahi\s*batana)\b/i,
    /\b(?:secret\s*rakhna)\b/i
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
            id: 'ind-secrecy-1',
            category: 'TEXT',
            type: 'TEXT.SECRECY',
            severity: 'MEDIUM',
            confidence: 0.8,
            explanation: 'Text contains instructions to keep the interaction secret',
          }
        ],
        evidence: [
          {
            id: 'ev-secrecy-1',
            detectorId: this.id,
            type: 'observed_fact',
            category: 'content',
            severity: 'MEDIUM',
            confidence: 0.8,
            title: 'Secrecy/Isolation Detected',
            explanation: 'The message attempts to isolate the user or enforce secrecy.',
            source: { name: 'SecrecyDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 0.8,
        severityContribution: 4,
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
