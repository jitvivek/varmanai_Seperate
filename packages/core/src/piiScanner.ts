import type { PiiMatch } from './types.js';

// Verhoeff checksum tables for Aadhaar validation
const VERHOEFF_D: number[][] = [
  [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],
  [2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],
  [4,0,1,2,3,9,5,6,7,8],[5,9,8,7,6,0,4,3,2,1],
  [6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],
  [8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0],
];

const VERHOEFF_P: number[][] = [
  [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],
  [5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],
  [2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8],
];

function verhoeffValidate(num: string): boolean {
  let c = 0;
  const digits = num.split('').reverse().map(Number);
  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    if (d === undefined) return false;
    const p = VERHOEFF_P[i % 8];
    if (!p) return false;
    const pVal = p[d];
    if (pVal === undefined) return false;
    const dRow = VERHOEFF_D[c];
    if (!dRow) return false;
    const dVal = dRow[pVal];
    if (dVal === undefined) return false;
    c = dVal;
  }
  return c === 0;
}

function luhnValidate(num: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num.charAt(i), 10);
    if (isNaN(n)) return false;
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function maskValue(value: string, showFirst: number, showLast: number): string {
  if (value.length <= showFirst + showLast) return '****';
  const masked = value.slice(0, showFirst) + '****' + value.slice(-showLast);
  return masked;
}

const PII_PATTERNS: Array<{
  type: string;
  regex: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  validate?: (match: string) => boolean;
  mask: (match: string) => string;
}> = [
  {
    type: 'aadhaar',
    regex: /\b(\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/g,
    severity: 'critical',
    validate: (match: string) => {
      const digits = match.replace(/[\s-]/g, '');
      if (digits.length !== 12) return false;
      if (/^0/.test(digits) || /^1/.test(digits)) return false;
      return verhoeffValidate(digits);
    },
    mask: (m: string) => maskValue(m.replace(/[\s-]/g, ''), 4, 4),
  },
  {
    type: 'pan',
    regex: /\b([A-Z]{5}\d{4}[A-Z])\b/g,
    severity: 'critical',
    validate: (match: string) => {
      const fourthChar = match.charAt(3);
      return ['P', 'C', 'H', 'A', 'B', 'G', 'J', 'L', 'F', 'T'].includes(fourthChar);
    },
    mask: (m: string) => maskValue(m, 3, 1),
  },
  {
    type: 'upi_id',
    regex: /\b([a-zA-Z0-9._-]+@[a-zA-Z]{2,})\b/g,
    severity: 'high',
    validate: (match: string) => {
      const validSuffixes = ['upi', 'paytm', 'oksbi', 'okicici', 'okaxis', 'ybl', 'ibl', 'apl', 'axl', 'okhdfcbank', 'fbl'];
      const parts = match.split('@');
      if (parts.length !== 2) return false;
      const suffix = parts[1]?.toLowerCase();
      return validSuffixes.some(s => suffix === s);
    },
    mask: (m: string) => maskValue(m, 3, 4),
  },
  {
    type: 'ifsc',
    regex: /\b([A-Z]{4}0[A-Z0-9]{6})\b/g,
    severity: 'medium',
    mask: (m: string) => maskValue(m, 4, 3),
  },
  {
    type: 'indian_phone',
    regex: /\b(\+91[\s-]?)?([6-9]\d{9})\b/g,
    severity: 'high',
    validate: (match: string) => {
      const digits = match.replace(/[\s\-+]/g, '');
      const phone = digits.startsWith('91') ? digits.slice(2) : digits;
      return phone.length === 10 && /^[6-9]/.test(phone);
    },
    mask: (m: string) => {
      const digits = m.replace(/[\s\-+]/g, '');
      return maskValue(digits, 2, 2);
    },
  },
  {
    type: 'credit_card',
    regex: /\b(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})\b/g,
    severity: 'critical',
    validate: (match: string) => {
      const digits = match.replace(/[\s-]/g, '');
      if (digits.length !== 16) return false;
      return luhnValidate(digits);
    },
    mask: (m: string) => maskValue(m.replace(/[\s-]/g, ''), 4, 4),
  },
  {
    type: 'email',
    regex: /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
    severity: 'medium',
    validate: (match: string) => {
      const upiSuffixes = ['upi', 'paytm', 'oksbi', 'okicici', 'okaxis', 'ybl', 'ibl', 'apl', 'axl', 'okhdfcbank', 'fbl'];
      const domain = match.split('@')[1]?.toLowerCase() ?? '';
      return !upiSuffixes.some(s => domain === s) && domain.includes('.');
    },
    mask: (m: string) => {
      const parts = m.split('@');
      const local = parts[0] ?? '';
      const domain = parts[1] ?? '';
      return maskValue(local, 2, 0) + '@' + domain;
    },
  },
];

export function scanPii(text: string): PiiMatch[] {
  const matches: PiiMatch[] = [];
  const seen = new Set<string>();

  for (const pattern of PII_PATTERNS) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const fullMatch = match[0];
      const key = `${pattern.type}:${fullMatch}`;
      if (seen.has(key)) continue;

      if (pattern.validate && !pattern.validate(fullMatch)) continue;

      seen.add(key);
      matches.push({
        type: pattern.type,
        maskedValue: pattern.mask(fullMatch),
        severity: pattern.severity,
      });
    }
  }

  return matches;
}
