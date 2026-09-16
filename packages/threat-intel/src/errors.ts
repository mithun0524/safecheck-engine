export class ThreatIntelError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThreatIntelError';
  }
}

export class ProviderTimeoutError extends ThreatIntelError {
  constructor(providerId: string) {
    super(`Provider ${providerId} timed out`);
    this.name = 'ProviderTimeoutError';
  }
}

export class ProviderResponseValidationError extends ThreatIntelError {
  constructor(providerId: string, details: string) {
    super(`Provider ${providerId} returned invalid response: ${details}`);
    this.name = 'ProviderResponseValidationError';
  }
}

export class RateLimitError extends ThreatIntelError {
  constructor(providerId: string) {
    super(`Provider ${providerId} rate limited`);
    this.name = 'RateLimitError';
  }
}
