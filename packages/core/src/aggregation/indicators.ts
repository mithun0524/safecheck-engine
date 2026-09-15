import { Indicator } from '@safecheck/schemas';

/**
 * Aggregates indicators from multiple detectors.
 * Deduplicates by exact indicator ID.
 * Provides deterministic ordering by category, then indicator ID.
 * Does NOT sort by severity.
 */
export function aggregateIndicators(indicators: Indicator[]): Indicator[] {
  const uniqueIndicators = new Map<string, Indicator>();

  for (const ind of indicators) {
    if (!uniqueIndicators.has(ind.id)) {
      uniqueIndicators.set(ind.id, ind);
    }
  }

  // Convert map to array and sort deterministically based purely on identity
  return Array.from(uniqueIndicators.values()).sort((a, b) => {
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) {
      return categoryCompare;
    }
    return a.id.localeCompare(b.id);
  });
}
