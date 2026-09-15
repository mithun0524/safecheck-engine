import { Evidence } from '@safecheck/schemas';

/**
 * Aggregates evidence from multiple detectors.
 * Deduplicates by exact evidence ID.
 * Provides deterministic ordering by detectorId, then evidenceId.
 * Does NOT sort by severity, preserving the raw importance collected.
 */
export function aggregateEvidence(evidenceList: Evidence[]): Evidence[] {
  const uniqueEvidence = new Map<string, Evidence>();

  for (const ev of evidenceList) {
    if (!uniqueEvidence.has(ev.id)) {
      uniqueEvidence.set(ev.id, ev);
    }
  }

  // Convert map to array and sort deterministically based purely on identity
  return Array.from(uniqueEvidence.values()).sort((a, b) => {
    const detectorCompare = a.detectorId.localeCompare(b.detectorId);
    if (detectorCompare !== 0) {
      return detectorCompare;
    }
    return a.id.localeCompare(b.id);
  });
}
