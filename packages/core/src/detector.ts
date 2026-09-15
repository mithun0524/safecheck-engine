import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { AnalysisContext } from './context.js';

/**
 * The canonical interface that every SafeCheck detector must implement.
 */
export interface Detector {
  /** Unique identifier for the detector (e.g., "url-phishing-v1") */
  readonly id: string;

  /**
   * Determines if this detector supports the given input type.
   * Unsupported detectors will not be executed.
   */
  supports(input: AnalysisInput): boolean;

  /**
   * Performs the analysis.
   * 
   * Detectors MUST NOT mutate global state, must rely on the AbortSignal for cooperative cancellation,
   * and must return valid structured evidence and indicators.
   */
  analyze(input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult>;
}
