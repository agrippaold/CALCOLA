import { describe, it, expect } from 'vitest';
import {
  percentage,
  percentChange,
  percentOf,
  percentIncrease,
  percentDecrease,
  areaRectangle,
  areaCircle,
  areaTriangle,
  areaTrapezoid,
  areaEllipse,
  gcd,
  lcm,
  fractionSimplify,
  fractionAdd,
  fractionSubtract,
  fractionMultiply,
  fractionDivide,
  fractionToDecimal,
  decimalToFraction,
  factorial,
  logBase,
  combination,
  permutation,
} from './math';

describe('percentage', () => {
  it('calculates basic percentage', () => {
    expect(percentage(20, 150)).toBe(30);  // 20% of 150 = 30
  });

  it('handles 100%', () => {
    expect(percentage(100, 250)).toBe(250);
  });

  it('handles 0%', () => {
    expect(percentage(0, 500)).toBe(0);
  });
});

describe('percentChange', () => {
  it('calculates increase', () => {
    expect(percentChange(100, 150)).toBe(50);
  });

  it('calculates decrease', () => {
    expect(percentChange(200, 150)).toBe(-25);
  });

  it('handles zero old value', () => {
    expect(percentChange(0, 100)).toBe(0);
  });

  it('handles negative values', () => {
    // -100 to -50 = 50% increase (uses absolute value of old)
    expect(percentChange(-100, -50)).toBe(50);
  });
});

describe('percentOf', () => {
  it('calculates what percent X is of Y', () => {
    expect(percentOf(25, 200)).toBe(12.5);
  });

  it('handles 0 denominator', () => {
    expect(percentOf(10, 0)).toBe(0);
  });
});

describe('percentIncrease', () => {
  it('increases by percentage', () => {
    expect(percentIncrease(100, 15)).toBeCloseTo(115, 5);
  });
});

describe('percentDecrease', () => {
  it('decreases by percentage', () => {
    expect(percentDecrease(200, 25)).toBe(150);
  });
});

describe('areaRectangle', () => {
  it('calculates correctly', () => {
    expect(areaRectangle(5, 3)).toBe(15);
  });

  it('returns 0 for invalid inputs', () => {
    expect(areaRectangle(0, 5)).toBe(0);
    expect(areaRectangle(-1, 5)).toBe(0);
  });
});

describe('areaCircle', () => {
  it('calculates correctly', () => {
    expect(areaCircle(5)).toBeCloseTo(78.54, 1);
  });

  it('unit radius', () => {
    expect(areaCircle(1)).toBeCloseTo(Math.PI, 5);
  });

  it('returns 0 for invalid radius', () => {
    expect(areaCircle(0)).toBe(0);
    expect(areaCircle(-3)).toBe(0);
  });
});

describe('areaTriangle', () => {
  it('calculates correctly', () => {
    expect(areaTriangle(10, 6)).toBe(30);
  });

  it('returns 0 for invalid inputs', () => {
    expect(areaTriangle(0, 5)).toBe(0);
  });
});

describe('areaTrapezoid', () => {
  it('calculates correctly', () => {
    // 0.5 * (3 + 7) * 4 = 20
    expect(areaTrapezoid(3, 7, 4)).toBe(20);
  });

  it('returns 0 for invalid inputs', () => {
    expect(areaTrapezoid(0, 5, 3)).toBe(0);
  });
});

describe('areaEllipse', () => {
  it('calculates correctly', () => {
    // pi * 4 * 3 = ~37.70
    expect(areaEllipse(4, 3)).toBeCloseTo(37.70, 1);
  });

  it('circle when semi-axes are equal', () => {
    expect(areaEllipse(5, 5)).toBeCloseTo(areaCircle(5), 5);
  });

  it('returns 0 for invalid inputs', () => {
    expect(areaEllipse(0, 5)).toBe(0);
  });
});

// ── Fraction tests ──

