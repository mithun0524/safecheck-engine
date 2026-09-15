import { z } from 'zod';
import { SafeCheckIdSchema } from './common';

export const EvidenceSeveritySchema = z.enum([
  'INFO',
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);
export type EvidenceSeverity = z.infer<typeof EvidenceSeveritySchema>;

export const EvidenceTypeSchema = z.enum([
  'observed_fact',
  'inference',
  'external_intelligence',
]);
export type EvidenceType = z.infer<typeof EvidenceTypeSchema>;

export const EvidenceSourceSchema = z.object({
  name: z.string().min(1).max(100),
  url: z.string().max(2048).optional(),
  type: z.enum(['rule', 'threat_intelligence', 'ml', 'llm', 'domain', 'community']),
}).strict();
export type EvidenceSource = z.infer<typeof EvidenceSourceSchema>;

export const EvidenceSchema = z.object({
  id: SafeCheckIdSchema,
  detectorId: SafeCheckIdSchema,
  type: EvidenceTypeSchema,
  category: z.string().min(1).max(100),
  severity: EvidenceSeveritySchema,
  confidence: z.number().min(0).max(1), // 0..1 scale
  title: z.string().min(1).max(256),
  explanation: z.string().min(1).max(2048),
  source: EvidenceSourceSchema,
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(), // Typed metadata
}).strict();
export type Evidence = z.infer<typeof EvidenceSchema>;
