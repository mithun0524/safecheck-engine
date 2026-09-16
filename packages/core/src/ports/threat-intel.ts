import { IndicatorCategory } from '@safecheck/schemas';

export type ThreatIntelStatus = 'MATCH' | 'NO_MATCH' | 'SKIPPED' | 'ERROR';

export interface NormalizedProviderResult {
  providerId: string;
  indicator: string;
  status: ThreatIntelStatus;
  classification?: string | undefined;
  reliability: number;
  metadata: Record<string, string | number | boolean>;
}

export interface ThreatIntelPort {
  id: string;
  name: string;
  supportedTypes: IndicatorCategory[];
  requiresRawInput?: boolean;
  lookup(
    indicator: string,
    type: IndicatorCategory,
    context: { signal: AbortSignal }
  ): Promise<NormalizedProviderResult>;
}
