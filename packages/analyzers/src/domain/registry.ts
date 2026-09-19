export interface BrandRecord {
  officialDomains: string[];
  comparisonLabels: string[];
}

/**
 * Minimal explicit official-domain registry for deterministic brand and lookalike analysis.
 */
export const BRAND_REGISTRY: Record<string, BrandRecord> = {
  paypal: {
    officialDomains: ['paypal.com'],
    comparisonLabels: ['paypal'],
  },
  microsoft: {
    officialDomains: ['microsoft.com', 'live.com', 'office.com'],
    comparisonLabels: ['microsoft', 'live', 'office'],
  },
  apple: {
    officialDomains: ['apple.com', 'icloud.com'],
    comparisonLabels: ['apple', 'icloud'],
  },
  google: {
    officialDomains: ['google.com', 'gmail.com', 'youtube.com'],
    comparisonLabels: ['google', 'gmail', 'youtube'],
  },
  amazon: {
    officialDomains: ['amazon.com', 'aws.amazon.com'],
    comparisonLabels: ['amazon'],
  },
  netflix: {
    officialDomains: ['netflix.com'],
    comparisonLabels: ['netflix'],
  },
  facebook: {
    officialDomains: ['facebook.com', 'fb.com'],
    comparisonLabels: ['facebook'],
  },
  meta: {
    officialDomains: ['meta.com'],
    comparisonLabels: ['meta'],
  },
  instagram: {
    officialDomains: ['instagram.com'],
    comparisonLabels: ['instagram'],
  },
  whatsapp: {
    officialDomains: ['whatsapp.com'],
    comparisonLabels: ['whatsapp'],
  },
  chase: {
    officialDomains: ['chase.com'],
    comparisonLabels: ['chase'],
  },
  bankofamerica: {
    officialDomains: ['bankofamerica.com', 'bofa.com'],
    comparisonLabels: ['bankofamerica', 'bofa'],
  },
  wellsfargo: {
    officialDomains: ['wellsfargo.com'],
    comparisonLabels: ['wellsfargo'],
  },
};
