/**
 * Unit conversion formulas — pure functions, no UI dependencies.
 */

// ── Temperature ──

export function celsiusToFahrenheit(c: number): number {
  return c * 9 / 5 + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return (f - 32) * 5 / 9;
}

export function celsiusToKelvin(c: number): number {
  return c + 273.15;
}

export function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

export function fahrenheitToKelvin(f: number): number {
  return celsiusToKelvin(fahrenheitToCelsius(f));
}

export function kelvinToFahrenheit(k: number): number {
  return celsiusToFahrenheit(kelvinToCelsius(k));
}

// ── Length ──

const METERS_PER: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

/**
 * Convert between any two length units via meters as intermediate.
 */
export function lengthConvert(
  value: number,
  from: string,
  to: string,
): number {
  const fromFactor = METERS_PER[from];
  const toFactor = METERS_PER[to];
  if (!fromFactor || !toFactor) return 0;
  return (value * fromFactor) / toFactor;
}

// ── Weight / Mass ──

const GRAMS_PER: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
  st: 6350.29,   // stone
  t: 1_000_000,  // metric ton
};

/**
 * Convert between any two weight units via grams as intermediate.
 */
export function weightConvert(
  value: number,
  from: string,
  to: string,
): number {
  const fromFactor = GRAMS_PER[from];
  const toFactor = GRAMS_PER[to];
  if (!fromFactor || !toFactor) return 0;
  return (value * fromFactor) / toFactor;
}

// ── Volume ──

const LITERS_PER: Record<string, number> = {
  ml: 0.001,
  l: 1,
  gal: 3.78541,       // US gallon
  qt: 0.946353,        // US quart
  pt: 0.473176,        // US pint
  cup: 0.236588,       // US cup
  fl_oz: 0.0295735,    // US fluid ounce
  tbsp: 0.0147868,     // tablespoon
  tsp: 0.00492892,     // teaspoon
  m3: 1000,            // cubic meter
};

/**
 * Convert between any two volume units via liters as intermediate.
 */
export function volumeConvert(
  value: number,
  from: string,
  to: string,
): number {
  const fromFactor = LITERS_PER[from];
  const toFactor = LITERS_PER[to];
  if (!fromFactor || !toFactor) return 0;
  return (value * fromFactor) / toFactor;
}
