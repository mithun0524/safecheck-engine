import { z } from 'zod';
import { AnalysisInputSchema } from './analysis';
import { RiskResultSchema } from './risk';
import { ConfidenceSchema } from './confidence';
import { IndicatorSchema } from './indicator';
import { EvidenceSchema } from './evidence';
import { RecommendationSchema } from './recommendation';
import { MetadataSchema } from './metadata';

export const SafeCheckResultSchema = z.object({
  input: AnalysisInputSchema,
  risk: RiskResultSchema,
  confidence: ConfidenceSchema,
  indicators: z.array(IndicatorSchema),
  evidence: z.array(EvidenceSchema),
  recommendation: RecommendationSchema,
  metadata: MetadataSchema,
}).strict();

export type SafeCheckResult = z.infer<typeof SafeCheckResultSchema>;
