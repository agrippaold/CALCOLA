import { useState } from 'preact/hooks';
import { bmi, bmiCategory } from '../../../lib/formulas/health';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: {
    unit?: string;
  };
  lang?: string;
}

function getBMIColor(value: number): string {
  if (value < 18.5) return 'text-yellow-600';
  if (value < 25) return 'text-green-600';
  if (value < 30) return 'text-orange-600';
  return 'text-red-600';
}

function getBMIBarPosition(value: number): number {
  return Math.min(Math.max((value / 40) * 100, 0), 100);
}

export default function BMICalculator({ defaults, lang }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState(defaults?.unit || 'metric');

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const result = w > 0 && h > 0 ? bmi(w, h, unit as 'metric' | 'imperial') : null;
  const category = result ? bmiCategory(result) : null;

  const weightUnit = unit === 'metric' ? 'kg' : 'lbs';
  const heightUnit = unit === 'metric' ? 'cm' : 'in';

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Unit System"
          value={unit}
          onChange={setUnit}
          options={[
            { value: 'metric', label: 'Metric (kg/cm)' },
            { value: 'imperial', label: 'Imperial (lbs/in)' },
          ]}
        />
        <div /> {/* spacer for grid alignment */}
        <InputField
          label="Weight"
          value={weight}
          onChange={setWeight}
          min={1}
          max={unit === 'metric' ? 500 : 1100}
          step={0.1}
          unit={weightUnit}
          placeholder={unit === 'metric' ? '70' : '154'}
        />
        <InputField
          label="Height"
          value={height}
          onChange={setHeight}
          min={1}
          max={unit === 'metric' ? 300 : 120}
          step={0.1}
          unit={heightUnit}
          placeholder={unit === 'metric' ? '170' : '67'}
        />
      </div>

      {result && category && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Your BMI', value: result.toFixed(1), highlight: true },
              { label: 'Category', value: category },
              { label: 'Healthy BMI range', value: '18.5 - 24.9' },
            ]}
          >
            {/* BMI visual bar */}
            <div class="mt-4">
              <div class="relative h-4 rounded-full overflow-hidden" style="background: linear-gradient(to right, #FBBF24, #22C55E, #22C55E, #F97316, #EF4444)">
                <div
                  class="absolute top-0 w-1 h-full bg-gray-900 rounded"
                  style={`left: ${getBMIBarPosition(result)}%`}
                />
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </ResultDisplay>
        </div>
      )}
    </CalculatorShell>
  );
}
