import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { normalizeText } from './normalize.js';

export class CredentialDetector implements Detector {
  public id = 'text.credential-request';

  private patterns = [
    /\b(?:share|send|provide|enter|confirm|verify)\s*(?:your\s*)?(?:otp|password|pin|cvv|one[\s-]*time[\s-]*password)\b/i,
    /\b(?:login|banking)\s*(?:details|credentials)\b/i,
    /\b(?:recovery|security)\s*(?:code|answer)\b/i,
    // Multilingual POC
    /\b(?:otp|password|pin|cvv)\s*(?:bhejo|share\s*karo|do|batao)\b/i,
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
            id: 'ind-cred-1',
            category: 'TEXT',
            type: 'TEXT.CREDENTIAL_REQUEST',
            severity: 'HIGH',
            confidence: 0.9,
            explanation: 'Text contains requests for sensitive authentication credentials',
          }
        ],
        evidence: [
          {
            id: 'ev-cred-1',
            detectorId: this.id,
            type: 'observed_fact',
            category: 'content',
            severity: 'HIGH',
            confidence: 0.9,
            title: 'Credential Request Detected',
            explanation: 'The message explicitly asks for a password, OTP, or PIN.',
            source: { name: 'CredentialDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 0.9,
        severityContribution: 8,
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
