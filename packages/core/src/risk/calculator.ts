import { Evidence, RiskResult, Recommendation, EvidenceSeverity } from '@safecheck/schemas';
import { getEvidenceWeight } from './weights.js';
import { calculateCorrelations } from './correlations.js';
import { mapRiskToRecommendation } from './recommendation-mapper.js';

export interface RiskCalculationContext {
  evidence: Evidence[];
}

export interface RiskCalculationResult {
  risk: RiskResult;
  confidence: { score: number; level: 'low' | 'medium' | 'high' };
  recommendation: Recommendation;
}

function getSeverityNumeric(severity: EvidenceSeverity): number {
  switch (severity) {
    case 'INFO': return 0;
    case 'LOW': return 1;
    case 'MEDIUM': return 2;
    case 'HIGH': return 3;
    case 'CRITICAL': return 4;
    default: return 0;
  }
}

/**
 * Deterministically calculates risk based on ADR-007 specifications.
 */
export class RiskCalculator {
  public calculate(context: RiskCalculationContext): RiskCalculationResult {
    const { evidence } = context;

    // 1. Calculate Confidence (Average of detector confidences, clamped 0-1)
    if (evidence.length === 0) {
      return this.buildInconclusive(evidence, 'Zero usable evidence found.');
    }

    const totalConfidence = evidence.reduce((sum, ev) => sum + ev.confidence, 0);
    const riskConfidence = Math.max(0, Math.min(1, totalConfidence / evidence.length));

    if (riskConfidence < 0.5) {
      return this.buildInconclusive(evidence, `Insufficient risk confidence (${riskConfidence.toFixed(2)}).`);
    }

    // 2. Base Risk Formula
    let baseScore = 0;
    const evidenceDetectorIds = new Set<string>();

    for (const ev of evidence) {
      const weight = getEvidenceWeight(ev.detectorId);
      const severityNum = getSeverityNumeric(ev.severity);
      const baseContribution = severityNum * ev.confidence * weight * 25;
      baseScore += baseContribution;
      evidenceDetectorIds.add(ev.detectorId);
    }

    // 3. Correlations
    const correlations = calculateCorrelations(evidence);
    let correlationBonus = 0;
    for (const corr of correlations) {
      correlationBonus += corr.bonus;
    }

    // Contradictions are deferred in Sprint 4.

    // 4. Final Score: clamp(round(baseScore + correlationBonus), 0, 100)
    const riskScore = Math.max(0, Math.min(100, Math.round(baseScore + correlationBonus)));

    // 5. Risk Levels
    let level: 'LOW' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskScore >= 80) level = 'CRITICAL';
    else if (riskScore >= 50) level = 'HIGH';
    else if (riskScore >= 25) level = 'SUSPICIOUS';
    else level = 'LOW';

    // 6. Confidence Level Mapping
    let confidenceLevel: 'low' | 'medium' | 'high' = 'low';
    const confidenceScore100 = riskConfidence * 100;
    if (confidenceScore100 >= 70) confidenceLevel = 'high';
    else if (confidenceScore100 >= 40) confidenceLevel = 'medium';

    // 7. Recommendations
    const recommendation = mapRiskToRecommendation(level, riskConfidence, evidenceDetectorIds);

    const risk: RiskResult = {
      status: 'DETERMINED',
      score: riskScore,
      level,
      riskConfidence,
      evidenceReferences: evidence.map((e) => e.id),
      explanation: `Calculated risk score of ${riskScore} (${level}).`,
    };

    return {
      risk,
      confidence: { score: confidenceScore100, level: confidenceLevel },
      recommendation,
    };
  }

  private buildInconclusive(evidence: Evidence[], reason: string): RiskCalculationResult {
    const riskConfidence = evidence.length > 0 
      ? Math.max(0, Math.min(1, evidence.reduce((sum, ev) => sum + ev.confidence, 0) / evidence.length))
      : 0;
      
    const risk: RiskResult = {
      status: 'INCONCLUSIVE',
      level: 'INCONCLUSIVE',
      riskConfidence,
      evidenceReferences: evidence.map((e) => e.id),
      explanation: 'Analysis could not reach a definitive conclusion.',
      reason,
    };

    return {
      risk,
      confidence: { score: riskConfidence * 100, level: 'low' },
      recommendation: {
        action: 'INCONCLUSIVE_VERIFY',
        context: 'Insufficient evidence to determine risk. Please verify through an official channel.',
      },
    };
  }
}
