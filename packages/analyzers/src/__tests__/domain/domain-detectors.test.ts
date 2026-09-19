import { describe, it, expect } from 'vitest';
import { AnalysisContext, Detector } from '@safecheck/core';
import { AnalysisInput } from '@safecheck/schemas';
import { LookalikeDomainDetector } from '../../domain/lookalike.js';
import { BrandMismatchDetector } from '../../domain/brand-mismatch.js';

describe('Domain Detectors', () => {
  const getContext = (): AnalysisContext => ({
    signal: new AbortController().signal,
  } as AnalysisContext);

  const runDetector = async (detector: Detector, value: string, type: 'url' | 'domain' = 'domain') => {
    return detector.analyze({ type, value } as AnalysisInput, getContext());
  };

  describe('LookalikeDomainDetector', () => {
    const detector = new LookalikeDomainDetector();

    it('flags lookalike domains (distance 1)', async () => {
      const res = await runDetector(detector, 'paypa1.com');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('HIGH');
    });

    it('ignores exact matches (handled by legit domains)', async () => {
      const res = await runDetector(detector, 'paypal.com');
      expect(res.evidence.length).toBe(0);
    });

    it('ignores domains that are too different (distance > 1)', async () => {
      const res = await runDetector(detector, 'poypol.com');
      expect(res.evidence.length).toBe(0);
    });

    it('ignores very short domains (conservative false positive check)', async () => {
      const res = await runDetector(detector, 'app.com'); // distance to apple is 2, but length is < 5, will be skipped entirely
      expect(res.evidence.length).toBe(0);
    });

    it('handles domains correctly when passed as a full URL', async () => {
      const res = await runDetector(detector, 'https://microsoftt.com/login', 'url');
      expect(res.evidence.length).toBe(1);
    });
  });

  describe('BrandMismatchDetector', () => {
    const detector = new BrandMismatchDetector();

    it('flags brand name in subdomain when root domain is unrelated', async () => {
      const res = await runDetector(detector, 'paypal.com.scam-site.net');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('HIGH');
    });

    it('ignores brand name when it is the official root domain', async () => {
      const res = await runDetector(detector, 'secure.paypal.com');
      expect(res.evidence.length).toBe(0);
    });

    it('ignores unrelated domains', async () => {
      const res = await runDetector(detector, 'example.com');
      expect(res.evidence.length).toBe(0);
    });
  });

  describe('Malformed Domain Handling', () => {
    const detector = new LookalikeDomainDetector();

    it('handles garbage input gracefully', async () => {
      const res = await runDetector(detector, ' %*&^! ');
      expect(res.evidence.length).toBe(0);
    });
  });
});
