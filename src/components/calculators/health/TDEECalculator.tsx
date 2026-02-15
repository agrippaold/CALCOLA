import { useState } from 'preact/hooks';
import { bmr, tdee } from '../../../lib/formulas/health';
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

export default function TDEECalculator({ defaults, lang }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>('male');
  const [activity, setActivity] = useState<string>('moderate');

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);

  const baseBmr = w > 0 && h > 0 && a > 0 ? bmr(w, h, a, gender as Gender) : null;
  const result = baseBmr ? tdee(w, h, a, gender as Gender, activity as ActivityLevel) : null;

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
      </div>

      {result && baseBmr && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Your TDEE', value: `${Math.round(result)} kcal/day`, highlight: true },
              { label: 'BMR (base)', value: `${Math.round(baseBmr)} kcal/day` },
              { label: 'To lose weight', value: `${Math.round(result - 500)} kcal/day` },
              { label: 'To gain weight', value: `${Math.round(result + 500)} kcal/day` },
            ]}
          />

          {/* Activity level breakdown */}
          <div class="mt-4 grid grid-cols-5 gap-1 text-xs text-center">
            {ACTIVITY_OPTIONS.map((opt) => {
              const isActive = opt.value === activity;
              return (
                <div
                  key={opt.value}
                  class={`py-2 px-1 rounded ${isActive ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-50 text-gray-400'}`}
                >
                  {opt.label.split(' (')[0]}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
