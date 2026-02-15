import { describe, it, expect } from 'vitest';
import { calculateAge, dateDifference } from './date';

describe('calculateAge', () => {
  it('calculates age correctly', () => {
    const result = calculateAge('1990-06-15', '2026-02-15');
    expect(result.years).toBe(35);
    expect(result.months).toBe(8);
    expect(result.days).toBe(0);
  });

  it('handles birthday not yet reached this year', () => {
    const result = calculateAge('1990-12-25', '2026-02-15');
    expect(result.years).toBe(35);
    expect(result.months).toBe(1);
  });

  it('calculates total days', () => {
    const result = calculateAge('2025-01-01', '2025-01-31');
    expect(result.totalDays).toBe(30);
  });

  it('returns zeros for invalid date', () => {
    const result = calculateAge('invalid', '2026-01-01');
    expect(result.years).toBe(0);
  });
});

describe('dateDifference', () => {
  it('calculates difference between two dates', () => {
    const result = dateDifference('2025-01-01', '2026-02-15');
    expect(result.years).toBe(1);
    expect(result.months).toBe(1);
    expect(result.days).toBe(14);
  });

  it('calculates weeks', () => {
    const result = dateDifference('2026-01-01', '2026-02-12');
    expect(result.weeks).toBe(6);
    expect(result.totalDays).toBe(42);
  });

  it('returns zeros for invalid dates', () => {
    const result = dateDifference('bad', 'dates');
    expect(result.totalDays).toBe(0);
  });
});
