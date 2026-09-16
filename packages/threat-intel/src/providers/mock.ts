import { IndicatorCategory } from '@safecheck/schemas';
import { ThreatIntelProvider, NormalizedProviderResult, LookupContext } from '../provider';

export class MockProvider implements ThreatIntelProvider {
  id = 'mock';
  name = 'Mock Provider';
  supportedTypes: IndicatorCategory[] = ['URL', 'DOMAIN'];
  reliability: number;
  
  constructor(options?: { reliability?: number }) {
    this.reliability = options?.reliability ?? 1.0;
  }
  
  // Set this externally to control the outcome during tests
  mockResult: Partial<NormalizedProviderResult> | null = null;
  shouldThrow: Error | null = null;
  delayMs = 0;

  async lookup(
    indicator: string,
    type: IndicatorCategory,
    context: LookupContext
  ): Promise<NormalizedProviderResult> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }

    if (context.signal?.aborted) {
      throw new Error('AbortError');
    }

    if (this.shouldThrow) {
      throw this.shouldThrow;
    }

    if (this.mockResult) {
      return {
        providerId: this.id,
        indicator,
        status: this.mockResult.status ?? 'NO_MATCH',
        classification: this.mockResult.classification,
        reliability: this.mockResult.reliability ?? this.reliability,
        metadata: this.mockResult.metadata ?? {},
      };
    }

    return {
      providerId: this.id,
      indicator,
      status: 'NO_MATCH',
      reliability: this.reliability,
      metadata: {},
    };
  }
}
