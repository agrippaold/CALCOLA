import { useState } from 'preact/hooks';
import { bmr } from '../../../lib/formulas/health';
import type { Gender } from '../../../lib/formulas/health';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function BMRCalculator({ defaults, lang }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>('male');

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);

  const result = w > 0 && h > 0 && a > 0 ? bmr(w, h, a, gender as Gender) : null;

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
      </div>

      {result && result > 0 && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Your BMR', value: `${Math.round(result)} kcal/day`, highlight: true },
              { label: 'Per hour', value: `${(result / 24).toFixed(1)} kcal` },
              { label: 'Per week', value: `${Math.round(result * 7).toLocaleString()} kcal` },
            ]}
          />
          <p class="text-sm text-gray-500 mt-3">
            BMR represents calories burned at complete rest. Your actual daily needs depend on activity level. Use the TDEE calculator for a more complete estimate.
          </p>
        </div>
      )}
    </CalculatorShell>
  );
}
