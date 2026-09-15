import { z } from 'zod';
import { SafeCheckIdSchema } from './common';
import { IndicatorSchema } from './indicator';
import { EvidenceSchema } from './evidence';

export const DetectorResultSchema = z.object({
  detectorId: SafeCheckIdSchema,
  indicators: z.array(IndicatorSchema),
  evidence: z.array(EvidenceSchema),
  detectorConfidence: z.number().min(0).max(1), // 0..1 scale
  severityContribution: z.number().min(0).max(100),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(), // Typed metadata
}).strict();

export type DetectorResult = z.infer<typeof DetectorResultSchema>;
