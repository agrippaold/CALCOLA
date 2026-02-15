import { describe, it, expect } from 'vitest';
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  celsiusToKelvin,
  kelvinToCelsius,
  fahrenheitToKelvin,
  kelvinToFahrenheit,
  lengthConvert,
  weightConvert,
  volumeConvert,
} from './conversions';

describe('temperature conversions', () => {
  describe('celsiusToFahrenheit', () => {
    it('converts freezing point', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('converts boiling point', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });

    it('converts body temperature', () => {
      expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6, 1);
    });
  });

  describe('fahrenheitToCelsius', () => {
    it('converts freezing point', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('converts boiling point', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });

    it('converts -40 (same in both scales)', () => {
      expect(fahrenheitToCelsius(-40)).toBeCloseTo(-40, 5);
    });
  });

  describe('celsiusToKelvin', () => {
    it('converts absolute zero', () => {
      expect(celsiusToKelvin(-273.15)).toBeCloseTo(0, 5);
    });

    it('converts 0 C', () => {
      expect(celsiusToKelvin(0)).toBe(273.15);
    });

    it('converts 100 C', () => {
      expect(celsiusToKelvin(100)).toBe(373.15);
    });
  });

  describe('round-trip conversions', () => {
    it('F → C → F round-trip', () => {
      expect(celsiusToFahrenheit(fahrenheitToCelsius(72))).toBeCloseTo(72, 5);
    });

    it('F → K → F round-trip', () => {
      expect(kelvinToFahrenheit(fahrenheitToKelvin(98.6))).toBeCloseTo(98.6, 5);
    });

    it('C → K → C round-trip', () => {
      expect(kelvinToCelsius(celsiusToKelvin(25))).toBeCloseTo(25, 5);
    });
  });
});

describe('lengthConvert', () => {
  it('converts inches to cm', () => {
    expect(lengthConvert(1, 'in', 'cm')).toBeCloseTo(2.54, 2);
  });

  it('converts feet to meters', () => {
    expect(lengthConvert(1, 'ft', 'm')).toBeCloseTo(0.3048, 4);
  });

  it('converts miles to km', () => {
    expect(lengthConvert(1, 'mi', 'km')).toBeCloseTo(1.609, 2);
  });

  it('converts km to miles', () => {
    expect(lengthConvert(1, 'km', 'mi')).toBeCloseTo(0.6214, 3);
  });

  it('same unit returns same value', () => {
    expect(lengthConvert(42, 'm', 'm')).toBeCloseTo(42, 5);
  });

  it('returns 0 for unknown units', () => {
    expect(lengthConvert(10, 'parsec', 'km')).toBe(0);
  });
});

describe('weightConvert', () => {
  it('converts kg to lbs', () => {
    expect(weightConvert(1, 'kg', 'lb')).toBeCloseTo(2.2046, 2);
  });

  it('converts lbs to kg', () => {
    expect(weightConvert(1, 'lb', 'kg')).toBeCloseTo(0.4536, 3);
  });

  it('converts oz to g', () => {
    expect(weightConvert(1, 'oz', 'g')).toBeCloseTo(28.35, 1);
  });

  it('converts stone to kg', () => {
    expect(weightConvert(1, 'st', 'kg')).toBeCloseTo(6.350, 1);
  });

  it('returns 0 for unknown units', () => {
    expect(weightConvert(10, 'slug', 'kg')).toBe(0);
  });
});

describe('volumeConvert', () => {
  it('converts gallons to liters', () => {
    expect(volumeConvert(1, 'gal', 'l')).toBeCloseTo(3.785, 2);
  });

  it('converts cups to ml', () => {
    expect(volumeConvert(1, 'cup', 'ml')).toBeCloseTo(236.59, 0);
  });

  it('converts liters to fluid ounces', () => {
    expect(volumeConvert(1, 'l', 'fl_oz')).toBeCloseTo(33.814, 1);
  });

  it('same unit returns same value', () => {
    expect(volumeConvert(500, 'ml', 'ml')).toBeCloseTo(500, 5);
  });
});