describe('gcd', () => {
  it('calculates GCD of 12 and 8', () => {
    expect(gcd(12, 8)).toBe(4);
  });

  it('calculates GCD of coprime numbers', () => {
    expect(gcd(7, 13)).toBe(1);
  });

  it('handles zero', () => {
    expect(gcd(0, 5)).toBe(5);
  });
});

describe('lcm', () => {
  it('calculates LCM of 4 and 6', () => {
    expect(lcm(4, 6)).toBe(12);
  });

  it('handles zero', () => {
    expect(lcm(0, 5)).toBe(0);
  });
});

describe('fractionSimplify', () => {
  it('simplifies 4/8 to 1/2', () => {
    const r = fractionSimplify(4, 8);
    expect(r.numerator).toBe(1);
    expect(r.denominator).toBe(2);
  });

  it('handles zero denominator', () => {
    const r = fractionSimplify(3, 0);
    expect(r.denominator).toBe(0);
  });
});

describe('fractionAdd', () => {
  it('adds 1/4 + 1/4 = 1/2', () => {
    const r = fractionAdd(1, 4, 1, 4);
    expect(r.numerator).toBe(1);
    expect(r.denominator).toBe(2);
  });

  it('adds 1/3 + 1/6 = 1/2', () => {
    const r = fractionAdd(1, 3, 1, 6);
    expect(r.numerator).toBe(1);
    expect(r.denominator).toBe(2);
  });
});

describe('fractionSubtract', () => {
  it('subtracts 3/4 - 1/4 = 1/2', () => {
    const r = fractionSubtract(3, 4, 1, 4);
    expect(r.numerator).toBe(1);
    expect(r.denominator).toBe(2);
  });
});

describe('fractionMultiply', () => {
  it('multiplies 2/3 * 3/4 = 1/2', () => {
    const r = fractionMultiply(2, 3, 3, 4);
    expect(r.numerator).toBe(1);
    expect(r.denominator).toBe(2);
  });
});

describe('fractionDivide', () => {
  it('divides 1/2 / 1/4 = 2/1', () => {
    const r = fractionDivide(1, 2, 1, 4);
    expect(r.numerator).toBe(2);
    expect(r.denominator).toBe(1);
  });
});

describe('fractionToDecimal', () => {
  it('converts 1/4 to 0.25', () => {
    expect(fractionToDecimal(1, 4)).toBe(0.25);
  });
});

describe('decimalToFraction', () => {
  it('converts 0.75 to 3/4', () => {
    const r = decimalToFraction(0.75);
    expect(r.numerator).toBe(3);
    expect(r.denominator).toBe(4);
  });

  it('converts 0.333... approximately to 1/3', () => {
    const r = decimalToFraction(1 / 3);
    expect(r.numerator).toBe(1);
    expect(r.denominator).toBe(3);
  });
});

// ── Scientific calculator tests ──

describe('factorial', () => {
  it('computes 5! = 120', () => {
    expect(factorial(5)).toBe(120);
  });

  it('computes 0! = 1', () => {
    expect(factorial(0)).toBe(1);
  });

  it('returns 0 for negative', () => {
    expect(factorial(-3)).toBe(0);
  });
});

describe('logBase', () => {
  it('log base 10 of 100 = 2', () => {
    expect(logBase(100, 10)).toBeCloseTo(2, 5);
  });

  it('log base 2 of 8 = 3', () => {
    expect(logBase(8, 2)).toBeCloseTo(3, 5);
  });

  it('returns NaN for invalid input', () => {
    expect(logBase(-1, 10)).toBeNaN();
  });
});

describe('combination', () => {
  it('C(5,2) = 10', () => {
    expect(combination(5, 2)).toBe(10);
  });

  it('C(10,3) = 120', () => {
    expect(combination(10, 3)).toBe(120);
  });
});

describe('permutation', () => {
  it('P(5,2) = 20', () => {
    expect(permutation(5, 2)).toBe(20);
  });

  it('P(10,3) = 720', () => {
    expect(permutation(10, 3)).toBe(720);
  });
});
