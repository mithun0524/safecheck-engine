import { RiskLevel, Recommendation } from '@safecheck/schemas';

export function mapRiskToRecommendation(
  level: RiskLevel | 'INCONCLUSIVE',
  confidence: number,
  evidenceTypes: Set<string>
): Recommendation {
  if (level === 'INCONCLUSIVE') {
    return {
      action: 'INCONCLUSIVE_VERIFY',
      context: 'Insufficient evidence to determine risk. Please verify through an official channel.',
    };
  }

  if (level === 'HIGH' || level === 'CRITICAL') {
    if (evidenceTypes.has('text.credential-request')) {
      return {
        action: 'DO_NOT_SHARE_CREDENTIALS',
        context: 'A high-risk request for sensitive credentials was detected.',
      };
    }

    if (evidenceTypes.has('text.payment-request') || evidenceTypes.has('text.job-scam-pattern')) {
      return {
        action: 'DO_NOT_PAY',
        context: 'A high-risk request for payment or financial transfer was detected.',
      };
    }
  }

  if (level === 'CRITICAL') {
    return {
      action: 'DO_NOT_INTERACT',
      context: 'Critical risk indicators detected. Stop interaction immediately.',
    };
  }

  if (level === 'SUSPICIOUS') {
    return {
      action: 'PROCEED_WITH_CAUTION',
      context: 'Suspicious elements were detected. Verify the source carefully.',
    };
  }

  // level === 'LOW'
  if (confidence >= 0.5) {
    return {
      action: 'SAFE_TO_PROCEED',
      context: 'No significant risk indicators were found.',
    };
  }

  // Fallback for LOW risk with low confidence (though calculator shouldn't reach here 
  // since confidence < 0.5 is INCONCLUSIVE overall, but handled defensively)
  return {
    action: 'INCONCLUSIVE_VERIFY',
    context: 'Risk appears low, but confidence in this assessment is insufficient.',
  };
}
