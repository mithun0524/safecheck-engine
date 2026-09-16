import { Evidence } from '@safecheck/schemas';

export interface CorrelationBonus {
  id: string;
  bonus: number;
}

/**
 * Explicit correlation rules for Sprint 4.
 * Each returns a bonus if its required evidence combinations are present.
 */
export function calculateCorrelations(evidenceList: Evidence[]): CorrelationBonus[] {
  const bonuses: CorrelationBonus[] = [];
  const types = new Set(evidenceList.map(e => e.detectorId));

  // CORR-001: urgency + credential-request
  if (types.has('text.urgency') && types.has('text.credential-request')) {
    bonuses.push({ id: 'CORR-001', bonus: 10 });
  }

  // CORR-002: urgency + payment-request
  if (types.has('text.urgency') && types.has('text.payment-request')) {
    bonuses.push({ id: 'CORR-002', bonus: 8 });
  }

  // CORR-003: fear-threat + credential-request
  if (types.has('text.threat') && types.has('text.credential-request')) {
    bonuses.push({ id: 'CORR-003', bonus: 12 });
  }

  // CORR-004: reward-lure + payment-request
  if (types.has('text.reward-lure') && types.has('text.payment-request')) {
    bonuses.push({ id: 'CORR-004', bonus: 10 });
  }

  return bonuses;
}
