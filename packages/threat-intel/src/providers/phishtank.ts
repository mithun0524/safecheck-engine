import { IndicatorCategory } from '@safecheck/schemas';
import { z } from 'zod';
import { ThreatIntelProvider, NormalizedProviderResult, ThreatIntelStatus } from '../provider';
import { ProviderResponseValidationError, ProviderTimeoutError, RateLimitError } from '../errors';

// PhishTank returns an array of records if matched via search, but for our MVP,
// we will simulate hitting a generic JSON API for a URL.
// In reality, PhishTank offers a downloadable feed or a POST API.
// We'll define a strict schema to validate the untrusted response.
const PhishTankResponseSchema = z.object({
  url: z.string().max(2048).optional(),
  in_database: z.boolean(),
  phish_id: z.number().optional(),
  phish_detail_page: z.string().max(2048).optional(),
  verified: z.boolean().optional(),
  valid: z.boolean().optional(),
}).passthrough(); // pass through other fields but don't explicitly parse them

export class PhishTankProvider implements ThreatIntelProvider {
  id = 'phishtank';
  name = 'PhishTank';
  supportedTypes: IndicatorCategory[] = ['URL'];
  requiresRawInput = true;
  private apiKey: string | undefined;
  private reliability: number;

  constructor(options: { apiKey?: string; reliability: number }) {
    this.apiKey = options.apiKey;
    this.reliability = options.reliability;
  }

  async lookup(
    indicator: string,
    type: IndicatorCategory,
    context: { signal: AbortSignal }
  ): Promise<NormalizedProviderResult> {
    if (type !== 'URL') {
      return this.emptyResult(indicator, 'SKIPPED');
    }

    const endpoint = 'https://checkurl.phishtank.com/checkurl/';
    const body = new URLSearchParams();
    body.append('url', indicator);
    body.append('format', 'json');
    if (this.apiKey) {
      body.append('app_key', this.apiKey);
    }

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'SafeCheck-Engine/1.0',
        },
        body,
        ...(context.signal ? { signal: context.signal } : {}),
      });
    } catch (error: unknown) {
      const e = error as Error;
      if (e.name === 'AbortError' || e.name === 'TimeoutError') {
        throw new ProviderTimeoutError(this.id);
      }
      throw error;
    }

    if (response.status === 429) {
      throw new RateLimitError(this.id);
    }
    
    if (!response.ok) {
      return this.emptyResult(indicator);
    }

    let rawJson: unknown;
    try {
      rawJson = await response.json();
    } catch {
      throw new ProviderResponseValidationError(this.id, 'Invalid JSON');
    }

    const parsed = PhishTankResponseSchema.safeParse(rawJson);
    if (!parsed.success) {
      throw new ProviderResponseValidationError(this.id, 'Schema mismatch');
    }

    const data = parsed.data;
    const isPhish = data.in_database && data.verified === true && data.valid === true;

    return {
      providerId: this.id,
      indicator,
      status: isPhish ? 'MATCH' : 'NO_MATCH',
      classification: isPhish ? 'phishing' : undefined,
      reliability: this.reliability,
      metadata: {
        phish_id: data.phish_id ?? -1,
        detail_page: data.phish_detail_page ?? '',
      },
    };
  }

  private emptyResult(indicator: string, status: ThreatIntelStatus = 'NO_MATCH'): NormalizedProviderResult {
    return {
      providerId: this.id,
      indicator,
      status,
      reliability: this.reliability,
      metadata: {},
    };
  }
}
