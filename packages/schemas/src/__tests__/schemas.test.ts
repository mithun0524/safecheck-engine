import { describe, it, expect } from 'vitest';
import {
  RiskResultSchema,
  ConfidenceSchema,
  EvidenceSeveritySchema,
  SafeCheckIdSchema,
  MetadataSchema,
} from '../index.js';

describe('SafeCheck Schemas', () => {
  describe('RiskResultSchema', () => {
    it('rejects INCONCLUSIVE if a score is provided', () => {
      const result = RiskResultSchema.safeParse({
        status: 'INCONCLUSIVE',
        level: 'INCONCLUSIVE',
        score: 50, // This should cause failure
        riskConfidence: 0.5,
        evidenceReferences: [],
        explanation: 'Not enough data',
        reason: 'Missing domain history',
      });
      expect(result.success).toBe(false);
    });

    it('rejects DETERMINED if level is INCONCLUSIVE', () => {
      const result = RiskResultSchema.safeParse({
        status: 'DETERMINED',
        score: 50,
        level: 'INCONCLUSIVE', // Invalid level for DETERMINED
        riskConfidence: 0.8,
        evidenceReferences: [],
        explanation: 'Looks a bit phishy',
      });
      expect(result.success).toBe(false);
    });

    it('accepts valid DETERMINED risk', () => {
      const result = RiskResultSchema.safeParse({
        status: 'DETERMINED',
        score: 85,
        level: 'HIGH',
        riskConfidence: 0.9,
        evidenceReferences: ['ev-123'],
        explanation: 'Known phishing domain',
      });
      expect(result.success).toBe(true);
    });

    it('accepts valid INCONCLUSIVE risk', () => {
      const result = RiskResultSchema.safeParse({
        status: 'INCONCLUSIVE',
        level: 'INCONCLUSIVE',
        riskConfidence: 0.1,
        evidenceReferences: [],
        explanation: 'No evidence found',
        reason: 'New domain, no traffic',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('ConfidenceSchema', () => {
    it('rejects confidence > 1', () => {
      const result = ConfidenceSchema.safeParse({
        overallConfidence: 1.5,
      });
      expect(result.success).toBe(false);
    });

    it('rejects confidence < 0', () => {
      const result = ConfidenceSchema.safeParse({
        overallConfidence: -0.1,
      });
      expect(result.success).toBe(false);
    });

    it('accepts confidence between 0 and 1', () => {
      const result = ConfidenceSchema.safeParse({
        overallConfidence: 0.85,
        evidenceQuality: 0.9,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Enums (EvidenceSeveritySchema)', () => {
    it('rejects invalid enum values', () => {
      const result = EvidenceSeveritySchema.safeParse('SUPER_CRITICAL');
      expect(result.success).toBe(false);
    });

    it('accepts valid enum values', () => {
      const result = EvidenceSeveritySchema.safeParse('CRITICAL');
      expect(result.success).toBe(true);
    });
  });

  describe('SafeCheckIdSchema', () => {
    it('rejects empty ID', () => {
      const result = SafeCheckIdSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('rejects oversized ID', () => {
      const oversized = 'a'.repeat(200);
      const result = SafeCheckIdSchema.safeParse(oversized);
      expect(result.success).toBe(false);
    });

    it('accepts reasonable ID', () => {
      const result = SafeCheckIdSchema.safeParse('valid-id-123');
      expect(result.success).toBe(true);
    });
  });

  describe('MetadataSchema', () => {
    it('rejects unsafe arbitrary objects in metadata root', () => {
      const result = MetadataSchema.safeParse({
        analysisId: 'analysis-1',
        schemaVersion: '1.0',
        engineVersion: '1.0',
        timestamp: new Date().toISOString(),
        durationMs: 150,
        privacyMode: 'standard',
        injectedObject: { secret: 'api-key' },
      });
      expect(result.success).toBe(false);
    });
    
    it('accepts valid metadata', () => {
      const result = MetadataSchema.safeParse({
        analysisId: 'analysis-1',
        schemaVersion: '1.0',
        engineVersion: '1.0',
        timestamp: new Date().toISOString(),
        durationMs: 150,
        privacyMode: 'standard',
      });
      expect(result.success).toBe(true);
    });
  });
});
