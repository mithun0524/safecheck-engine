import { describe, it, expect, beforeEach } from 'vitest';
import { AnalysisContext } from '@safecheck/core';
import { AnalysisInput } from '@safecheck/schemas';
import { getTextDetectors } from '../../index.js';
import { UrgencyDetector } from '../../text/urgency.js';
import { ThreatDetector } from '../../text/threat.js';
import { CredentialDetector } from '../../text/credential.js';
import { PaymentDetector } from '../../text/payment.js';
import { SecrecyDetector } from '../../text/secrecy.js';
import { RewardDetector } from '../../text/reward.js';
import { JobScamDetector } from '../../text/job-scam.js';

describe('Sprint 3: Text Detectors', () => {
  let context: AnalysisContext;

  beforeEach(() => {
    context = {
      analysisId: 'test-anl-1',
      timestamp: new Date().toISOString(),
      engineVersion: '1.0.0',
      options: {
        enableAi: false,
        enableThreatIntel: false,
        enableLanguageDetection: false,
        privacyMode: 'local'
      },
      signal: new AbortController().signal,
    };
  });

  const createInput = (value: string): AnalysisInput => ({
    type: 'text',
    value,
  });

  describe('Factory and Registration', () => {
    it('should export all 7 text detectors', () => {
      const detectors = getTextDetectors();
      expect(detectors).toHaveLength(7);
      
      const ids = detectors.map(d => d.id);
      expect(ids).toContain('text.urgency');
      expect(ids).toContain('text.fear-threat');
      expect(ids).toContain('text.credential-request');
      expect(ids).toContain('text.payment-request');
      expect(ids).toContain('text.secrecy');
      expect(ids).toContain('text.reward-lure');
      expect(ids).toContain('text.job-scam');
    });

    it('should explicitly reject non-text inputs', async () => {
      const urgency = new UrgencyDetector();
      const urlInput: AnalysisInput = { type: 'url', value: 'https://example.com' };
      
      expect(urgency.supports(urlInput)).toBe(false);
      await expect(urgency.analyze(urlInput, context)).rejects.toThrow('Unsupported input type');
    });
  });

  describe('UrgencyDetector', () => {
    const detector = new UrgencyDetector();

    it('detects clear urgency', async () => {
      const result = await detector.analyze(createInput('Act immediately to save your account.'), context);
      expect(result.evidence?.length || 0).toBe(1);
      expect(result.evidence?.[0]?.title).toBe('Urgency Language Detected');
    });

    it('handles normalization and case variations (ZWSP, CAPS)', async () => {
      // "ACT IMMEDIATELY" with zwsp
      const result = await detector.analyze(createInput('AC\u200Bt imMEdiately'), context);
      expect(result.evidence?.length || 0).toBe(1);
    });

    it('ignores normal conversation (false positives)', async () => {
      const result = await detector.analyze(createInput('Can you act in the play?'), context);
      expect(result.evidence?.length || 0).toBe(0);
    });
  });

  describe('ThreatDetector', () => {
    const detector = new ThreatDetector();

    it('detects clear threat', async () => {
      const result = await detector.analyze(createInput('Legal action will be taken against you.'), context);
      expect(result.evidence?.length || 0).toBe(1);
      expect(result.evidence?.[0]?.title).toBe('Fear/Threat Language Detected');
    });

    it('ignores normal conversation', async () => {
      const result = await detector.analyze(createInput('I will take action on this ticket.'), context);
      expect(result.evidence?.length || 0).toBe(0);
    });
  });

  describe('CredentialDetector', () => {
    const detector = new CredentialDetector();

    it('detects explicit credential requests', async () => {
      const result = await detector.analyze(createInput('Please share your OTP to verify.'), context);
      expect(result.evidence?.length || 0).toBe(1);
    });

    it('ignores normal OTP discussion', async () => {
      // Just mentioning OTP without asking to share it
      const result = await detector.analyze(createInput('The OTP feature is down today.'), context);
      expect(result.evidence?.length || 0).toBe(0);
    });
  });

  describe('PaymentDetector', () => {
    const detector = new PaymentDetector();

    it('detects advance fee / gift card requests', async () => {
      const result = await detector.analyze(createInput('You must buy an apple gift card to proceed.'), context);
      expect(result.evidence?.length || 0).toBe(1);
    });

    it('ignores normal payment discussion', async () => {
      const result = await detector.analyze(createInput('I bought a gift for her.'), context);
      expect(result.evidence?.length || 0).toBe(0);
    });
  });

  describe('SecrecyDetector', () => {
    const detector = new SecrecyDetector();

    it('detects isolation requests', async () => {
      const result = await detector.analyze(createInput('Keep this confidential and do not tell the bank.'), context);
      expect(result.evidence?.length || 0).toBe(1);
    });

    it('ignores normal conversation', async () => {
      const result = await detector.analyze(createInput('We need to keep this food cold.'), context);
      expect(result.evidence?.length || 0).toBe(0);
    });
  });

  describe('RewardDetector', () => {
    const detector = new RewardDetector();

    it('detects lottery lures', async () => {
      const result = await detector.analyze(createInput('Congratulations! You won Rs. 50,000.'), context);
      expect(result.evidence?.length || 0).toBe(1);
    });
  });

  describe('JobScamDetector', () => {
    const detector = new JobScamDetector();

    it('detects combined pattern (High Income + Fee)', async () => {
      const result = await detector.analyze(createInput('Guaranteed income of $500 per day! Just pay the registration fee.'), context);
      expect(result.evidence?.length || 0).toBe(1);
    });

    it('ignores isolated patterns (Legit job)', async () => {
      const result = await detector.analyze(createInput('High salary available for experienced engineers.'), context);
      expect(result.evidence?.length || 0).toBe(0); // Not combined with fees or low effort
    });
  });

  describe('Adversarial & Combination Tests', () => {
    it('ignores legitimate contexts (Adversarial False Positives)', async () => {
      const payment = new PaymentDetector();
      const job = new JobScamDetector();
      const reward = new RewardDetector();
      const secrecy = new SecrecyDetector();
      const threat = new ThreatDetector();

      // "Please pay your electricity bill by Friday."
      expect((await payment.analyze(createInput('Please pay your electricity bill by Friday.'), context)).evidence?.length || 0).toBe(0);
      
      // "HR will contact you regarding your job application."
      expect((await job.analyze(createInput('HR will contact you regarding your job application.'), context)).evidence?.length || 0).toBe(0);
      
      // "Congratulations on completing your course."
      expect((await reward.analyze(createInput('Congratulations on completing your course.'), context)).evidence?.length || 0).toBe(0);
      
      // "Please keep your medical records confidential."
      expect((await secrecy.analyze(createInput('Please keep your medical records confidential.'), context)).evidence?.length || 0).toBe(0);
      
      // "Your account will be temporarily unavailable during maintenance."
      expect((await threat.analyze(createInput('Your account will be temporarily unavailable during maintenance.'), context)).evidence?.length || 0).toBe(0);
    });

    it('detects combinations of signals correctly across detectors', async () => {
      const credential = new CredentialDetector();
      const urgency = new UrgencyDetector();
      
      // Credential + Urgency
      const comboText = 'Your account will be locked! Please provide your OTP immediately.';
      expect((await urgency.analyze(createInput(comboText), context)).evidence?.length || 0).toBe(1);
      expect((await credential.analyze(createInput(comboText), context)).evidence?.length || 0).toBe(1);
    });
  });

  describe('Privacy & Determinism', () => {
    it('does not leak raw text into metadata', async () => {
      const urgency = new UrgencyDetector();
      const rawText = 'ACT IMMEDIATELY SECRET123';
      const result = await urgency.analyze(createInput(rawText), context);
      
      const serialized = JSON.stringify(result);
      expect(serialized).not.toContain('SECRET123'); // Text is dropped entirely
    });
    
    it('returns consistent results (deterministic)', async () => {
      const urgency = new UrgencyDetector();
      const input = createInput('act now');
      const r1 = await urgency.analyze(input, context);
      const r2 = await urgency.analyze(input, context);
      
      expect(r1).toStrictEqual(r2);
    });
  });
});
