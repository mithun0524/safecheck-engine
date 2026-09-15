/**
 * Safely normalizes text for deterministic pattern matching.
 * - Converts to NFKC to standardize unicode characters.
 * - Removes zero-width characters (e.g. ZWSP).
 * - Collapses multiple whitespaces into a single space.
 * - Converts to lowercase.
 */
export function normalizeText(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFKC') // Normalize unicode
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
    .replace(/\s+/g, ' ') // Collapse whitespace
    .toLowerCase()
    .trim();
}
