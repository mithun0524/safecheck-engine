import { Detector, AnalysisContext } from '@safecheck/core';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { safeParseUrl } from '../utils/url.js';

export class IpAddressDetector implements Detector {
  public id = 'url.ip-address';

  // Matches standard IPv4 and basic IPv6 formats
  private ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  private ipv6Regex = /^\[?[a-fA-F0-9:]+\]?$/;

  supports(input: AnalysisInput): boolean {
    return input.type === 'url' || input.type === 'domain';
  }

  async analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    if (context.signal.aborted) throw context.signal.reason;

    const parsed = safeParseUrl(input.value, input.type as 'url' | 'domain');
    
    if (!parsed) {
      return this.emptyResult();
    }

    // URL interface keeps brackets for IPv6 hostnames
    const hostname = parsed.hostname;
    
    const isIpV4 = this.ipv4Regex.test(hostname);
    const isIpV6 = hostname.includes(':') && this.ipv6Regex.test(hostname);

    if (isIpV4 || isIpV6) {
      return {
        detectorId: this.id,
        indicators: [
          {
            id: `ind-${this.id}-1`,
            category: 'URL',
            type: 'URL.IP_ADDRESS',
            severity: 'HIGH',
            confidence: 1.0,
            explanation: 'Hostname is a raw IP address instead of a domain name',
          }
        ],
        evidence: [
          {
            id: `ev-${this.id}-1`,
            detectorId: this.id,
            type: 'observed_fact',
            category: 'url',
            severity: 'HIGH',
            confidence: 1.0,
            title: 'IP Address Hostname Detected',
            explanation: 'The provided URL uses a raw IP address. While not inherently malicious, it is highly anomalous and suspicious in consumer digital trust contexts.',
            source: { name: 'IpAddressDetector', type: 'rule' },
          }
        ],
        detectorConfidence: 1.0,
        severityContribution: 8,
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
