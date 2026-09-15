import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { normalizeText } from './normalize.js';

export class PaymentDetector implements Detector {
  public id = 'text.payment-request';

  private patterns = [
    /\b(?:pay|transfer|send)\s*(?:via\s*)?(?:upi|bank\s*transfer|crypto|bitcoin|usdt|wire|western\s*union|gift\s*card)\b/i,
    /\b(?:deposit|advance\s*fee|registration\s*fee|customs\s*fee|processing\s*fee)\b/i,
    /\b(?:buy|purchase)\s*(?:an?\s*)?(?:apple|amazon|steam|google\s*play)\s*gift\s*card\b/i,
    // Multilingual POC
    /\b(?:paise|rupee|payment)\s*(?:bhejo|transfer\s*karo|do)\b/i,
    /\b(?:upi|gpay|phonepe|paytm)\s*(?:se|karo)\b/i
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
            id: 'ind-payment-1',
            category: 'TEXT',
            type: 'TEXT.PAYMENT_REQUEST',
            severity: 'MEDIUM', // Context matters, invoices are common
            confidence: 0.8,
            explanation: 'Text contains requests for money transfer, advance fees, or gift cards',
          }
        ],
        evidence: [
          {
            id: 'ev-payment-1',
            detectorId: this.id,
            type: 'observed_fact',
            category: 'content',
            severity: 'MEDIUM',
            confidence: 0.8,
            title: 'Payment Request Detected',
            explanation: 'The message explicitly asks for a financial transfer or payment.',
            source: { name: 'PaymentDetector', type: 'rule' },
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
