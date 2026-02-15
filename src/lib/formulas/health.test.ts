import { describe, it, expect } from 'vitest';
import { bmi, bmiCategory, bmr, tdee, calorieNeeds, macroSplit } from './health';

describe('bmi', () => {
  it('calculates metric BMI correctly', () => {
    // 70 kg, 170 cm → 24.22
    expect(bmi(70, 170, 'metric')).toBeCloseTo(24.22, 1);
  });

  it('calculates imperial BMI correctly', () => {
    // 154 lbs, 67 in → 24.12
    expect(bmi(154, 67, 'imperial')).toBeCloseTo(24.12, 0);
  });

  it('returns 0 for invalid inputs', () => {
    expect(bmi(0, 170)).toBe(0);
    expect(bmi(70, 0)).toBe(0);
    expect(bmi(-1, 170)).toBe(0);
  });

  it('defaults to metric', () => {
    expect(bmi(70, 170)).toBeCloseTo(bmi(70, 170, 'metric'), 5);
  });
});

describe('bmiCategory', () => {
  it('classifies underweight', () => {
    expect(bmiCategory(16.5)).toBe('Moderate underweight');
    expect(bmiCategory(17)).toBe('Underweight');
    expect(bmiCategory(18)).toBe('Underweight');
  });

  it('classifies normal weight', () => {
    expect(bmiCategory(22)).toBe('Normal weight');
  });

  it('classifies overweight', () => {
    expect(bmiCategory(27)).toBe('Overweight');
  });

  it('classifies obese classes', () => {
    expect(bmiCategory(32)).toBe('Obese class I');
    expect(bmiCategory(37)).toBe('Obese class II');
    expect(bmiCategory(42)).toBe('Obese class III');
  });

  it('returns empty string for zero or negative', () => {
    expect(bmiCategory(0)).toBe('');
    expect(bmiCategory(-5)).toBe('');
  });
});

describe('bmr (Mifflin-St Jeor)', () => {
  it('calculates male BMR correctly', () => {
    // 80 kg, 180 cm, 30 years, male → 10*80 + 6.25*180 - 5*30 + 5 = 1780
    expect(bmr(80, 180, 30, 'male')).toBe(1780);
  });

  it('calculates female BMR correctly', () => {
    // 60 kg, 165 cm, 25 years, female → 10*60 + 6.25*165 - 5*25 - 161 = 1345.25
    expect(bmr(60, 165, 25, 'female')).toBe(1345.25);
  });

  it('returns 0 for invalid inputs', () => {
    expect(bmr(0, 170, 30, 'male')).toBe(0);
    expect(bmr(70, 0, 30, 'male')).toBe(0);
    expect(bmr(70, 170, 0, 'male')).toBe(0);
  });
});

describe('tdee', () => {
  it('calculates sedentary TDEE correctly', () => {
    // BMR 1780 * 1.2 = 2136
    expect(tdee(80, 180, 30, 'male', 'sedentary')).toBeCloseTo(2136, 0);
  });

  it('calculates active TDEE correctly', () => {
    // BMR 1780 * 1.725 = 3070.5
    expect(tdee(80, 180, 30, 'male', 'active')).toBeCloseTo(3070.5, 0);
  });

  it('moderate activity is between light and active', () => {
    const light = tdee(70, 175, 25, 'male', 'light');
    const moderate = tdee(70, 175, 25, 'male', 'moderate');
    const active = tdee(70, 175, 25, 'male', 'active');
    expect(moderate).toBeGreaterThan(light);
    expect(moderate).toBeLessThan(active);
  });
});

describe('calorieNeeds', () => {
  it('returns TDEE for maintenance', () => {
    const t = tdee(80, 180, 30, 'male', 'moderate');
    expect(calorieNeeds(80, 180, 30, 'male', 'moderate', 'maintain')).toBe(t);
  });

  it('subtracts 500 for weight loss', () => {
    const t = tdee(80, 180, 30, 'male', 'moderate');
    expect(calorieNeeds(80, 180, 30, 'male', 'moderate', 'lose')).toBe(t - 500);
  });

  it('adds 500 for weight gain', () => {
    const t = tdee(80, 180, 30, 'male', 'moderate');
    expect(calorieNeeds(80, 180, 30, 'male', 'moderate', 'gain')).toBe(t + 500);
  });

  it('never drops below 1200 kcal', () => {
    // Very small person, sedentary, lose → should clamp at 1200
    const result = calorieNeeds(40, 150, 70, 'female', 'sedentary', 'lose');
    expect(result).toBeGreaterThanOrEqual(1200);
  });
});

describe('macroSplit', () => {
  it('splits 2000 calories with default ratios', () => {
    const macros = macroSplit(2000);
    // Protein: 2000 * 0.3 / 4 = 150g
    expect(macros.protein).toBeCloseTo(150, 0);
    // Carbs: 2000 * 0.4 / 4 = 200g
    expect(macros.carbs).toBeCloseTo(200, 0);
    // Fat: 2000 * 0.3 / 9 = 66.67g
    expect(macros.fat).toBeCloseTo(66.67, 0);
  });

  it('supports custom ratios', () => {
    const macros = macroSplit(2000, { protein: 0.4, carbs: 0.3, fat: 0.3 });
    expect(macros.protein).toBeCloseTo(200, 0);
    expect(macros.carbs).toBeCloseTo(150, 0);
  });
});
