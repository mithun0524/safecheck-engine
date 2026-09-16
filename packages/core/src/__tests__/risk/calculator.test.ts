import { describe, it, expect } from 'vitest';
import { RiskCalculator } from '../../risk/calculator.js';
import { Evidence, EvidenceSeverity } from '@safecheck/schemas';

describe('RiskCalculator', () => {
  const calculator = new RiskCalculator();

  const createEvidence = (
    id: string,
    detectorId: string,
    severity: EvidenceSeverity,
    confidence: number
  ): Evidence => ({
    id,
    detectorId,
    type: 'observed_fact',
    category: 'test-category',
    title: 'Test Evidence',
    explanation: 'Test Explanation',
    severity,
    confidence,
    source: { name: 'test-detector', type: 'rule' },
  });

  describe('Boundary Tests (Mandatory Formula Verification)', () => {
    it('produces exactly 24 -> LOW', () => {
      // 0.96 raw score * 25 = 24
      // Use verified-phishing weight = 1.0
      // severity = LOW (1)
      // confidence = 0.96
      const ev = createEvidence('e1', 'verified-phishing', 'LOW', 0.96);
      const result = calculator.calculate({ evidence: [ev] });
      
      expect(result.risk.status).toBe('DETERMINED');
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(24);
        expect(result.risk.level).toBe('LOW');
        expect(result.recommendation.action).toBe('SAFE_TO_PROCEED');
      }
    });

    it('produces exactly 25 -> SUSPICIOUS', () => {
      // 1.0 raw score * 25 = 25
      const ev = createEvidence('e1', 'verified-phishing', 'LOW', 1.0);
      const result = calculator.calculate({ evidence: [ev] });
      
      expect(result.risk.status).toBe('DETERMINED');
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(25);
        expect(result.risk.level).toBe('SUSPICIOUS');
        expect(result.recommendation.action).toBe('PROCEED_WITH_CAUTION');
      }
    });

    it('produces exactly 49 -> SUSPICIOUS', () => {
      // 1.96 raw score * 25 = 49
      const ev = createEvidence('e1', 'verified-phishing', 'MEDIUM', 0.98);
      const result = calculator.calculate({ evidence: [ev] });
      
      expect(result.risk.status).toBe('DETERMINED');
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(49);
        expect(result.risk.level).toBe('SUSPICIOUS');
        expect(result.recommendation.action).toBe('PROCEED_WITH_CAUTION');
      }
    });

    it('produces exactly 50 -> HIGH', () => {
      // 2.0 raw score * 25 = 50
      const ev = createEvidence('e1', 'verified-phishing', 'MEDIUM', 1.0);
      const result = calculator.calculate({ evidence: [ev] });
      
      expect(result.risk.status).toBe('DETERMINED');
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(50);
        expect(result.risk.level).toBe('HIGH');
      }
    });

    it('produces exactly 79 -> HIGH', () => {
      // 3.16 raw score * 25 = 79
      // Using severity = 4, confidence = 0.79, weight = 1.0
      const ev = createEvidence('e1', 'verified-phishing', 'CRITICAL', 0.79);
      const result = calculator.calculate({ evidence: [ev] });
      
      expect(result.risk.status).toBe('DETERMINED');
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(79);
        expect(result.risk.level).toBe('HIGH');
      }
    });

    it('produces exactly 80 -> CRITICAL', () => {
      // 3.2 raw score * 25 = 80
      // Using severity = 4, confidence = 0.8, weight = 1.0
      const ev = createEvidence('e1', 'verified-phishing', 'CRITICAL', 0.8);
      const result = calculator.calculate({ evidence: [ev] });
      
      expect(result.risk.status).toBe('DETERMINED');
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(80);
        expect(result.risk.level).toBe('CRITICAL');
        expect(result.recommendation.action).toBe('DO_NOT_INTERACT');
      }
    });

    it('caps score at 100', () => {
      // 4 * 1.0 * 1.0 = 4. 4 * 25 = 100
      // 2x of this = 200 -> caps at 100
      const ev1 = createEvidence('e1', 'verified-phishing', 'CRITICAL', 1.0);
      const ev2 = createEvidence('e2', 'verified-phishing', 'CRITICAL', 1.0); // Different ID to bypass deduplication logic (which is done before calculator in Engine, but here calculator receives it directly)
      const result = calculator.calculate({ evidence: [ev1, ev2] });
      
      expect(result.risk.status).toBe('DETERMINED');
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(100);
        expect(result.risk.level).toBe('CRITICAL');
      }
    });
  });

  describe('Inconclusive Logic', () => {
    it('returns INCONCLUSIVE for zero evidence', () => {
      const result = calculator.calculate({ evidence: [] });
      expect(result.risk.status).toBe('INCONCLUSIVE');
      expect(result.recommendation.action).toBe('INCONCLUSIVE_VERIFY');
      expect(result.risk.riskConfidence).toBe(0);
    });

    it('returns INCONCLUSIVE if riskConfidence < 0.5', () => {
      const ev = createEvidence('e1', 'verified-phishing', 'CRITICAL', 0.49);
      const result = calculator.calculate({ evidence: [ev] });
      expect(result.risk.status).toBe('INCONCLUSIVE');
      expect(result.recommendation.action).toBe('INCONCLUSIVE_VERIFY');
      expect(result.risk.riskConfidence).toBeCloseTo(0.49);
    });
  });

  describe('Correlations', () => {
    it('applies +10 bonus for urgency + credential-request (CORR-001) as final score addition', () => {
      // urgency: sev 2 (MEDIUM) * conf 0.9 * weight 0.25 * 25 = 11.25
      // credential: sev 3 (HIGH) * conf 0.9 * weight 0.80 * 25 = 54
      // Base score = 65.25
      // Correlation CORR-001 = +10
      // Total score = 75.25 -> rounded to 75 (HIGH)
      const ev1 = createEvidence('e1', 'text.urgency', 'MEDIUM', 0.9);
      const ev2 = createEvidence('e2', 'text.credential-request', 'HIGH', 0.9);
      
      const result = calculator.calculate({ evidence: [ev1, ev2] });
      
      expect(result.risk.status).toBe('DETERMINED');
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(75);
        expect(result.risk.level).toBe('HIGH');
      }
    });

    it('adds bonuses properly and caps at 100', () => {
      // urgency (sev 4 * 1.0 * 0.25 * 25 = 25)
      // credential (sev 4 * 1.0 * 0.80 * 25 = 80)
      // Base = 105. CORR-001 = +10. Total = 115 -> 100.
      const ev1 = createEvidence('e1', 'text.urgency', 'CRITICAL', 1.0);
      const ev2 = createEvidence('e2', 'text.credential-request', 'CRITICAL', 1.0);
      const result = calculator.calculate({ evidence: [ev1, ev2] });
      if (result.risk.status === 'DETERMINED') {
        expect(result.risk.score).toBe(100);
      }
    });
  });

  describe('Recommendation Mapping', () => {
    it('maps HIGH with credential request to DO_NOT_SHARE_CREDENTIALS', () => {
      const ev = createEvidence('e1', 'text.credential-request', 'HIGH', 1.0); // raw: 3 * 1.0 * 0.8 = 2.4 -> 60 (HIGH)
      const result = calculator.calculate({ evidence: [ev] });
      expect(result.recommendation.action).toBe('DO_NOT_SHARE_CREDENTIALS');
    });

    it('maps HIGH with payment request to DO_NOT_PAY', () => {
      // Payment request: weight 0.55. sev 4 * 1.0 * 0.55 = 2.2 -> 55 (HIGH)
      const ev = createEvidence('e1', 'text.payment-request', 'CRITICAL', 1.0);
      const result = calculator.calculate({ evidence: [ev] });
      expect(result.recommendation.action).toBe('DO_NOT_PAY');
    });

    it('prioritizes credential request over payment request if both present', () => {
      // To bypass score capping and still ensure it works:
      const ev1 = createEvidence('e1', 'text.credential-request', 'HIGH', 1.0);
      const ev2 = createEvidence('e2', 'text.payment-request', 'HIGH', 1.0);
      const result = calculator.calculate({ evidence: [ev1, ev2] });
      expect(result.recommendation.action).toBe('DO_NOT_SHARE_CREDENTIALS');
    });
  });

  describe('Determinism', () => {
    it('produces identical outputs for identical inputs', () => {
      const ev1 = createEvidence('e1', 'text.urgency', 'MEDIUM', 0.9);
      const ev2 = createEvidence('e2', 'text.credential-request', 'CRITICAL', 0.95);
      
      const result1 = calculator.calculate({ evidence: [ev1, ev2] });
      const result2 = calculator.calculate({ evidence: [ev1, ev2] });

      expect(result1).toEqual(result2);
    });
  });
});
