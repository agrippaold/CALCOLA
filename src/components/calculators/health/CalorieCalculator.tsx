import { useState } from 'preact/hooks';
import { calorieNeeds, macroSplit } from '../../../lib/formulas/health';
import type { Gender, ActivityLevel } from '../../../lib/formulas/health';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary (office job)' },
  { value: 'light', label: 'Light (1-3 days/week)' },
  { value: 'moderate', label: 'Moderate (3-5 days/week)' },
  { value: 'active', label: 'Active (6-7 days/week)' },
  { value: 'very_active', label: 'Very Active (athlete)' },
];

const GOAL_OPTIONS = [
  { value: 'lose', label: 'Lose Weight' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'gain', label: 'Gain Weight' },
];

export default function CalorieCalculator({ defaults, lang }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>('male');
  const [activity, setActivity] = useState<string>('moderate');
  const [goal, setGoal] = useState<string>('maintain');

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);

  const calories = w > 0 && h > 0 && a > 0
    ? calorieNeeds(w, h, a, gender as Gender, activity as ActivityLevel, goal as 'lose' | 'maintain' | 'gain')
    : null;

  const macros = calories ? macroSplit(calories) : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Gender"
          value={gender}
          onChange={setGender}
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
        />
        <InputField
          label="Age"
          value={age}
          onChange={setAge}
          min={15}
          max={120}
          step={1}
          unit="years"
          placeholder="30"
        />
        <InputField
          label="Weight"
          value={weight}
          onChange={setWeight}
          min={20}
          max={500}
          step={0.1}
          unit="kg"
          placeholder="75"
        />
        <InputField
          label="Height"
          value={height}
          onChange={setHeight}
          min={100}
          max={250}
          step={1}
          unit="cm"
          placeholder="175"
        />
        <SelectField
          label="Activity Level"
          value={activity}
          onChange={setActivity}
          options={ACTIVITY_OPTIONS}
        />
        <SelectField
          label="Goal"
          value={goal}
          onChange={setGoal}
          options={GOAL_OPTIONS}
        />
      </div>

      {calories && macros && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Daily Calories', value: `${Math.round(calories)} kcal`, highlight: true },
              { label: 'Protein', value: `${Math.round(macros.protein)}g` },
              { label: 'Carbs', value: `${Math.round(macros.carbs)}g` },
              { label: 'Fat', value: `${Math.round(macros.fat)}g` },
            ]}
          />

          {/* Macro breakdown bar */}
          <div class="mt-4">
            <div class="h-4 rounded-full overflow-hidden flex">
              <div class="bg-red-400 h-full" style={`width: 30%`} />
              <div class="bg-yellow-400 h-full" style={`width: 40%`} />
              <div class="bg-blue-400 h-full" style={`width: 30%`} />
            </div>
            <div class="flex text-xs text-gray-400 mt-1 gap-3">
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-red-400 rounded-sm inline-block" /> Protein 30%
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-yellow-400 rounded-sm inline-block" /> Carbs 40%
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-blue-400 rounded-sm inline-block" /> Fat 30%
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
