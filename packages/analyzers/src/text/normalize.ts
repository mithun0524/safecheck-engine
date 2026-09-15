/**
 * Safely normalizes text for deterministic pattern matching.
 * - Converts to NFKC to standardize unicode characters.
 * - Removes specific zero-width characters used for obfuscation:
 *   - U+200B (Zero Width Space)
 *   - U+200C (Zero Width Non-Joiner)
 *   - U+200D (Zero Width Joiner)
 *   - U+FEFF (Byte Order Mark)
 * - Collapses multiple whitespaces into a single space.
 * - Converts to lowercase.
 */
export function normalizeText(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFKC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}
