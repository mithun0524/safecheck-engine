import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { normalizeText } from './normalize.js';

export class UrgencyDetector implements Detector {
  public id = 'text.urgency';

  // Explicit patterns for immediate action
  private patterns = [
    /\b(?:act|respond|reply|pay)\s*(?:immediately|now|today)\b/i,
    /\b(?:within|in)\s*(?:\d+|ten|five|two|one|twenty|thirty|10|5|2|1|24|48)\s*(?:minutes?|hours?|mins?|hrs?)\b/i,
    /\b(?:last|final)\s*(?:warning|notice|chance)\b/i,
    /\b(?:account|access)\s*(?:will be|is being)\s*(?:closed|suspended|locked|deleted)\b/i,
    /\b(?:action\s*required|urgent\s*action|urgent\s*notice)\b/i,
    // Multilingual POC (Hindi/Hinglish)
    /\b(?:jaldi|turant|abhi)\s*(?:karo|kare|reply|pay)\b/i,
    /\b(?:aakhri|final)\s*warning\b/i
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
            type: 'TEXT.URGENCY',
            severity: 'LOW',
            confidence: 0.8,
            explanation: 'Text contains language attempting to force immediate action',
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
            title: 'Urgency Language Detected',
            explanation: 'The message attempts to create artificial urgency.',
            source: { name: 'UrgencyDetector', type: 'rule' },
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
