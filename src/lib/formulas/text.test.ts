import { describe, it, expect } from 'vitest';
import {
  wordCount,
  charCount,
  readingTime,
  generatePassword,
  passwordStrength,
  calculateGPA,
} from './text';

describe('wordCount', () => {
  it('counts words correctly', () => {
    expect(wordCount('Hello world')).toBe(2);
  });

  it('handles multiple spaces', () => {
    expect(wordCount('one   two   three')).toBe(3);
  });

  it('returns 0 for empty string', () => {
    expect(wordCount('')).toBe(0);
  });

  it('returns 0 for whitespace only', () => {
    expect(wordCount('   ')).toBe(0);
  });
});

describe('charCount', () => {
  it('counts all character types', () => {
    const result = charCount('Hello, World! 123');
    expect(result.total).toBe(17);
    expect(result.letters).toBe(10);
    expect(result.digits).toBe(3);
    expect(result.withoutSpaces).toBe(15);
  });

  it('counts lines', () => {
    const result = charCount('line 1\nline 2\nline 3');
    expect(result.lines).toBe(3);
  });

  it('returns zeros for empty string', () => {
    const result = charCount('');
    expect(result.total).toBe(0);
  });
});

describe('readingTime', () => {
  it('estimates reading time', () => {
    const text = Array(500).fill('word').join(' ');
    expect(readingTime(text)).toBe(2); // 500 words / 250 wpm = 2 min
  });

  it('returns 1 for short text', () => {
    expect(readingTime('Hello world')).toBe(1);
  });
});

describe('generatePassword', () => {
  it('generates password of correct length', () => {
    const pw = generatePassword(20);
    expect(pw.length).toBe(20);
  });

  it('generates different passwords each time', () => {
    const pw1 = generatePassword(32);
    const pw2 = generatePassword(32);
    expect(pw1).not.toBe(pw2);
  });

  it('respects character options', () => {
    const pw = generatePassword(100, { uppercase: false, lowercase: true, digits: false, symbols: false });
    expect(pw).toMatch(/^[a-z]+$/);
  });
});

describe('passwordStrength', () => {
  it('rates empty password as None', () => {
    expect(passwordStrength('').label).toBe('None');
  });

  it('rates short password as weak', () => {
    const result = passwordStrength('abc');
    expect(result.score).toBeLessThan(50);
  });

  it('rates complex password as strong', () => {
    const result = passwordStrength('Tr0ub4dor&3!xY');
    expect(result.score).toBeGreaterThanOrEqual(70);
  });
});

describe('calculateGPA', () => {
  it('calculates 4.0 GPA for all A grades', () => {
    const result = calculateGPA([
      { grade: 'A', credits: 3 },
      { grade: 'A', credits: 4 },
      { grade: 'A', credits: 3 },
    ]);
    expect(result.gpa).toBe(4.0);
    expect(result.totalCredits).toBe(10);
  });

  it('calculates mixed GPA correctly', () => {
    const result = calculateGPA([
      { grade: 'A', credits: 3 },  // 12
      { grade: 'B', credits: 3 },  // 9
      { grade: 'C', credits: 3 },  // 6
    ]);
    // (12 + 9 + 6) / 9 = 3.0
    expect(result.gpa).toBe(3.0);
  });

  it('handles plus/minus grades', () => {
    const result = calculateGPA([
      { grade: 'A-', credits: 3 },  // 11.1
      { grade: 'B+', credits: 3 },  // 9.9
    ]);
    // (11.1 + 9.9) / 6 = 3.5
    expect(result.gpa).toBe(3.5);
  });

  it('returns 0 for empty courses', () => {
    expect(calculateGPA([]).gpa).toBe(0);
  });
});
