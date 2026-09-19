import { AiEvidenceContext, AiEvidenceProvider } from '../ports/ai-evidence.js';
import { AnalysisInput, AiObservationResult } from '@safecheck/schemas';

export class MockAiProvider implements AiEvidenceProvider {
  public id = 'mock-ai';
  public isLocal = false;
  public requiresRawInput = true;

  public mockResult: unknown = {
    observations: []
  };
  
  public mockDelayMs = 0;
  public mockError: Error | null = null;
  public callCount = 0;
  
  constructor(options?: { isLocal?: boolean; requiresRawInput?: boolean }) {
    if (options?.isLocal !== undefined) {
      this.isLocal = options.isLocal;
    }
    if (options?.requiresRawInput !== undefined) {
      this.requiresRawInput = options.requiresRawInput;
    }
  }

  async analyze(input: AnalysisInput, context: AiEvidenceContext): Promise<AiObservationResult> {
    this.callCount++;

    if (this.mockDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.mockDelayMs));
    }

    if (context.signal.aborted) {
      throw context.signal.reason;
    }

    if (this.mockError) {
      throw this.mockError;
    }

    return this.mockResult as AiObservationResult;
  }
}
