import { z } from 'zod';

export const ErrorCodeSchema = z.enum([
  'INVALID_INPUT',
  'UNSUPPORTED_INPUT',
  'INPUT_TOO_LARGE',
  'ANALYSIS_FAILED',
  'PROVIDER_UNAVAILABLE',
  'RATE_LIMITED',
  'INTERNAL_ERROR',
]);

export type ErrorCode = z.infer<typeof ErrorCodeSchema>;

export const DomainErrorSchema = z.object({
  code: ErrorCodeSchema,
  message: z.string().max(1024),
  details: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(), // Strictly limit to primitive values to prevent leaking objects with credentials
}).strict();

export type DomainError = z.infer<typeof DomainErrorSchema>;
