import { describe, it, expect } from 'vitest';
import { MockProvider } from '../providers/mock';

describe('MockProvider', () => {
  it('returns default empty result if no mock is set', async () => {
    const provider = new MockProvider();
    const ac = new AbortController();
    const result = await provider.lookup('http://example.com', 'URL', { signal: ac.signal });
    
    expect(result.status).toBe('NO_MATCH');
    expect(result.providerId).toBe('mock');
  });

  it('respects abort signal', async () => {
    const provider = new MockProvider();
    provider.delayMs = 50; // Delay to allow abort

    const ac = new AbortController();
    const lookupPromise = provider.lookup('http://example.com', 'URL', { signal: ac.signal });
    ac.abort();

    await expect(lookupPromise).rejects.toThrow('AbortError');
  });

  it('returns mocked matched result', async () => {
    const provider = new MockProvider({ reliability: 0.8 });
    provider.mockResult = { status: 'MATCH', classification: 'phishing' };
    
    const ac = new AbortController();
    const result = await provider.lookup('http://bad.com', 'URL', { signal: ac.signal });
    
    expect(result.status).toBe('MATCH');
    expect(result.classification).toBe('phishing');
    expect(result.reliability).toBe(0.8);
  });
});
