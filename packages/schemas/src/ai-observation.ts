import { z } from 'zod';

export const AiObservationCategorySchema = z.enum([
  'semantics',
  'urgency',
  'financial_request',
  'credential_request',
  'unknown'
]);

export type AiObservationCategory = z.infer<typeof AiObservationCategorySchema>;

export const AiObservationSchema = z.object({
  category: AiObservationCategorySchema.default('unknown'),
  description: z.string().min(1).max(500),
  confidence: z.number().min(0).max(1).optional(),
}).strict();

export const AiObservationResultSchema = z.object({
  observations: z.array(AiObservationSchema).max(10),
}).strict();

export type AiObservation = z.infer<typeof AiObservationSchema>;
export type AiObservationResult = z.infer<typeof AiObservationResultSchema>;
