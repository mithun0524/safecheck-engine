import { AnalysisOptions, SafeCheckId } from '@safecheck/schemas';

/**
 * Provides the execution context for a detector.
 * 
 * IMPORTANT: JavaScript cannot forcibly terminate an arbitrary Promise.
 * Detectors must cooperatively check `signal.aborted` or pass `signal` 
 * to async operations (like fetch) to actually halt execution on timeout or cancellation.
 */
export interface AnalysisContext {
  /** Uniquely identifies this analysis run */
  readonly analysisId: SafeCheckId;
  
  /** ISO 8601 timestamp of when the analysis began */
  readonly timestamp: string;
  
  /** Current engine version */
  readonly engineVersion: string;
  
  /** Engine-level analysis options */
  readonly options: AnalysisOptions;
  
  /** 
   * Cooperative cancellation signal. 
   * Triggers when analysis is cancelled or hits the engine-level timeout. 
   */
  readonly signal: AbortSignal;
}
