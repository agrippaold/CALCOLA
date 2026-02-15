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
