import { z } from 'zod';
import { PrivacyModeSchema } from './metadata';

export const TextInputSchema = z.object({
  type: z.literal('text'),
  value: z.string().min(1).max(100_000, 'Text input exceeds maximum allowed length'),
}).strict();
export type TextInput = z.infer<typeof TextInputSchema>;

export const UrlInputSchema = z.object({
  type: z.literal('url'),
  // We use string with max length instead of z.string().url() 
  // because Zod URL validation is structural validation only, 
  // and we don't treat it as the SafeCheck URL security boundary.
  value: z.string().min(1).max(2048),
}).strict();
export type UrlInput = z.infer<typeof UrlInputSchema>;

export const DomainInputSchema = z.object({
  type: z.literal('domain'),
  value: z.string().min(1).max(253),
}).strict();
export type DomainInput = z.infer<typeof DomainInputSchema>;

export const AnalysisInputSchema = z.discriminatedUnion('type', [
  TextInputSchema,
  UrlInputSchema,
  DomainInputSchema,
]);

export type AnalysisInput = z.infer<typeof AnalysisInputSchema>;

export const AnalysisOptionsSchema = z.object({
  enableAi: z.boolean().default(false),
  enableThreatIntel: z.boolean().default(true),
  enableLanguageDetection: z.boolean().default(true),
  privacyMode: PrivacyModeSchema.default('standard'),
}).strict();

export type AnalysisOptions = z.infer<typeof AnalysisOptionsSchema>;
