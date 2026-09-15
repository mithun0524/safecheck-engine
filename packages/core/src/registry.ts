import { AnalysisInput } from '@safecheck/schemas';
import { Detector } from './detector.js';

/**
 * Manages registration and deterministic resolution of detectors.
 * This is an explicit instance, not a global mutable singleton.
 */
export class DetectorRegistry {
  private readonly detectors = new Map<string, Detector>();
  private readonly orderedIds: string[] = [];

  /**
   * Registers a detector.
   * Throws if the detector ID is already registered to prevent accidental shadowing.
   */
  public register(detector: Detector): void {
    if (this.detectors.has(detector.id)) {
      throw new Error(`Detector with ID '${detector.id}' is already registered.`);
    }
    this.detectors.set(detector.id, detector);
    this.orderedIds.push(detector.id);
  }

  /**
   * Retrieves all detectors that support the given input, preserving registration order determinism.
   */
  public getApplicable(input: AnalysisInput): Detector[] {
    const applicable: Detector[] = [];
    
    // Iterating over the array guarantees stable registration order
    for (const id of this.orderedIds) {
      const detector = this.detectors.get(id);
      if (detector && detector.supports(input)) {
        applicable.push(detector);
      }
    }

    return applicable;
  }
}
