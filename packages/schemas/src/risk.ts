import { z } from 'zod';
import { SafeCheckIdSchema } from './common';

export const RiskLevelSchema = z.enum(['LOW', 'SUSPICIOUS', 'HIGH', 'CRITICAL', 'INCONCLUSIVE']);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const DeterminedRiskResultSchema = z.object({
  status: z.literal('DETERMINED'),
  score: z.number().min(0).max(100),
  level: z.enum(['LOW', 'SUSPICIOUS', 'HIGH', 'CRITICAL']), // No INCONCLUSIVE here
  riskConfidence: z.number().min(0).max(1), // 0..1 scale
  evidenceReferences: z.array(SafeCheckIdSchema),
  explanation: z.string().min(1).max(2048),
}).strict();
export type DeterminedRiskResult = z.infer<typeof DeterminedRiskResultSchema>;

export const InconclusiveRiskResultSchema = z.object({
  status: z.literal('INCONCLUSIVE'),
  level: z.literal('INCONCLUSIVE'),
  // Score intentionally omitted
  riskConfidence: z.number().min(0).max(1), // 0..1 scale
  evidenceReferences: z.array(SafeCheckIdSchema),
  explanation: z.string().min(1).max(2048),
  reason: z.string().min(1).max(1024),
}).strict();
export type InconclusiveRiskResult = z.infer<typeof InconclusiveRiskResultSchema>;

export const RiskResultSchema = z.discriminatedUnion('status', [
  DeterminedRiskResultSchema,
  InconclusiveRiskResultSchema,
]);

export type RiskResult = z.infer<typeof RiskResultSchema>;
