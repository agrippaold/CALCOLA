/**
 * Math formulas — pure functions, no UI dependencies.
 */

/**
 * Basic percentage: what is P% of X?
 * Formula: result = (percent / 100) * value
 */
export function percentage(percent: number, value: number): number {
  return (percent / 100) * value;
}

/**
 * Percent change between two values.
 * Formula: ((newVal - oldVal) / |oldVal|) * 100
 */
export function percentChange(oldVal: number, newVal: number): number {
  if (oldVal === 0) return 0;
  return ((newVal - oldVal) / Math.abs(oldVal)) * 100;
}

/**
 * X is what percent of Y?
 * Formula: (x / y) * 100
 */
export function percentOf(x: number, y: number): number {
  if (y === 0) return 0;
  return (x / y) * 100;
}

/**
 * Increase a value by a percentage.
 * Formula: value * (1 + percent/100)
 */
export function percentIncrease(value: number, percent: number): number {
  return value * (1 + percent / 100);
}

/**
 * Decrease a value by a percentage.
 * Formula: value * (1 - percent/100)
 */
export function percentDecrease(value: number, percent: number): number {
  return value * (1 - percent / 100);
}

// ── Area calculations ──

export type AreaShape =
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'trapezoid'
  | 'ellipse';

/**
 * Area of a rectangle.
 * Formula: A = length * width
 */
export function areaRectangle(length: number, width: number): number {
  if (length <= 0 || width <= 0) return 0;
  return length * width;
}

/**
 * Area of a circle.
 * Formula: A = pi * r^2
 */
export function areaCircle(radius: number): number {
  if (radius <= 0) return 0;
  return Math.PI * radius * radius;
}

/**
 * Area of a triangle.
 * Formula: A = 0.5 * base * height
 */
export function areaTriangle(base: number, height: number): number {
  if (base <= 0 || height <= 0) return 0;
  return 0.5 * base * height;
}

/**
 * Area of a trapezoid.
 * Formula: A = 0.5 * (a + b) * h
 */
export function areaTrapezoid(a: number, b: number, height: number): number {
  if (a <= 0 || b <= 0 || height <= 0) return 0;
  return 0.5 * (a + b) * height;
}

/**
 * Area of an ellipse.
 * Formula: A = pi * a * b
 */
export function areaEllipse(semiMajor: number, semiMinor: number): number {
  if (semiMajor <= 0 || semiMinor <= 0) return 0;
  return Math.PI * semiMajor * semiMinor;
}

// ── Fraction calculations ──

/** Greatest common divisor (Euclidean algorithm). */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Least common multiple. */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(Math.round(a) * Math.round(b)) / gcd(a, b);
}

/** Simplify a fraction to lowest terms. */
export function fractionSimplify(
  num: number,
  den: number,
): { numerator: number; denominator: number } {
  if (den === 0) return { numerator: 0, denominator: 0 };
  const sign = den < 0 ? -1 : 1;
  const d = gcd(Math.abs(num), Math.abs(den));
  return {
    numerator: (sign * num) / d,
    denominator: (sign * den) / d,
  };
}

/** Add two fractions: a/b + c/d. */
export function fractionAdd(
  n1: number, d1: number,
  n2: number, d2: number,
): { numerator: number; denominator: number } {
  const num = n1 * d2 + n2 * d1;
  const den = d1 * d2;
  return fractionSimplify(num, den);
}

/** Subtract two fractions: a/b - c/d. */
export function fractionSubtract(
  n1: number, d1: number,
  n2: number, d2: number,
): { numerator: number; denominator: number } {
  return fractionAdd(n1, d1, -n2, d2);
}

/** Multiply two fractions: (a/b) * (c/d). */
export function fractionMultiply(
  n1: number, d1: number,
  n2: number, d2: number,
): { numerator: number; denominator: number } {
  return fractionSimplify(n1 * n2, d1 * d2);
}

/** Divide two fractions: (a/b) / (c/d). */
export function fractionDivide(
  n1: number, d1: number,
  n2: number, d2: number,
): { numerator: number; denominator: number } {
  return fractionSimplify(n1 * d2, d1 * n2);
}

/** Convert fraction to decimal. */
export function fractionToDecimal(num: number, den: number): number {
  if (den === 0) return 0;
  return num / den;
}

/** Convert decimal to fraction (approximation). */
export function decimalToFraction(
  decimal: number,
  maxDen: number = 1000,
): { numerator: number; denominator: number } {
  if (Number.isInteger(decimal)) return { numerator: decimal, denominator: 1 };
  let bestNum = 0;
  let bestDen = 1;
  let bestErr = Math.abs(decimal);
  for (let d = 1; d <= maxDen; d++) {
    const n = Math.round(decimal * d);
    const err = Math.abs(decimal - n / d);
    if (err < bestErr) {
      bestNum = n;
      bestDen = d;
      bestErr = err;
      if (err === 0) break;
    }
  }
  return fractionSimplify(bestNum, bestDen);
}

// ── Scientific calculator helpers ──

/** Factorial (n!). Returns 0 for negative inputs. */
export function factorial(n: number): number {
  n = Math.round(n);
  if (n < 0) return 0;
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/** Logarithm base N. */
export function logBase(value: number, base: number): number {
  if (value <= 0 || base <= 0 || base === 1) return NaN;
  return Math.log(value) / Math.log(base);
}

/** Combination C(n, r) = n! / (r!(n-r)!). */
export function combination(n: number, r: number): number {
  n = Math.round(n);
  r = Math.round(r);
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

/** Permutation P(n, r) = n! / (n-r)!. */
export function permutation(n: number, r: number): number {
  n = Math.round(n);
  r = Math.round(r);
  if (r < 0 || r > n) return 0;
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= (n - i);
  }
  return result;
}
