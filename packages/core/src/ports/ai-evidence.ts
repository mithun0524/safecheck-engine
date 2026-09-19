import { AnalysisInput, AnalysisOptions, AiObservationResult } from '@safecheck/schemas';

export interface AiEvidenceContext {
  signal: AbortSignal;
  options: AnalysisOptions;
}

/**
 * Port for AI evidence providers.
 * AI providers strictly return bounded AiObservations. They do NOT return SafeCheck Evidence directly.
 */
export interface AiEvidenceProvider {
  readonly id: string;
  readonly isLocal: boolean;
  readonly requiresRawInput: boolean;
  
  analyze(
    input: AnalysisInput,
    context: AiEvidenceContext
  ): Promise<AiObservationResult>;
}
