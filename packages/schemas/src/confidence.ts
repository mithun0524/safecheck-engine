import { z } from 'zod';

export const ConfidenceSchema = z.object({
  overallConfidence: z.number().min(0).max(1), // 0..1 scale
  evidenceQuality: z.number().min(0).max(1).optional(),
  evidenceCoverage: z.number().min(0).max(1).optional(),
  freshness: z.number().min(0).max(1).optional(),
  contradictionInformation: z.string().max(1024).optional(),
}).strict();

export type Confidence = z.infer<typeof ConfidenceSchema>;
