import type { DetectionResult, ScoreFusionInput } from './types.js';

export function fuseScores(input: ScoreFusionInput): { riskScore: number; verdict: DetectionResult['verdict'] } {
  // Veto: if any single signal >0.9, immediately classify as malicious
  if (input.vetoTriggered) {
    return { riskScore: 0.95, verdict: 'malicious' };
  }

  // Weighted fusion: rule 0.20, pii 0.55, entropy 0.15, structural 0.10
  const riskScore = Math.min(
    input.ruleScore * 0.20 +
    input.piiScore * 0.55 +
    input.entropyScore * 0.15 +
    input.structuralScore * 0.10,
    1.0
  );

  let verdict: DetectionResult['verdict'];
  if (riskScore < 0.3) {
    verdict = 'safe';
  } else if (riskScore <= 0.7) {
    verdict = 'suspicious';
  } else {
    verdict = 'malicious';
  }

  return { riskScore: Math.round(riskScore * 100) / 100, verdict };
}
