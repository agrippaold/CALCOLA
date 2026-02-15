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
