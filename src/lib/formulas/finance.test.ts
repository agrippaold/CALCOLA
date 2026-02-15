import { describe, it, expect } from 'vitest';
import {
  mortgagePayment,
  compoundInterest,
  loanPayment,
  simpleInterest,
  roi,
  savingsGrowth,
  amortizationSchedule,
} from './finance';

describe('mortgagePayment', () => {
  it('calculates standard 30-year mortgage correctly', () => {
    // $200,000 at 6% for 30 years → ~$1,199.10/month
    const result = mortgagePayment(200_000, 6, 30);
    expect(result).toBeCloseTo(1199.10, 0);
  });

  it('calculates 15-year mortgage correctly', () => {
    // $200,000 at 6% for 15 years → ~$1,687.71/month
    const result = mortgagePayment(200_000, 6, 15);
    expect(result).toBeCloseTo(1687.71, 0);
  });

  it('handles 0% interest rate', () => {
    const result = mortgagePayment(120_000, 0, 10);
    expect(result).toBe(1000); // 120000 / 120 months
  });

  it('returns 0 for invalid inputs', () => {
    expect(mortgagePayment(0, 5, 30)).toBe(0);
    expect(mortgagePayment(100_000, 5, 0)).toBe(0);
    expect(mortgagePayment(-1, 5, 30)).toBe(0);
  });
});

describe('compoundInterest', () => {
  it('calculates monthly compounding correctly', () => {
    // $10,000 at 5% for 10 years, monthly → ~$16,470.09
    const result = compoundInterest(10_000, 5, 10, 12);
    expect(result).toBeCloseTo(16470.09, 0);
  });

  it('calculates annual compounding correctly', () => {
    // $1,000 at 10% for 5 years, annual → $1,610.51
    const result = compoundInterest(1000, 10, 5, 1);
    expect(result).toBeCloseTo(1610.51, 2);
  });

  it('calculates quarterly compounding correctly', () => {
    // $5,000 at 8% for 3 years, quarterly → ~$6,341.21
    const result = compoundInterest(5000, 8, 3, 4);
    expect(result).toBeCloseTo(6341.21, 0);
  });

  it('returns principal for 0 years', () => {
    expect(compoundInterest(1000, 5, 0)).toBe(1000);
  });
});

describe('simpleInterest', () => {
  it('calculates correctly', () => {
    // $5,000 at 4% for 3 years → $600
    expect(simpleInterest(5000, 4, 3)).toBe(600);
  });

  it('handles 0 rate', () => {
    expect(simpleInterest(1000, 0, 5)).toBe(0);
  });

  it('handles 0 principal', () => {
    expect(simpleInterest(0, 5, 10)).toBe(0);
  });
});

describe('roi', () => {
  it('calculates positive ROI', () => {
    // Bought for $1000, sold for $1500 → 50% ROI
    expect(roi(1500, 1000)).toBe(50);
  });

  it('calculates negative ROI', () => {
    // Bought for $1000, sold for $800 → -20%
    expect(roi(800, 1000)).toBe(-20);
  });

  it('handles zero cost', () => {
    expect(roi(100, 0)).toBe(0);
  });
});

describe('savingsGrowth', () => {
  it('calculates with initial deposit + monthly contributions', () => {
    // $5,000 initial + $200/month at 7% for 20 years → ~$124,379
    const result = savingsGrowth(5000, 200, 7, 20);
    expect(result).toBeCloseTo(124379, -2);
  });

  it('handles 0% interest (just sums contributions)', () => {
    // $1,000 + $100/month for 10 years at 0% → $13,000
    const result = savingsGrowth(1000, 100, 0, 10);
    expect(result).toBe(13000);
  });

  it('handles 0 monthly contribution', () => {
    // Same as compound interest
    const result = savingsGrowth(10_000, 0, 5, 10);
    const ci = compoundInterest(10_000, 5, 10, 12);
    expect(result).toBeCloseTo(ci, 2);
  });
});

describe('amortizationSchedule', () => {
  it('generates correct number of rows', () => {
    const schedule = amortizationSchedule(100_000, 5, 30);
    expect(schedule).toHaveLength(360);
  });

  it('first payment has more interest than principal', () => {
    const schedule = amortizationSchedule(200_000, 6, 30);
    const first = schedule[0];
    expect(first.interest).toBeGreaterThan(first.principal);
    expect(first.interest).toBeCloseTo(1000, 0); // 200k * 6%/12
  });

  it('balance reaches approximately zero', () => {
    const schedule = amortizationSchedule(100_000, 5, 15);
    const last = schedule[schedule.length - 1];
    expect(last.balance).toBeCloseTo(0, 0);
  });

  it('loanPayment is alias for mortgagePayment', () => {
    expect(loanPayment(100_000, 5, 30)).toBe(mortgagePayment(100_000, 5, 30));
  });
});
