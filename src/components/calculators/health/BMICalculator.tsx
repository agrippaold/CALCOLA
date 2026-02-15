import { useState } from 'preact/hooks';
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

function calculateBMI(weight: number, height: number, unit: string): number | null {
  if (weight <= 0 || height <= 0) return null;

  if (unit === 'metric') {
    const heightM = height / 100;
    return weight / (heightM * heightM);
  } else {
    return (weight * 703) / (height * height);
  }
}

function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-yellow-600' };
  if (bmi < 25) return { label: 'Normal weight', color: 'text-green-600' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-orange-600' };
  return { label: 'Obese', color: 'text-red-600' };
}

function getBMIBarPosition(bmi: number): number {
  return Math.min(Math.max((bmi / 40) * 100, 0), 100);
}

export default function BMICalculator({ defaults, lang }: Props) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState(defaults?.unit || 'metric');

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const bmi = calculateBMI(w, h, unit);
  const category = bmi ? getBMICategory(bmi) : null;

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

      {bmi && category && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Your BMI', value: bmi.toFixed(1), highlight: true },
              { label: 'Category', value: category.label },
              { label: 'Healthy BMI range', value: '18.5 - 24.9' },
            ]}
          >
            {/* BMI visual bar */}
            <div class="mt-4">
              <div class="relative h-4 rounded-full overflow-hidden" style="background: linear-gradient(to right, #FBBF24, #22C55E, #22C55E, #F97316, #EF4444)">
                <div
                  class="absolute top-0 w-1 h-full bg-gray-900 rounded"
                  style={`left: ${getBMIBarPosition(bmi)}%`}
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
