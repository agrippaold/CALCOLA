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
  { value: 'lose', label: 'Lose Weight (-500 cal)' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'gain', label: 'Gain Muscle (+500 cal)' },
];

const DIET_PRESETS = [
  { label: 'Balanced', protein: 0.3, carbs: 0.4, fat: 0.3 },
  { label: 'High Protein', protein: 0.4, carbs: 0.3, fat: 0.3 },
  { label: 'Low Carb', protein: 0.35, carbs: 0.2, fat: 0.45 },
  { label: 'Keto', protein: 0.2, carbs: 0.05, fat: 0.75 },
];

export default function MacroCalculator({ defaults, lang }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [dietIdx, setDietIdx] = useState(0);

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseInt(age);

  const hasInputs = w > 0 && h > 0 && a > 0;
  const calories = hasInputs
    ? calorieNeeds(w, h, a, gender as Gender, activity as ActivityLevel, goal as 'lose' | 'maintain' | 'gain')
    : null;

  const diet = DIET_PRESETS[dietIdx];
  const macros = calories ? macroSplit(calories, diet) : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="Weight" value={weight} onChange={setWeight} min={20} max={300} step={0.1} unit="kg" placeholder="75" />
        <InputField label="Height" value={height} onChange={setHeight} min={100} max={250} step={1} unit="cm" placeholder="175" />
        <InputField label="Age" value={age} onChange={setAge} min={15} max={100} step={1} unit="years" placeholder="30" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <SelectField label="Gender" value={gender} onChange={setGender} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
        <SelectField label="Activity Level" value={activity} onChange={setActivity} options={ACTIVITY_OPTIONS} />
        <SelectField label="Goal" value={goal} onChange={setGoal} options={GOAL_OPTIONS} />
      </div>

      {/* Diet preset buttons */}
      <div class="flex gap-2 mt-4">
        {DIET_PRESETS.map((preset, idx) => (
          <button
            type="button"
            class={`px-3 py-1 text-sm rounded-full border transition-colors ${
              dietIdx === idx
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
            onClick={() => setDietIdx(idx)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {calories && macros && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Daily Calories', value: `${Math.round(calories)} kcal`, highlight: true },
              { label: 'Protein', value: `${Math.round(macros.protein)}g (${Math.round(diet.protein * 100)}%)` },
              { label: 'Carbs', value: `${Math.round(macros.carbs)}g (${Math.round(diet.carbs * 100)}%)` },
              { label: 'Fat', value: `${Math.round(macros.fat)}g (${Math.round(diet.fat * 100)}%)` },
            ]}
          />

          {/* Macro breakdown bar */}
          <div class="mt-4">
            <div class="h-4 rounded-full overflow-hidden flex">
              <div class="bg-red-400 h-full" style={`width: ${diet.protein * 100}%`} />
              <div class="bg-yellow-400 h-full" style={`width: ${diet.carbs * 100}%`} />
              <div class="bg-green-400 h-full" style={`width: ${diet.fat * 100}%`} />
            </div>
            <div class="flex text-xs text-gray-400 mt-1 gap-3">
              <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-400 rounded-sm inline-block" /> Protein</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 bg-yellow-400 rounded-sm inline-block" /> Carbs</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-400 rounded-sm inline-block" /> Fat</span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
