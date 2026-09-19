import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult, Evidence, Indicator } from '@safecheck/schemas';
import { safeParseUrl } from '../utils/url.js';

export class ObfuscationDetector implements Detector {
  public id = 'url.obfuscation';

  supports(input: AnalysisInput): boolean {
    return input.type === 'url';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (context.signal.aborted) throw context.signal.reason;

    const parsed = safeParseUrl(input.value, input.type as 'url' | 'domain');
    if (!parsed) return this.emptyResult();

    const signals: string[] = [];
    const explanations: string[] = [];

    // 1. Credentials in URL
    if (parsed.username || parsed.password) {
      signals.push('credentials');
      explanations.push('Credentials embedded directly in the URL.');
    }

    // 2. Multiple percent-encodings indicating possible double encoding
    const percentCount = (input.value.match(/%[0-9A-Fa-f]{2}/g) || []).length;
    if (percentCount > 10 || input.value.includes('%25')) {
      signals.push('excessive_encoding');
      explanations.push('Excessive or double percent-encoding.');
    }

    // 3. Excessive subdomains
    const domainParts = parsed.hostname.split('.');
    const isIpV4 = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(parsed.hostname);
    if (!isIpV4 && domainParts.length >= 5) {
      signals.push('excessive_subdomains');
      explanations.push('Abnormally deep subdomain hierarchy.');
    }

    if (signals.length > 0) {
      const isHigh = signals.length > 1;
      const severity = isHigh ? 'HIGH' : 'MEDIUM';
      const confidence = isHigh ? 0.9 : 0.7;

      const indicators: Indicator[] = signals.map((signal, i) => ({
        id: `ind-${this.id}-${i+1}`,
        category: 'URL',
        type: 'URL.OBFUSCATION',
        severity,
        confidence,
        explanation: explanations[i] as string,
      }));

      const evidence: Evidence[] = [
        {
          id: `ev-${this.id}-1`,
          detectorId: this.id,
          type: 'observed_fact',
          category: 'url',
          severity,
          confidence,
          title: 'URL Obfuscation Detected',
          explanation: `The URL exhibits obfuscation techniques: ${signals.join(', ')}.`,
          source: { name: 'ObfuscationDetector', type: 'rule' },
        }
      ];

      return {
        detectorId: this.id,
        indicators,
        evidence,
        detectorConfidence: confidence,
        severityContribution: isHigh ? 8 : 4,
      };
    }

    return this.emptyResult();
  }

  private emptyResult(): DetectorResult {
    return {
      detectorId: this.id,
      indicators: [],
      evidence: [],
      detectorConfidence: 1.0,
      severityContribution: 0,
    };
  }
}
