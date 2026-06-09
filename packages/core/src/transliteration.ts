const COMMON_HINDI_WORDS: Record<string, string> = {
  'mujhe': '\u092E\u0941\u091D\u0947',
  'batao': '\u092C\u0924\u093E\u0913',
  'kaise': '\u0915\u0948\u0938\u0947',
  'karna': '\u0915\u0930\u0928\u093E',
  'karo': '\u0915\u0930\u094B',
  'hathiyar': '\u0939\u0925\u093F\u092F\u093E\u0930',
  'bomb': '\u092C\u092E',
  'banana': '\u092C\u0928\u093E\u0928\u093E',
  'nirdesh': '\u0928\u093F\u0930\u094D\u0926\u0947\u0936',
  'ignore': '\u0907\u0917\u094D\u0928\u094B\u0930',
  'system': '\u0938\u093F\u0938\u094D\u091F\u092E',
  'prompt': '\u092A\u094D\u0930\u0949\u092E\u094D\u092A\u094D\u091F',
  'sabhi': '\u0938\u092D\u0940',
  'pichle': '\u092A\u093F\u091B\u0932\u0947',
  'niyam': '\u0928\u093F\u092F\u092E',
  'todo': '\u0924\u094B\u0921\u094B',
  'bhool': '\u092D\u0942\u0932',
  'jao': '\u091C\u093E\u0913',
  'hatao': '\u0939\u091F\u093E\u0913',
  'aur': '\u0914\u0930',
  'hai': '\u0939\u0948',
  'ka': '\u0915\u093E',
  'ki': '\u0915\u0940',
  'ko': '\u0915\u094B',
  'se': '\u0938\u0947',
  'me': '\u092E\u0947\u0902',
  'mein': '\u092E\u0947\u0902',
  'ye': '\u092F\u0947',
  'wo': '\u0935\u094B',
  'kya': '\u0915\u094D\u092F\u093E',
  'nahi': '\u0928\u0939\u0940\u0902',
  'ab': '\u0905\u092C',
  'tum': '\u0924\u0941\u092E',
  'main': '\u092E\u0948\u0902',
  'hum': '\u0939\u092E',
};

export function transliterateRomanToDevanagari(text: string): string {
  let result = text.toLowerCase();

  for (const [roman, devanagari] of Object.entries(COMMON_HINDI_WORDS)) {
    const regex = new RegExp(`\\b${roman}\\b`, 'gi');
    result = result.replace(regex, devanagari);
  }

  return result;
}

export function detectHindiContent(text: string): boolean {
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) return true;

  const hindiWords = Object.keys(COMMON_HINDI_WORDS);
  const words = text.toLowerCase().split(/\s+/);
  let hindiWordCount = 0;
  for (const word of words) {
    if (hindiWords.includes(word)) hindiWordCount++;
  }
  return hindiWordCount >= 2;
}

export function detectTamilContent(text: string): boolean {
  const tamilRegex = /[\u0B80-\u0BFF]/;
  return tamilRegex.test(text);
}

export function detectLanguage(text: string): string {
  if (detectTamilContent(text)) return 'ta';
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  if (hasDevanagari && hasLatin) return 'hi-en';
  if (hasDevanagari) return 'hi';
  if (detectHindiContent(text)) return 'hi-en';
  return 'en';
}
