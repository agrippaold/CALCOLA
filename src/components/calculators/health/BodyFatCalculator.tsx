import { useState } from 'preact/hooks';
import { bodyFatNavy } from '../../../lib/formulas/health';
import type { Gender } from '../../../lib/formulas/health';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

function bodyFatCategory(bf: number, gender: Gender): string {
  if (gender === 'male') {
    if (bf < 6) return 'Essential fat';
    if (bf < 14) return 'Athletes';
    if (bf < 18) return 'Fitness';
    if (bf < 25) return 'Average';
    return 'Above average';
  }
  if (bf < 14) return 'Essential fat';
  if (bf < 21) return 'Athletes';
  if (bf < 25) return 'Fitness';
  if (bf < 32) return 'Average';
  return 'Above average';
}

export default function BodyFatCalculator({ defaults, lang }: Props) {
  const [gender, setGender] = useState('male');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [hip, setHip] = useState('');

  const w = parseFloat(waist);
  const n = parseFloat(neck);
  const h = parseFloat(height);
  const hp = parseFloat(hip);

  const isFemale = gender === 'female';
  const hasInputs = w > 0 && n > 0 && h > 0 && (!isFemale || hp > 0);
  const result = hasInputs
    ? bodyFatNavy(gender as Gender, w, n, h, isFemale ? hp : undefined)
    : null;

  const category = result && result > 0 ? bodyFatCategory(result, gender as Gender) : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Gender"
          value={gender}
          onChange={setGender}
          options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
        />
        <InputField label="Height" value={height} onChange={setHeight} min={100} max={250} step={0.1} unit="cm" placeholder="178" />
        <InputField label="Waist" value={waist} onChange={setWaist} min={40} max={200} step={0.1} unit="cm" placeholder="85" />
        <InputField label="Neck" value={neck} onChange={setNeck} min={20} max={60} step={0.1} unit="cm" placeholder="37" />
        {isFemale && (
          <InputField label="Hip" value={hip} onChange={setHip} min={50} max={200} step={0.1} unit="cm" placeholder="95" />
        )}
      </div>

      {result !== null && result > 0 && category && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Body Fat Percentage', value: `${result.toFixed(1)}%`, highlight: true },
              { label: 'Category', value: category },
            ]}
          />

          {/* Body fat visual scale */}
          <div class="mt-4">
            <div class="h-3 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                class={`h-full rounded-full transition-all ${
                  result < 18 ? 'bg-green-500' : result < 25 ? 'bg-yellow-400' : 'bg-orange-500'
                }`}
                style={`width: ${Math.min(result, 50) * 2}%`}
              />
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
