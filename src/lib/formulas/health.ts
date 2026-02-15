/**
 * Health & fitness formulas — pure functions, no UI dependencies.
 */

export type Gender = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'      // little or no exercise
  | 'light'          // 1-3 days/week
  | 'moderate'       // 3-5 days/week
  | 'active'         // 6-7 days/week
  | 'very_active';   // athlete / physical job

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/**
 * Body Mass Index.
 * Metric:   BMI = weight(kg) / height(m)^2
 * Imperial: BMI = weight(lbs) * 703 / height(in)^2
 */
export function bmi(
  weight: number,
  height: number,
  system: 'metric' | 'imperial' = 'metric',
): number {
  if (weight <= 0 || height <= 0) return 0;
  if (system === 'metric') {
    const heightM = height / 100; // cm → m
    return weight / (heightM * heightM);
  }
  return (weight * 703) / (height * height);
}

export function bmiCategory(value: number): string {
  if (value <= 0) return '';
  if (value < 16) return 'Severe underweight';
  if (value < 17) return 'Moderate underweight';
  if (value < 18.5) return 'Underweight';
  if (value < 25) return 'Normal weight';
  if (value < 30) return 'Overweight';
  if (value < 35) return 'Obese class I';
  if (value < 40) return 'Obese class II';
  return 'Obese class III';
}

/**
 * Basal Metabolic Rate — Mifflin-St Jeor equation (most accurate per ADA).
 * Male:   BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 5 + 5
 * Female: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 5 - 161
 *
 * Simplified:
 * Male:   BMR = 10w + 6.25h - 5a + 5
 * Female: BMR = 10w + 6.25h - 5a - 161
 */
export function bmr(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
): number {
  if (weight <= 0 || height <= 0 || age <= 0) return 0;
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

/**
 * Total Daily Energy Expenditure.
 * TDEE = BMR * activity multiplier
 */
export function tdee(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activity: ActivityLevel,
): number {
  const baseBmr = bmr(weight, height, age, gender);
  return baseBmr * ACTIVITY_MULTIPLIERS[activity];
}

/**
 * Daily calorie needs for a specific goal.
 * @param goal 'lose' = -500 kcal/day, 'gain' = +500, 'maintain' = 0
 */
export function calorieNeeds(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
  activity: ActivityLevel,
  goal: 'lose' | 'maintain' | 'gain' = 'maintain',
): number {
  const daily = tdee(weight, height, age, gender, activity);
  const offsets: Record<string, number> = { lose: -500, maintain: 0, gain: 500 };
  return Math.max(daily + offsets[goal], 1200); // never below 1200 kcal
}

/**
 * Macronutrient split in grams.
 * Uses standard ratios: protein 30%, carbs 40%, fat 30%.
 * Calories per gram: protein 4, carbs 4, fat 9.
 */
export function macroSplit(
  totalCalories: number,
  ratios: { protein: number; carbs: number; fat: number } = {
    protein: 0.3,
    carbs: 0.4,
    fat: 0.3,
  },
): { protein: number; carbs: number; fat: number } {
  return {
    protein: (totalCalories * ratios.protein) / 4,
    carbs: (totalCalories * ratios.carbs) / 4,
    fat: (totalCalories * ratios.fat) / 9,
  };
}
