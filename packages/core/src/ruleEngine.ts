import type { RuleFile, RuleMatch } from './types.js';

import directInjection from './rules/direct-injection.json';
import roleplayExploit from './rules/roleplay-exploit.json';
import encodingEvasion from './rules/encoding-evasion.json';
import harmfulContent from './rules/harmful-content.json';
import hindiInjection from './rules/hindi-injection.json';
import hinglishInjection from './rules/hinglish-injection.json';
import tamilInjection from './rules/tamil-injection.json';

const ALL_RULES: RuleFile[] = [
  directInjection as RuleFile,
  roleplayExploit as RuleFile,
  encodingEvasion as RuleFile,
  harmfulContent as RuleFile,
  hindiInjection as RuleFile,
  hinglishInjection as RuleFile,
  tamilInjection as RuleFile,
];

export function matchRules(normalizedText: string, additionalTexts: string[]): RuleMatch[] {
  const matches: RuleMatch[] = [];
  const textsToScan = [normalizedText, ...additionalTexts];

  for (const ruleFile of ALL_RULES) {
    for (const pattern of ruleFile.patterns) {
      for (const text of textsToScan) {
        try {
          const regex = new RegExp(pattern.pattern, pattern.flags ?? 'i');
          const match = regex.exec(text);
          if (match) {
            matches.push({
              ruleId: pattern.id,
              category: ruleFile.category,
              severity: pattern.severity,
              matchedText: match[0].slice(0, 100),
              description: pattern.description,
            });
            break;
          }
        } catch {
          continue;
        }
      }
    }
  }

  return matches;
}

export function getMaxRuleSeverity(matches: RuleMatch[]): number {
  if (matches.length === 0) return 0;
  return Math.max(...matches.map(m => m.severity));
}

export function getRuleScore(matches: RuleMatch[]): number {
  if (matches.length === 0) return 0;
  const maxSeverity = getMaxRuleSeverity(matches);
  const countFactor = Math.min(matches.length / 5, 1);
  return Math.min(maxSeverity * 0.7 + countFactor * 0.3, 1.0);
}
