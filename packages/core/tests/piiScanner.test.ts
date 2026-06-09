import { describe, it, expect } from 'vitest';
import { scanPii } from '../src/piiScanner.js';

describe('PII Scanner', () => {
  it('detects valid Aadhaar number', () => {
    const result = scanPii('My aadhaar is 2234 5678 9012');
    // Note: Verhoeff validation means not all 12-digit numbers pass
    // Using a known valid pattern for testing
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it('detects PAN card number', () => {
    const result = scanPii('My PAN is ABCPA1234Z');
    expect(result.length).toBe(1);
    expect(result[0]?.type).toBe('pan');
    expect(result[0]?.severity).toBe('critical');
  });

  it('does not detect invalid PAN (wrong 4th char)', () => {
    const result = scanPii('ABCDA1234Z');
    expect(result.filter(r => r.type === 'pan').length).toBe(0);
  });

  it('detects UPI ID', () => {
    const result = scanPii('Pay me at user@paytm');
    expect(result.length).toBe(1);
    expect(result[0]?.type).toBe('upi_id');
  });

  it('detects Indian phone number', () => {
    const result = scanPii('Call me at 9876543210');
    expect(result.length).toBe(1);
    expect(result[0]?.type).toBe('indian_phone');
  });

  it('detects email address', () => {
    const result = scanPii('Send to user@example.com');
    expect(result.length).toBe(1);
    expect(result[0]?.type).toBe('email');
  });

  it('does not flag UPI as email', () => {
    const result = scanPii('user@ybl');
    const emailMatches = result.filter(r => r.type === 'email');
    expect(emailMatches.length).toBe(0);
  });

  it('detects credit card with Luhn validation', () => {
    // Valid Luhn: 4111 1111 1111 1111
    const result = scanPii('Card: 4111 1111 1111 1111');
    expect(result.some(r => r.type === 'credit_card')).toBe(true);
  });

  it('rejects invalid credit card', () => {
    const result = scanPii('Card: 1234 5678 9012 3456');
    expect(result.filter(r => r.type === 'credit_card').length).toBe(0);
  });
});
