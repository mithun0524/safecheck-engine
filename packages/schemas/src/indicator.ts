import { z } from 'zod';
import { SafeCheckIdSchema } from './common';
import { EvidenceSeveritySchema } from './evidence';

export const IndicatorCategorySchema = z.enum([
  'TEXT',
  'URL',
  'DOMAIN',
  'BRAND',
  'THREAT_INTEL',
  'BEHAVIOR',
]);
export type IndicatorCategory = z.infer<typeof IndicatorCategorySchema>;

export const IndicatorSchema = z.object({
  id: SafeCheckIdSchema,
  category: IndicatorCategorySchema,
  type: z.string().min(1).max(100),
  severity: EvidenceSeveritySchema,
  confidence: z.number().min(0).max(1), // 0..1 scale
  explanation: z.string().min(1).max(2048),
  evidenceReference: SafeCheckIdSchema.optional(),
}).strict();
export type Indicator = z.infer<typeof IndicatorSchema>;
