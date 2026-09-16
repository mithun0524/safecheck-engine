import { ThreatIntelPort as ThreatIntelProvider, NormalizedProviderResult, ThreatIntelStatus } from '@safecheck/core';

export interface LookupContext {
  signal: AbortSignal;
}

export type { ThreatIntelProvider, NormalizedProviderResult, ThreatIntelStatus };
