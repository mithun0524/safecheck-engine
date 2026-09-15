import { 
  AnalysisInput, 
  AnalysisInputSchema, 
  SafeCheckResult, 
  AnalysisOptions, 
  Evidence, 
  Indicator,
  DetectorResultSchema
} from '@safecheck/schemas';
import { DetectorRegistry } from './registry.js';
import { AnalysisContext } from './context.js';
import { aggregateEvidence } from './aggregation/evidence.js';
import { aggregateIndicators } from './aggregation/indicators.js';
import { sanitizeDiagnostics, EngineTimeoutError } from './errors.js';

export interface EngineConfig {
  readonly registry: DetectorRegistry;
  readonly engineVersion?: string;
  readonly defaultTimeoutMs?: number;
}

export class SafeCheckEngine {
  private readonly registry: DetectorRegistry;
  private readonly engineVersion: string;
  private readonly defaultTimeoutMs: number;

  constructor(config: EngineConfig) {
    this.registry = config.registry;
    this.engineVersion = config.engineVersion || '0.1.0';
    this.defaultTimeoutMs = config.defaultTimeoutMs || 30000;
  }

  /**
   * Executes the analysis orchestration pipeline.
   * Does NOT throw on detector failures, isolating execution.
   */
  public async analyze(
    analysisId: string,
    input: AnalysisInput,
    options: AnalysisOptions,
    timeoutMs: number = this.defaultTimeoutMs
  ): Promise<SafeCheckResult> {
    const startTime = Date.now();
    
    // 1. Validate canonical input (rejects malformed inputs)
    const validatedInput = AnalysisInputSchema.parse(input);

    // 2. Setup context & cooperative cancellation
    const abortController = new AbortController();
    
    const context: AnalysisContext = {
      analysisId,
      timestamp: new Date(startTime).toISOString(),
      engineVersion: this.engineVersion,
      options,
      signal: abortController.signal
    };

    // Timeout mechanism: trigger cooperative abort
    const timeoutId = setTimeout(() => {
      abortController.abort(new EngineTimeoutError(`Analysis timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    try {
      // 3. Resolve applicable detectors
      const applicableDetectors = this.registry.getApplicable(validatedInput);

      // 4. Execute all detectors isolated via Promise.allSettled
      const executions = applicableDetectors.map(async (detector) => {
        try {
          const rawResult = await detector.analyze(validatedInput, context);
          
          // Validate detector output strictly to prevent malformed injections
          return DetectorResultSchema.parse(rawResult);
        } catch (error) {
          // If aborted due to timeout, the detector might throw the AbortError or EngineTimeoutError
          if (context.signal.aborted && error instanceof Error && error.name === 'AbortError') {
             throw context.signal.reason; 
          }
          throw error;
        }
      });

      const results = await Promise.allSettled(executions);

      // 5. Collect successful results & sanitize errors
      const collectedEvidence: Evidence[] = [];
      const collectedIndicators: Indicator[] = [];
      const diagnostics: Record<string, unknown> = {};

      applicableDetectors.forEach((detector, index) => {
        const result = results[index];
        if (result && result.status === 'fulfilled') {
          collectedEvidence.push(...result.value.evidence);
          collectedIndicators.push(...result.value.indicators);
        } else if (result && result.status === 'rejected') {
          diagnostics[detector.id] = sanitizeDiagnostics(result.reason);
        }
      });

      // 6. Aggregate
      const aggregatedEvidence = aggregateEvidence(collectedEvidence);
      const aggregatedIndicators = aggregateIndicators(collectedIndicators);

      // 7. Construct final Engine-stage response
      const durationMs = Date.now() - startTime;

      return {
        input: validatedInput,
        risk: {
          status: 'INCONCLUSIVE',
          level: 'INCONCLUSIVE',
          riskConfidence: 0,
          evidenceReferences: aggregatedEvidence.map((e) => e.id),
          explanation: 'Engine-only execution completed without final risk calculation.',
          reason: 'Risk scoring not implemented in engine stage',
        },
        confidence: {
          overallConfidence: 0, // Cannot be calculated without risk engine
        },
        indicators: aggregatedIndicators,
        evidence: aggregatedEvidence,
        recommendation: {
          // Explicitly INCONCLUSIVE_VERIFY per strict instructions
          action: 'INCONCLUSIVE_VERIFY',
          context: 'Risk analysis algorithm has not yet evaluated the collected evidence.',
        },
        metadata: {
          analysisId,
          schemaVersion: '1.0.0', // This aligns with @safecheck/schemas version implicitly
          engineVersion: this.engineVersion,
          timestamp: context.timestamp,
          durationMs,
          privacyMode: options.privacyMode,
          // detectorVersions is optional, so omitted cleanly if empty
        }
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
