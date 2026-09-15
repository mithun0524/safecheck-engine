import { z } from 'zod';

export const SafeCheckIdSchema = z
  .string()
  .min(1, 'ID cannot be empty')
  .max(128, 'ID is too long');

export type SafeCheckId = z.infer<typeof SafeCheckIdSchema>;
