import { Detector } from '@safecheck/core';
import { UrgencyDetector } from './text/urgency.js';
import { ThreatDetector } from './text/threat.js';
import { CredentialDetector } from './text/credential.js';
import { PaymentDetector } from './text/payment.js';
import { SecrecyDetector } from './text/secrecy.js';
import { RewardDetector } from './text/reward.js';
import { JobScamDetector } from './text/job-scam.js';

export * from './text/urgency.js';
export * from './text/threat.js';
export * from './text/credential.js';
export * from './text/payment.js';
export * from './text/secrecy.js';
export * from './text/reward.js';
export * from './text/job-scam.js';

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
