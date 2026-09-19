import { 
  AnalysisInput, 
  AnalysisInputSchema, 
  SafeCheckResult, 
  AnalysisOptions, 
  Evidence, 
  Indicator,
  DetectorResultSchema,
  IndicatorCategory,
  AiObservationResultSchema
} from '@safecheck/schemas';
import { DetectorRegistry } from './registry.js';
import { AnalysisContext } from './context.js';
import { aggregateEvidence } from './aggregation/evidence.js';
import { aggregateIndicators } from './aggregation/indicators.js';
import { sanitizeDiagnostics, EngineTimeoutError } from './errors.js';
import { RiskCalculator } from './risk/calculator.js';
import { ThreatIntelPort } from './ports/threat-intel.js';
import { AiEvidenceProvider } from './ports/ai-evidence.js';

export interface EngineConfig {
  readonly registry: DetectorRegistry;
  readonly engineVersion?: string;
  readonly defaultTimeoutMs?: number;
  readonly threatIntelProviders?: ThreatIntelPort[];
  readonly threatIntelTimeoutMs?: number;
  readonly aiProviders?: AiEvidenceProvider[];
  readonly aiTimeoutMs?: number;
}

export class SafeCheckEngine {
  private readonly registry: DetectorRegistry;
  private readonly engineVersion: string;
  private defaultTimeoutMs: number;
  private threatIntelProviders: ThreatIntelPort[];
  private threatIntelTimeoutMs: number;
  private aiProviders: AiEvidenceProvider[];
  private aiTimeoutMs: number;

  constructor(config: EngineConfig) {
    this.registry = config.registry;
    this.engineVersion = config.engineVersion || '0.1.0';
    this.defaultTimeoutMs = config.defaultTimeoutMs || 30000;
    this.threatIntelProviders = config.threatIntelProviders || [];
    this.threatIntelTimeoutMs = config.threatIntelTimeoutMs || 2000;
    this.aiProviders = config.aiProviders || [];
    this.aiTimeoutMs = config.aiTimeoutMs || 10000;
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

      // 5.5. Threat Intelligence Integration
      if (options.enableThreatIntel && this.threatIntelProviders.length > 0) {
        let indicatorValue: string | null = null;
        let indicatorType: IndicatorCategory | null = null;

        if (validatedInput.type === 'url') {
          indicatorValue = validatedInput.value;
          indicatorType = 'URL';
        } else if (validatedInput.type === 'domain') {
          indicatorValue = validatedInput.value;
          indicatorType = 'DOMAIN';
        }

        if (indicatorValue && indicatorType) {
          const tiAbort = new AbortController();
          const tiTimeoutId = setTimeout(() => tiAbort.abort(new Error('TimeoutError')), this.threatIntelTimeoutMs);
          
          const parentHandler = () => tiAbort.abort(context.signal.reason);
          context.signal.addEventListener('abort', parentHandler);

          try {
            const lookups = this.threatIntelProviders.map(async (provider) => {
              if (options.privacyMode === 'strict' && provider.requiresRawInput) {
                return null;
              }
              if (!provider.supportedTypes.includes(indicatorType!)) {
                return null;
              }
              if (options.privacyMode === 'local') {
                return null;
              }

              try {
                return await provider.lookup(indicatorValue!, indicatorType!, { signal: tiAbort.signal });
              } catch (e: unknown) {
                diagnostics[`ti-${provider.id}`] = sanitizeDiagnostics(e);
                return null;
              }
            });

            const results = await Promise.allSettled(lookups);
            const validResults = results
              .map(r => r.status === 'fulfilled' ? r.value : null)
              .filter(r => r !== null && r.status === 'MATCH');

            // Deterministic ordering
            validResults.sort((a, b) => a!.providerId.localeCompare(b!.providerId));

            for (const res of validResults) {
              collectedEvidence.push({
                id: `ti-${res!.providerId}-${Date.now()}`,
                detectorId: `threat-intel-${res!.providerId}`,
                type: 'external_intelligence',
                category: res!.classification || 'malicious',
                severity: 'CRITICAL',
                confidence: res!.reliability,
                title: `${res!.providerId} matched indicator`,
                explanation: `Indicator was flagged as ${res!.classification || 'malicious'} by ${res!.providerId}.`,
                source: {
                  name: res!.providerId,
                  type: 'threat_intelligence'
                },
                metadata: {
                  ...res!.metadata
                }
              });
            }
          } finally {
            clearTimeout(tiTimeoutId);
            context.signal.removeEventListener('abort', parentHandler);
          }
        }
      }

      // 5.6. AI Evidence Generation
      if (options.enableAi && this.aiProviders.length > 0) {
        const aiAbort = new AbortController();
        const aiTimeoutId = setTimeout(() => aiAbort.abort(new Error('TimeoutError')), this.aiTimeoutMs);
        
        const parentHandler = () => aiAbort.abort(context.signal.reason);
        context.signal.addEventListener('abort', parentHandler);

        try {
          const aiContext = {
            signal: aiAbort.signal,
            options,
          };

          const aiLookups = this.aiProviders.map(async (provider) => {
            if (options.privacyMode === 'strict' && provider.requiresRawInput) {
              return null; // Strict mode blocks providers that require raw input
            }
            if (options.privacyMode === 'local' && !provider.isLocal) {
              return null; // Local mode blocks non-local AI
            }

            try {
              const rawResult = await provider.analyze(validatedInput, aiContext);
              // Strict Zod validation of AI output
              return AiObservationResultSchema.parse(rawResult);
            } catch (e: unknown) {
              diagnostics[`ai-${provider.id}`] = sanitizeDiagnostics(e);
              return null;
            }
          });

          const aiResults = await Promise.allSettled(aiLookups);
          
          aiResults.forEach((result, index) => {
            const provider = this.aiProviders[index]!;
            if (result.status === 'fulfilled' && result.value) {
              // Trusted Mapping: Map AiObservations to SafeCheck Evidence
              for (const obs of result.value.observations) {
                collectedEvidence.push({
                  id: `ai-${provider.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                  detectorId: 'ai.observation', // Strict mapping, AI cannot control this
                  type: 'inference',
                  category: obs.category === 'unknown' ? 'suspicious' : 'scam', // Generic safe category mapping
                  severity: 'INFO', // AI never dictates severity directly in Sprint 7
                  confidence: obs.confidence ?? 0.5,
                  title: `AI Observation: ${obs.category}`,
                  explanation: obs.description,
                  source: {
                    name: provider.id,
                    type: 'llm'
                  },
                  metadata: {
                    aiCategory: obs.category
                  }
                });
              }
            } else if (result.status === 'rejected') {
               diagnostics[`ai-${provider.id}-rejected`] = sanitizeDiagnostics(result.reason);
            }
          });
        } finally {
          clearTimeout(aiTimeoutId);
          context.signal.removeEventListener('abort', parentHandler);
        }
      }

      // 6. Aggregate
      const aggregatedEvidence = aggregateEvidence(collectedEvidence);
      const aggregatedIndicators = aggregateIndicators(collectedIndicators);

      // 7. Construct final Engine-stage response
      const durationMs = Date.now() - startTime;
      
      const riskCalculator = new RiskCalculator();
      const riskCalculation = riskCalculator.calculate({
        evidence: aggregatedEvidence
      });

      return {
        input: validatedInput,
        risk: riskCalculation.risk,
        confidence: {
          overallConfidence: riskCalculation.confidence.score,
        },
        indicators: aggregatedIndicators,
        evidence: aggregatedEvidence,
        recommendation: riskCalculation.recommendation,
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
