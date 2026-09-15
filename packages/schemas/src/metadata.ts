import { z } from 'zod';
import { SafeCheckIdSchema } from './common';

export const PrivacyModeSchema = z.enum(['standard', 'strict', 'local']);
export type PrivacyMode = z.infer<typeof PrivacyModeSchema>;

export const MetadataSchema = z.object({
  analysisId: SafeCheckIdSchema,
  schemaVersion: z.string().max(50),
  engineVersion: z.string().max(50),
  ruleVersion: z.string().max(50).optional(),
  detectorVersions: z.record(z.string().max(50), z.string().max(50)).optional(),
  timestamp: z.string().datetime(), // ISO 8601 string
  durationMs: z.number().int().nonnegative(),
  language: z.string().max(10).optional(),
  privacyMode: PrivacyModeSchema,
}).strict();

export type Metadata = z.infer<typeof MetadataSchema>;
