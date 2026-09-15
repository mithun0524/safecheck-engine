import { Detector } from '../detector.js';
import { AnalysisInput, DetectorResult } from '@safecheck/schemas';
import { AnalysisContext } from '../context.js';

export class SuccessDetector implements Detector {
  public id = 'success-v1';

  supports(_input: AnalysisInput): boolean {
    return true;
  }

  async analyze(_input: AnalysisInput, _context: AnalysisContext): Promise<DetectorResult> {
    return {
      detectorId: this.id,
      indicators: [
        {
          id: 'ind-1',
          category: 'TEXT',
          type: 'keyword',
          severity: 'INFO',
          confidence: 0.9,
          explanation: 'Found keyword',
        },
      ],
      evidence: [
        {
          id: 'ev-1',
          detectorId: this.id,
          type: 'observed_fact',
          category: 'content',
          severity: 'LOW',
          confidence: 1,
          title: 'Keyword presence',
          explanation: 'The text contains common keywords',
          source: { name: 'Internal', type: 'rule' },
        },
      ],
      detectorConfidence: 1,
      severityContribution: 10,
    };
  }
}

export class ThrowingDetector implements Detector {
  public id = 'throwing-v1';

  supports(_input: AnalysisInput): boolean {
    return true;
  }

  async analyze(_input: AnalysisInput, _context: AnalysisContext): Promise<DetectorResult> {
    throw new Error('Unexpected database disconnection');
  }
}

export class TimeoutDetector implements Detector {
  public id = 'timeout-v1';

  supports(_input: AnalysisInput): boolean {
    return true;
  }

  async analyze(_input: AnalysisInput, context: AnalysisContext): Promise<DetectorResult> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve({} as DetectorResult), 50000);
      
      // Cooperative cancellation
      context.signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(context.signal.reason);
      });
    });
  }
}

export class UnsupportedDetector implements Detector {
  public id = 'unsupported-v1';

  supports(input: AnalysisInput): boolean {
    return input.type === 'url'; // Let's say we only pass 'text' in tests
  }

  async analyze(_input: AnalysisInput, _context: AnalysisContext): Promise<DetectorResult> {
    throw new Error('Should not be called');
  }
}

export class InvalidOutputDetector implements Detector {
  public id = 'invalid-out-v1';

  supports(_input: AnalysisInput): boolean {
    return true;
  }

  async analyze(_input: AnalysisInput, _context: AnalysisContext): Promise<DetectorResult> {
    // Intentionally bypass types to return invalid output
    return {
      detectorId: this.id,
      indicators: [],
      evidence: [],
      detectorConfidence: 999, // Invalid (must be 0-1)
      severityContribution: 10,
    } as unknown as DetectorResult;
  }
}

export class DuplicateEvidenceDetector implements Detector {
  public id = 'dup-ev-v1';

  supports(_input: AnalysisInput): boolean {
    return true;
  }

  async analyze(_input: AnalysisInput, _context: AnalysisContext): Promise<DetectorResult> {
    return {
      detectorId: this.id,
      indicators: [],
      evidence: [
        {
          id: 'shared-ev-1',
          detectorId: this.id,
          type: 'observed_fact',
          category: 'content',
          severity: 'HIGH',
          confidence: 0.8,
          title: 'Shared Evidence',
          explanation: 'This evidence is duplicated',
          source: { name: 'Internal', type: 'rule' },
        },
        {
          id: 'shared-ev-1', // Intentional duplicate ID within same detector
          detectorId: this.id,
          type: 'observed_fact',
          category: 'content',
          severity: 'HIGH',
          confidence: 0.8,
          title: 'Shared Evidence',
          explanation: 'This evidence is duplicated',
          source: { name: 'Internal', type: 'rule' },
        }
      ],
      detectorConfidence: 1,
      severityContribution: 10,
    };
  }
}
