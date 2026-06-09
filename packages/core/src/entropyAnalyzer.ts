import type { EntropyResult, EntropySegment } from './types.js';

function shannonEntropy(text: string): number {
  if (text.length === 0) return 0;

  const freq: Record<string, number> = {};
  for (const char of text) {
    freq[char] = (freq[char] ?? 0) + 1;
  }

  let entropy = 0;
  const len = text.length;
  for (const count of Object.values(freq)) {
    const p = count / len;
    if (p > 0) {
      entropy -= p * Math.log2(p);
    }
  }

  return entropy;
}

const SEGMENT_SIZE = 64;

export function analyzeEntropy(text: string): EntropyResult {
  const overallEntropy = shannonEntropy(text);
  const segments: EntropySegment[] = [];

  for (let i = 0; i < text.length; i += SEGMENT_SIZE) {
    const segment = text.slice(i, i + SEGMENT_SIZE);
    if (segment.length < 8) continue;

    const segEntropy = shannonEntropy(segment);
    const isAnomaly = segEntropy > 5.5 || segEntropy < 2.0;

    segments.push({
      text: segment.slice(0, 20) + (segment.length > 20 ? '...' : ''),
      entropy: Math.round(segEntropy * 1000) / 1000,
      isAnomaly,
    });
  }

  const hasAnomaly = segments.some(s => s.isAnomaly) || overallEntropy > 5.5 || (overallEntropy < 2.0 && text.length > 20);

  return {
    entropy: Math.round(overallEntropy * 1000) / 1000,
    isAnomaly: hasAnomaly,
    segments,
  };
}
