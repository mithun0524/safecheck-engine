import { z } from 'zod';

export const RecommendationActionSchema = z.enum([
  'SAFE_TO_PROCEED',
  'PROCEED_WITH_CAUTION',
  'DO_NOT_INTERACT',
  'DO_NOT_PAY',
  'DO_NOT_SHARE_CREDENTIALS',
  'VERIFY_THROUGH_OFFICIAL_CHANNEL',
  'INCONCLUSIVE_VERIFY',
]);

export type RecommendationAction = z.infer<typeof RecommendationActionSchema>;

export const RecommendationSchema = z.object({
  action: RecommendationActionSchema,
  context: z.string().max(1024).optional(),
}).strict();

export type Recommendation = z.infer<typeof RecommendationSchema>;
