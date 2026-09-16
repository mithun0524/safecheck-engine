import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SafeCheckEngine } from '../engine.js';
import { DetectorRegistry } from '../registry.js';
import {
  AnalysisInput,
  AnalysisOptions,
  IndicatorCategory
} from '@safecheck/schemas';
import {
  SuccessDetector,
  ThrowingDetector,
  TimeoutDetector,
  UnsupportedDetector,
  InvalidOutputDetector,
  DuplicateEvidenceDetector
} from './test-detectors.js';
import { ThreatIntelPort } from '../ports/threat-intel.js';

describe('SafeCheckEngine', () => {
  let registry: DetectorRegistry;
  let engine: SafeCheckEngine;
  const dummyInput: AnalysisInput = { type: 'text', value: 'Hello scam' };
  const dummyOptions = { enableAi: false, enableThreatIntel: false, enableLanguageDetection: false, privacyMode: 'standard' as const };

  beforeEach(() => {
    registry = new DetectorRegistry();
    engine = new SafeCheckEngine({ registry, defaultTimeoutMs: 100 });
  });

  it('executes successful detectors and aggregates results deterministically', async () => {
    registry.register(new SuccessDetector());
    const result = await engine.analyze('test-id-1', dummyInput, dummyOptions);

    expect(result.risk.status).toBe('DETERMINED');
    expect(result.recommendation.action).toBe('SAFE_TO_PROCEED');
    expect(result.evidence).toHaveLength(1);
    expect(result.evidence[0]!.id).toBe('ev-1');
    expect(result.indicators).toHaveLength(1);
  });

  it('ignores unsupported detectors', async () => {
    registry.register(new UnsupportedDetector());
    registry.register(new SuccessDetector());

    const result = await engine.analyze('test-id-2', dummyInput, dummyOptions); // passing 'text', unsupported expects 'url'
    
    // Only SuccessDetector should have run
    expect(result.evidence).toHaveLength(1);
  });

  it('isolates failures: throwing detectors do not crash the engine', async () => {
    registry.register(new ThrowingDetector());
    registry.register(new SuccessDetector());

    const result = await engine.analyze('test-id-3', dummyInput, dummyOptions);
    
    // Engine succeeds, returns evidence from the successful detector
    expect(result.risk.status).toBe('DETERMINED');
    expect(result.evidence).toHaveLength(1);
  });

  it('isolates failures: invalid output detectors are rejected by validation', async () => {
    registry.register(new InvalidOutputDetector());
    registry.register(new SuccessDetector());

    const result = await engine.analyze('test-id-4', dummyInput, dummyOptions);
    
    // The invalid output detector is rejected, successful one still works
    expect(result.evidence).toHaveLength(1);
  });

  it('handles cooperative timeouts correctly', async () => {
    registry.register(new TimeoutDetector());
    registry.register(new SuccessDetector());

    const startTime = Date.now();
    // Default timeout is 100ms in beforeEach
    const result = await engine.analyze('test-id-5', dummyInput, dummyOptions);
    const duration = Date.now() - startTime;

    // Timeout detector should have timed out and not returned evidence
    // Success detector should return 1 evidence
    expect(result.evidence).toHaveLength(1);
    
    // Ensure timeout happened relatively quickly (accounting for test environment overhead, ~100-200ms)
    expect(duration).toBeLessThan(500); 
  });

  it('deduplicates evidence deterministically', async () => {
    registry.register(new DuplicateEvidenceDetector());
    
    const result = await engine.analyze('test-id-6', dummyInput, dummyOptions);
    
    // The detector returned 2 identical evidences, engine should dedupe to 1
    expect(result.evidence).toHaveLength(1);
  });

  it('prevents duplicate detector registration', () => {
    registry.register(new SuccessDetector());
    expect(() => registry.register(new SuccessDetector())).toThrowError(/already registered/);
  });

  describe('Threat Intelligence Integration', () => {
    let mockProvider: ThreatIntelPort;

    beforeEach(() => {
      mockProvider = {
        id: 'mockti',
        name: 'Mock TI',
        supportedTypes: ['URL'] as IndicatorCategory[],
        requiresRawInput: true,
        lookup: vi.fn().mockResolvedValue({
          providerId: 'mockti',
          indicator: 'http://bad.com',
          status: 'MATCH',
          classification: 'phishing',
          reliability: 0.8,
          metadata: {}
        })
      };
    });

    it('injects threat intel evidence when matched', async () => {
      const engineWithTI = new SafeCheckEngine({ registry, threatIntelProviders: [mockProvider] });
      const input: AnalysisInput = { type: 'url', value: 'http://bad.com' };
      const options: AnalysisOptions = {
        enableAi: false,
        enableThreatIntel: true,
        enableLanguageDetection: false,
        privacyMode: 'standard',
      };

      const result = await engineWithTI.analyze('test-ti', input, options);
      
      const tiEvidence = result.evidence.find(e => e.type === 'external_intelligence');
      expect(tiEvidence).toBeDefined();
      expect(tiEvidence?.severity).toBe('CRITICAL');
      expect(tiEvidence?.confidence).toBe(0.8);
      expect(tiEvidence?.detectorId).toBe('threat-intel-mockti');
    });

    it('bypasses provider requiring raw input in strict mode', async () => {
      const engineWithTI = new SafeCheckEngine({ registry, threatIntelProviders: [mockProvider] });
      const input: AnalysisInput = { type: 'url', value: 'http://bad.com' };
      const options: AnalysisOptions = {
        enableAi: false,
        enableThreatIntel: true,
        enableLanguageDetection: false,
        privacyMode: 'strict',
      };

      const result = await engineWithTI.analyze('test-ti', input, options);
      const tiEvidence = result.evidence.find(e => e.type === 'external_intelligence');
      expect(tiEvidence).toBeUndefined();
    });

    it('completely skips ti when local mode is set', async () => {
      const engineWithTI = new SafeCheckEngine({ registry, threatIntelProviders: [mockProvider] });
      const input: AnalysisInput = { type: 'url', value: 'http://bad.com' };
      const options: AnalysisOptions = {
        enableAi: false,
        enableThreatIntel: true,
        enableLanguageDetection: false,
        privacyMode: 'local',
      };

      const result = await engineWithTI.analyze('test-ti', input, options);
      const tiEvidence = result.evidence.find(e => e.type === 'external_intelligence');
      expect(tiEvidence).toBeUndefined();
    });
  });
});
