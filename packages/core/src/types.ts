export interface DetectionResult {
  verdict: 'safe' | 'suspicious' | 'malicious';
  riskScore: number;
  category: string | null;
  language: string;
  piiDetected: PiiMatch[];
  matchedRules: string[];
  explanation: string;
  processingTimeMs: number;
}

export interface PiiMatch {
  type: string;
  maskedValue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface RuleFile {
  name: string;
  category: string;
  language: string;
  patterns: RulePattern[];
}

export interface RulePattern {
  id: string;
  pattern: string;
  flags?: string;
  severity: number;
  description: string;
}

export interface PreprocessResult {
  normalized: string;
  decodedLayers: string[];
  detectedLanguage: string;
}

export interface EntropyResult {
  entropy: number;
  isAnomaly: boolean;
  segments: EntropySegment[];
}

export interface EntropySegment {
  text: string;
  entropy: number;
  isAnomaly: boolean;
}

export interface RuleMatch {
  ruleId: string;
  category: string;
  severity: number;
  matchedText: string;
  description: string;
}

export interface ScoreFusionInput {
  ruleScore: number;
  piiScore: number;
  entropyScore: number;
  structuralScore: number;
  vetoTriggered: boolean;
}

export interface UsageResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
}
