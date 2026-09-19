import { describe, it, expect } from 'vitest';
import { AnalysisContext, Detector } from '@safecheck/core';
import { AnalysisInput } from '@safecheck/schemas';
import { IpAddressDetector } from '../../url/ip-address.js';
import { PunycodeDetector } from '../../url/punycode.js';
import { UnusualPortDetector } from '../../url/unusual-port.js';
import { ObfuscationDetector } from '../../url/obfuscation.js';
import { SuspiciousPathDetector } from '../../url/suspicious-path.js';

describe('URL Detectors', () => {
  const getContext = (): AnalysisContext => ({
    signal: new AbortController().signal,
  } as AnalysisContext);

  const runDetector = async (detector: Detector, value: string, type: 'url' | 'domain' = 'url') => {
    return detector.analyze({ type, value } as AnalysisInput, getContext());
  };

  describe('IpAddressDetector', () => {
    const detector = new IpAddressDetector();

    it('flags IPv4 hostnames', async () => {
      const res = await runDetector(detector, 'http://192.168.1.1/login');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('HIGH');
    });

    it('flags IPv6 hostnames', async () => {
      const res = await runDetector(detector, 'http://[2001:db8::1]:8080/');
      expect(res.evidence.length).toBe(1);
    });

    it('ignores legitimate domains', async () => {
      const res = await runDetector(detector, 'https://example.com');
      expect(res.evidence.length).toBe(0);
    });

    it('ignores domains that look partially like IP addresses', async () => {
      // False positive test
      const res = await runDetector(detector, 'https://192.168.com');
      expect(res.evidence.length).toBe(0);
    });
  });

  describe('PunycodeDetector', () => {
    const detector = new PunycodeDetector();

    it('flags punycode hostnames', async () => {
      const res = await runDetector(detector, 'http://xn--pypal-4qa.com');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('MEDIUM');
    });

    it('ignores standard hostnames', async () => {
      const res = await runDetector(detector, 'https://paypal.com');
      expect(res.evidence.length).toBe(0);
    });
  });

  describe('UnusualPortDetector', () => {
    const detector = new UnusualPortDetector();

    it('flags non-standard ports', async () => {
      const res = await runDetector(detector, 'http://example.com:8080');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('LOW');
    });

    it('ignores standard ports 80 and 443', async () => {
      const res80 = await runDetector(detector, 'http://example.com:80');
      expect(res80.evidence.length).toBe(0);

      const res443 = await runDetector(detector, 'https://example.com:443');
      expect(res443.evidence.length).toBe(0);
    });

    it('ignores missing ports', async () => {
      const res = await runDetector(detector, 'https://example.com');
      expect(res.evidence.length).toBe(0);
    });
  });

  describe('ObfuscationDetector (Conservative)', () => {
    const detector = new ObfuscationDetector();

    it('flags credentials combined with double encoding as HIGH', async () => {
      const res = await runDetector(detector, 'http://user:pass@example.com/%2520%2520%2520%2520%2520');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('HIGH');
    });

    it('flags credentials alone as MEDIUM', async () => {
      const res = await runDetector(detector, 'http://user:pass@example.com');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('MEDIUM');
    });

    it('flags excessive subdomains alone as MEDIUM', async () => {
      const res = await runDetector(detector, 'https://secure.login.update.account.paypal.com.scam.net');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('MEDIUM');
    });

    it('ignores normal subdomains', async () => {
      const res = await runDetector(detector, 'https://www.example.com');
      expect(res.evidence.length).toBe(0);
    });
    
    it('ignores IPv4 addresses in excessive subdomains check', async () => {
      // 192.168.1.1 splits into 4 parts, which is < 5, but let's test a weird IP just in case
      const res = await runDetector(detector, 'http://192.168.1.1.5');
      expect(res.evidence.length).toBe(0); // Assuming parseUrl fails or it ignores it
    });
  });

  describe('SuspiciousPathDetector (Conservative)', () => {
    const detector = new SuspiciousPathDetector();

    it('flags combination of suspicious keywords as MEDIUM', async () => {
      const res = await runDetector(detector, 'https://example.com/secure/login/verify.php');
      expect(res.evidence.length).toBe(1);
      expect(res.evidence[0]!.severity).toBe('MEDIUM');
    });

    it('ignores single generic keywords (false positive test)', async () => {
      const res = await runDetector(detector, 'https://example.com/login');
      expect(res.evidence.length).toBe(0);
    });

    it('ignores non-suspicious paths', async () => {
      const res = await runDetector(detector, 'https://example.com/about-us');
      expect(res.evidence.length).toBe(0);
    });
  });

  describe('Malformed URL Handling', () => {
    const detector = new IpAddressDetector();

    it('returns empty result gracefully for completely broken URLs', async () => {
      const res = await runDetector(detector, 'not-a-valid-url!@#');
      expect(res.evidence.length).toBe(0);
    });

    it('returns empty result gracefully for empty strings', async () => {
      const res = await runDetector(detector, '');
      expect(res.evidence.length).toBe(0);
    });
  });
});
