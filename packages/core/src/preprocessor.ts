import { replaceHomoglyphs, stripInvisibleChars } from './unicode.js';
import { deLeetspeak } from './leetspeak.js';
import { recursiveDecode } from './encoding.js';
import { transliterateRomanToDevanagari, detectLanguage } from './transliteration.js';
import type { PreprocessResult } from './types.js';

export function preprocess(input: string): PreprocessResult {
  let text = input;

  // Layer 1: Unicode NFKC normalization + homoglyph replacement
  text = text.normalize('NFKC');
  text = replaceHomoglyphs(text);

  // Layer 2: Strip invisible characters
  text = stripInvisibleChars(text);

  // Layer 3: Recursive decode (Base64, hex, ROT13)
  const decodedLayers = recursiveDecode(text);

  // Layer 4: Leetspeak normalization
  const deLeet = deLeetspeak(text);

  // Layer 5: Romanized Hindi transliteration
  const transliterated = transliterateRomanToDevanagari(text);

  // Combine: use the most normalized form
  const normalized = deLeet;
  const detectedLanguage = detectLanguage(input);

  return {
    normalized,
    decodedLayers: [transliterated, ...decodedLayers],
    detectedLanguage,
  };
}
