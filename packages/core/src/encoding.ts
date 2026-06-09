const MAX_DECODE_DEPTH = 3;

const BASE64_REGEX = /^[A-Za-z0-9+/]{4,}={0,2}$/;
const HEX_REGEX = /^[0-9a-fA-F]{8,}$/;

function isBase64(text: string): boolean {
  if (text.length < 4 || text.length % 4 !== 0) return false;
  return BASE64_REGEX.test(text.trim());
}

function decodeBase64(text: string): string | null {
  try {
    if (typeof atob === 'function') {
      return atob(text.trim());
    }
    return Buffer.from(text.trim(), 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

function isHex(text: string): boolean {
  return HEX_REGEX.test(text.trim()) && text.trim().length % 2 === 0;
}

function decodeHex(text: string): string | null {
  try {
    const hex = text.trim();
    let result = '';
    for (let i = 0; i < hex.length; i += 2) {
      const byte = parseInt(hex.substring(i, i + 2), 16);
      if (isNaN(byte)) return null;
      result += String.fromCharCode(byte);
    }
    if (/[\x00-\x08\x0E-\x1F]/.test(result)) return null;
    return result;
  } catch {
    return null;
  }
}

function rot13(text: string): string {
  return text.replace(/[A-Za-z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function looksLikeText(text: string): boolean {
  const printable = text.replace(/[^\x20-\x7E]/g, '');
  return printable.length / text.length > 0.7;
}

export function recursiveDecode(text: string, depth: number = 0): string[] {
  if (depth >= MAX_DECODE_DEPTH) return [];

  const decoded: string[] = [];
  const tokens = text.split(/\s+/);

  for (const token of tokens) {
    if (token.length < 4) continue;

    if (isBase64(token)) {
      const result = decodeBase64(token);
      if (result && looksLikeText(result) && result !== token) {
        decoded.push(result);
        decoded.push(...recursiveDecode(result, depth + 1));
      }
    }

    if (isHex(token)) {
      const result = decodeHex(token);
      if (result && looksLikeText(result) && result !== token) {
        decoded.push(result);
        decoded.push(...recursiveDecode(result, depth + 1));
      }
    }
  }

  const rotated = rot13(text);
  if (rotated !== text && depth === 0) {
    decoded.push(rotated);
  }

  return decoded;
}
