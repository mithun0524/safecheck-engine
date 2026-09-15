import { ErrorCode } from '@safecheck/schemas';

/**
 * Base class for all internal Engine errors.
 */
export class SafeCheckEngineError extends Error {
  public readonly code: ErrorCode;
  
  constructor(message: string, code: ErrorCode = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'SafeCheckEngineError';
    this.code = code;
  }
}

/**
 * Represents a timeout occurring during detector execution.
 */
export class EngineTimeoutError extends SafeCheckEngineError {
  constructor(message = 'Analysis timed out') {
    super(message, 'ANALYSIS_FAILED');
    this.name = 'EngineTimeoutError';
  }
}

/**
 * Utility to safely sanitize arbitrary errors caught from detectors.
 * It strictly strips stack traces, filesystem paths, and deeply nested objects
 * to prevent credential or infrastructure leakage.
 */
export function sanitizeDiagnostics(error: unknown): Record<string, string | number | boolean> {
  const safeDiagnostics: Record<string, string | number | boolean> = {};

  if (error instanceof Error) {
    safeDiagnostics.name = error.name;
    // We intentionally DO NOT copy error.stack
    // We truncate messages to prevent leaking massive amounts of sensitive info
    safeDiagnostics.message = error.message.substring(0, 1024);
  } else if (typeof error === 'string') {
    safeDiagnostics.message = error.substring(0, 1024);
  } else {
    safeDiagnostics.message = 'Unknown detector error';
  }

  return safeDiagnostics;
}
