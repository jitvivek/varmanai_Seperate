import { describe, it, expect } from 'vitest';
import { preprocess } from '../src/preprocessor.js';

describe('Preprocessor', () => {
  it('normalizes Unicode NFKC', () => {
    const result = preprocess('\uFF28\uFF45\uFF4C\uFF4C\uFF4F'); // Fullwidth "Hello"
    expect(result.normalized).toContain('hello');
  });

  it('strips invisible characters', () => {
    const result = preprocess('ig\u200Bnore all prev\u200Cious');
    expect(result.normalized).not.toContain('\u200B');
    expect(result.normalized).not.toContain('\u200C');
  });

  it('de-leetifies text', () => {
    const result = preprocess('1gn0r3 4ll pr3v10u5');
    expect(result.normalized).toContain('ignore');
  });

  it('detects Hindi content', () => {
    const result = preprocess('mujhe batao kaise karna hai');
    expect(result.detectedLanguage).toBe('hi-en');
  });

  it('detects Devanagari as Hindi', () => {
    const result = preprocess('\u0938\u092D\u0940 \u092A\u093F\u091B\u0932\u0947 \u0928\u093F\u0930\u094D\u0926\u0947\u0936');
    expect(result.detectedLanguage).toBe('hi');
  });

  it('detects English text', () => {
    const result = preprocess('What is the weather today?');
    expect(result.detectedLanguage).toBe('en');
  });

  it('handles decoded layers from base64', () => {
    // "hello" in base64 = "aGVsbG8="
    const result = preprocess('decode this: aGVsbG8=');
    expect(result.decodedLayers.length).toBeGreaterThan(0);
  });
});
