import { detect, sha256 } from '@varmanai/core';
import type { DetectionResult } from '@varmanai/core';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';

const prisma = new PrismaClient();

export async function runDetection(
  text: string,
  userId: string,
  site?: string
): Promise<DetectionResult> {
  try {
    const result = detect(text);

    // Log scan (hash only, never raw text)
    const textHash = await sha256(text);
    await prisma.scanLog.create({
      data: {
        userId,
        textHash,
        inputLength: text.length,
        site: site ?? null,
        verdict: result.verdict,
        riskScore: result.riskScore,
        category: result.category,
        language: result.language,
        piiCount: result.piiDetected.length,
        matchedRules: result.matchedRules,
        latencyMs: result.processingTimeMs,
      },
    });

    return result;
  } catch (err: unknown) {
    logger.error({ err }, 'Detection service error');
    throw err;
  }
}
