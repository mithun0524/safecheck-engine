import { Detector } from '@safecheck/core';
import { UrgencyDetector } from './text/urgency.js';
import { ThreatDetector } from './text/threat.js';
import { CredentialDetector } from './text/credential.js';
import { PaymentDetector } from './text/payment.js';
import { SecrecyDetector } from './text/secrecy.js';
import { RewardDetector } from './text/reward.js';
import { JobScamDetector } from './text/job-scam.js';

import { IpAddressDetector } from './url/ip-address.js';
import { PunycodeDetector } from './url/punycode.js';
import { UnusualPortDetector } from './url/unusual-port.js';
import { ObfuscationDetector } from './url/obfuscation.js';
import { SuspiciousPathDetector } from './url/suspicious-path.js';
import { LookalikeDomainDetector } from './domain/lookalike.js';
import { BrandMismatchDetector } from './domain/brand-mismatch.js';

export * from './text/urgency.js';
export * from './text/threat.js';
export * from './text/credential.js';
export * from './text/payment.js';
export * from './text/secrecy.js';
export * from './text/reward.js';
export * from './text/job-scam.js';

export * from './url/ip-address.js';
export * from './url/punycode.js';
export * from './url/unusual-port.js';
export * from './url/obfuscation.js';
export * from './url/suspicious-path.js';
export * from './domain/lookalike.js';
export * from './domain/brand-mismatch.js';

/**
 * Returns a new instance of all deterministic text detectors.
 * This allows explicit registration without relying on global singletons.
 */
export function getTextDetectors(): Detector[] {
  return [
    new UrgencyDetector(),
    new ThreatDetector(),
    new CredentialDetector(),
    new PaymentDetector(),
    new SecrecyDetector(),
    new RewardDetector(),
    new JobScamDetector(),
  ];
}

/**
 * Returns a new instance of all deterministic URL and domain detectors.
 */
export function getUrlDomainDetectors(): Detector[] {
  return [
    new IpAddressDetector(),
    new PunycodeDetector(),
    new UnusualPortDetector(),
    new ObfuscationDetector(),
    new SuspiciousPathDetector(),
    new LookalikeDomainDetector(),
    new BrandMismatchDetector(),
  ];
}

/**
 * Returns a new instance of all deterministic detectors (text, url, domain).
 */
export function getAllDetectors(): Detector[] {
  return [...getTextDetectors(), ...getUrlDomainDetectors()];
}
