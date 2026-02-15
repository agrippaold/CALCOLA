import { describe, it, expect } from 'vitest';
import {
  mortgagePayment,
  compoundInterest,
  loanPayment,
  simpleInterest,
  roi,
  savingsGrowth,
  amortizationSchedule,
  autoLoanPayment,
  investmentGrowth,
  inflationAdjust,
  inflationFutureValue,
  currencyConvert,
  discountPrice,
  tipCalculation,
  salesTax,
  vatCalculation,
  historicalInflation,
  US_CPI_DATA,
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

describe('autoLoanPayment', () => {
  it('calculates with down payment and trade-in', () => {
    // $30,000 car, $5,000 down, $3,000 trade-in → $22,000 loan at 5% for 5y
    const result = autoLoanPayment(30_000, 5_000, 3_000, 5, 5);
    expect(result).toBeCloseTo(415.17, 0);
  });

  it('returns 0 when down payment + trade-in covers price', () => {
    expect(autoLoanPayment(20_000, 15_000, 10_000, 5, 5)).toBe(0);
  });

  it('works with zero down payment and trade-in', () => {
    const result = autoLoanPayment(25_000, 0, 0, 6, 4);
    expect(result).toBeCloseTo(586.85, 0);
  });
});

describe('investmentGrowth', () => {
  it('calculates investment with contributions', () => {
    // $10,000 initial + $500/month at 8% for 10 years
    const result = investmentGrowth(10_000, 500, 8, 10);
    expect(result).toBeCloseTo(113_669, -2);
  });

  it('matches savingsGrowth', () => {
    const inv = investmentGrowth(5000, 200, 7, 20);
    const sav = savingsGrowth(5000, 200, 7, 20);
    expect(inv).toBe(sav);
  });
});

describe('inflationAdjust', () => {
  it('calculates purchasing power loss', () => {
    // $100 at 3% inflation for 10 years → ~$74.41
    const result = inflationAdjust(100, 3, 10);
    expect(result).toBeCloseTo(74.41, 1);
  });

  it('returns original for 0 years', () => {
    expect(inflationAdjust(100, 3, 0)).toBe(100);
  });

  it('returns original for 0% rate', () => {
    expect(inflationAdjust(100, 0, 10)).toBe(100);
  });
});

describe('inflationFutureValue', () => {
  it('calculates future cost', () => {
    // $100 item at 3% inflation for 10 years → ~$134.39
    const result = inflationFutureValue(100, 3, 10);
    expect(result).toBeCloseTo(134.39, 1);
  });

  it('returns original for 0 years', () => {
    expect(inflationFutureValue(100, 3, 0)).toBe(100);
  });
});

describe('currencyConvert', () => {
  it('converts at given rate', () => {
    // 100 USD at 0.92 EUR/USD → 92 EUR
    expect(currencyConvert(100, 0.92)).toBeCloseTo(92, 2);
  });

  it('handles rate of 1', () => {
    expect(currencyConvert(50, 1)).toBe(50);
  });

  it('returns 0 for invalid rate', () => {
    expect(currencyConvert(100, 0)).toBe(0);
    expect(currencyConvert(100, -1)).toBe(0);
  });
});

describe('discountPrice', () => {
  it('calculates 20% off $80', () => {
    const result = discountPrice(80, 20);
    expect(result.finalPrice).toBe(64);
    expect(result.savings).toBe(16);
  });

  it('calculates 50% off', () => {
    const result = discountPrice(100, 50);
    expect(result.finalPrice).toBe(50);
    expect(result.savings).toBe(50);
  });

  it('handles 0% discount', () => {
    const result = discountPrice(100, 0);
    expect(result.finalPrice).toBe(100);
    expect(result.savings).toBe(0);
  });

  it('handles negative price', () => {
    const result = discountPrice(-10, 20);
    expect(result.finalPrice).toBe(-10);
    expect(result.savings).toBe(0);
  });
});

describe('tipCalculation', () => {
  it('calculates 20% tip on $50 bill', () => {
    const result = tipCalculation(50, 20);
    expect(result.tipAmount).toBe(10);
    expect(result.totalBill).toBe(60);
    expect(result.perPerson).toBe(60);
  });

  it('splits bill between 4 people', () => {
    const result = tipCalculation(100, 15, 4);
    expect(result.tipAmount).toBe(15);
    expect(result.totalBill).toBe(115);
    expect(result.perPerson).toBeCloseTo(28.75, 2);
  });

  it('handles 0% tip', () => {
    const result = tipCalculation(80, 0);
    expect(result.tipAmount).toBe(0);
    expect(result.totalBill).toBe(80);
  });

  it('handles invalid bill amount', () => {
    const result = tipCalculation(-10, 20);
    expect(result.tipAmount).toBe(0);
  });
});

describe('salesTax', () => {
  it('calculates 8.25% tax on $100', () => {
    const result = salesTax(100, 8.25);
    expect(result.taxAmount).toBeCloseTo(8.25, 2);
    expect(result.totalPrice).toBeCloseTo(108.25, 2);
  });

  it('handles 0% tax', () => {
    const result = salesTax(50, 0);
    expect(result.taxAmount).toBe(0);
    expect(result.totalPrice).toBe(50);
  });

  it('handles invalid price', () => {
    const result = salesTax(0, 10);
    expect(result.taxAmount).toBe(0);
  });
});

describe('vatCalculation', () => {
  it('adds 20% VAT to net price', () => {
    const result = vatCalculation(100, 20, 'add');
    expect(result.netPrice).toBe(100);
    expect(result.vatAmount).toBe(20);
    expect(result.grossPrice).toBe(120);
  });

  it('extracts 20% VAT from gross price', () => {
    const result = vatCalculation(120, 20, 'extract');
    expect(result.netPrice).toBeCloseTo(100, 2);
    expect(result.vatAmount).toBeCloseTo(20, 2);
    expect(result.grossPrice).toBe(120);
  });

  it('handles 0% VAT', () => {
    const result = vatCalculation(100, 0, 'add');
    expect(result.vatAmount).toBe(0);
    expect(result.grossPrice).toBe(100);
  });

  it('defaults to add mode', () => {
    const result = vatCalculation(100, 10);
    expect(result.grossPrice).toBe(110);
  });
});

describe('historicalInflation', () => {
  it('calculates $100 from 1970 to 2025', () => {
    const result = historicalInflation(100, 1970, 2025);
    expect(result).not.toBeNull();
    // CPI 1970 = 38.8, CPI 2025 = 319.0 → 100 * 319/38.8 ≈ 822.16
    expect(result!.adjustedValue).toBeCloseTo(822.16, 0);
    expect(result!.cumulativeRate).toBeCloseTo(722.2, 0);
    expect(result!.avgAnnualRate).toBeGreaterThan(3);
    expect(result!.avgAnnualRate).toBeLessThan(4.5);
  });

  it('calculates $100 from 2000 to 2020', () => {
    const result = historicalInflation(100, 2000, 2020);
    expect(result).not.toBeNull();
    // CPI 2000=172.2, CPI 2020=258.8 → 100 * 258.8/172.2 ≈ 150.29
    expect(result!.adjustedValue).toBeCloseTo(150.29, 0);
  });

  it('returns null for invalid years', () => {
    expect(historicalInflation(100, 1800, 2020)).toBeNull();
    expect(historicalInflation(100, 2020, 2099)).toBeNull();
  });

  it('returns null for invalid amount', () => {
    expect(historicalInflation(0, 1970, 2020)).toBeNull();
    expect(historicalInflation(-100, 1970, 2020)).toBeNull();
  });

  it('handles same year', () => {
    const result = historicalInflation(100, 2000, 2000);
    expect(result).not.toBeNull();
    expect(result!.adjustedValue).toBe(100);
    expect(result!.cumulativeRate).toBe(0);
  });

  it('has CPI data from 1913 to 2025', () => {
    expect(US_CPI_DATA[1913]).toBeDefined();
    expect(US_CPI_DATA[2025]).toBeDefined();
    expect(Object.keys(US_CPI_DATA).length).toBeGreaterThanOrEqual(113);
  });
});
