import { preprocess } from './preprocessor.js';
import { scanPii } from './piiScanner.js';
import { matchRules, getRuleScore, getMaxRuleSeverity } from './ruleEngine.js';
import { analyzeEntropy } from './entropyAnalyzer.js';
import { fuseScores } from './scoreFusion.js';
import type { DetectionResult } from './types.js';

export { preprocess } from './preprocessor.js';
export { scanPii } from './piiScanner.js';
export { matchRules, getRuleScore, getMaxRuleSeverity } from './ruleEngine.js';
export { analyzeEntropy } from './entropyAnalyzer.js';
export { fuseScores } from './scoreFusion.js';
export { sha256 } from './crypto.js';
export { detectLanguage } from './transliteration.js';
export * from './types.js';

export function detect(input: string): DetectionResult {
  const startTime = performance.now();

  // Step 1: Preprocess
  const { normalized, decodedLayers, detectedLanguage } = preprocess(input);

  // Step 2: Rule matching
  const ruleMatches = matchRules(normalized, decodedLayers);
  const ruleScore = getRuleScore(ruleMatches);
  const maxRuleSeverity = getMaxRuleSeverity(ruleMatches);

  // Step 3: PII scanning (scan original + normalized)
  const piiMatches = scanPii(input);
  const piiNormalized = scanPii(normalized);
  const allPii = [...piiMatches];
  for (const pii of piiNormalized) {
    if (!allPii.some(p => p.type === pii.type && p.maskedValue === pii.maskedValue)) {
      allPii.push(pii);
    }
  }
  const piiScore = allPii.length > 0 ? Math.min(allPii.length * 0.3, 1.0) : 0;

  // Step 4: Entropy analysis
  const entropyResult = analyzeEntropy(input);
  const entropyScore = entropyResult.isAnomaly ? 0.6 : 0;

  // Step 5: Structural analysis (simple heuristic)
  const structuralScore = computeStructuralScore(input);

  // Step 6: Score fusion
  const vetoTriggered = maxRuleSeverity > 0.9;
  const { riskScore, verdict } = fuseScores({
    ruleScore,
    piiScore,
    entropyScore,
    structuralScore,
    vetoTriggered,
  });

  // Determine category
  let category: string | null = null;
  if (ruleMatches.length > 0) {
    category = ruleMatches[0]?.category ?? null;
  } else if (allPii.length > 0) {
    category = 'pii-leakage';
  }

  // Generate explanation
  const explanation = generateExplanation(verdict, ruleMatches, allPii, entropyResult.isAnomaly);

  const processingTimeMs = Math.round(performance.now() - startTime);

  return {
    verdict,
    riskScore,
    category,
    language: detectedLanguage,
    piiDetected: allPii,
    matchedRules: ruleMatches.map(r => r.ruleId),
    explanation,
    processingTimeMs,
  };
}

function computeStructuralScore(text: string): number {
  let score = 0;

  // Long text with many special characters
  const specialRatio = (text.match(/[^a-zA-Z0-9\s]/g)?.length ?? 0) / Math.max(text.length, 1);
  if (specialRatio > 0.3) score += 0.3;

  // Repetitive patterns
  const words = text.split(/\s+/);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const repetitionRatio = 1 - uniqueWords.size / Math.max(words.length, 1);
  if (repetitionRatio > 0.5) score += 0.3;

  // Very long single-line input
  if (text.length > 5000 && !text.includes('\n')) score += 0.2;

  return Math.min(score, 1.0);
}

function generateExplanation(
  verdict: DetectionResult['verdict'],
  ruleMatches: Array<{ description: string; category: string }>,
  pii: Array<{ type: string }>,
  entropyAnomaly: boolean
): string {
  if (verdict === 'safe') {
    return 'No threats detected. Input appears safe.';
  }

  const parts: string[] = [];

  if (ruleMatches.length > 0) {
    const firstMatch = ruleMatches[0];
    if (firstMatch) {
      parts.push(`Matched rule: ${firstMatch.description}`);
    }
    if (ruleMatches.length > 1) {
      parts.push(`(+${ruleMatches.length - 1} more patterns matched)`);
    }
  }

  if (pii.length > 0) {
    const types = [...new Set(pii.map(p => p.type))];
    parts.push(`PII detected: ${types.join(', ')}`);
  }

  if (entropyAnomaly) {
    parts.push('Unusual entropy pattern detected (possible encoded content)');
  }

  return parts.join('. ') || `Verdict: ${verdict}`;
}
