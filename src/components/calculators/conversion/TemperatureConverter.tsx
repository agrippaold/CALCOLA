import { useState } from 'preact/hooks';
import {
  celsiusToFahrenheit, fahrenheitToCelsius,
  celsiusToKelvin, kelvinToCelsius,
  fahrenheitToKelvin, kelvinToFahrenheit,
} from '../../../lib/formulas/conversions';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

const UNIT_OPTIONS = [
  { value: 'celsius', label: 'Celsius (°C)' },
  { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
  { value: 'kelvin', label: 'Kelvin (K)' },
];

function convert(value: number, from: string, to: string): number {
  if (from === to) return value;
  if (from === 'celsius' && to === 'fahrenheit') return celsiusToFahrenheit(value);
  if (from === 'celsius' && to === 'kelvin') return celsiusToKelvin(value);
  if (from === 'fahrenheit' && to === 'celsius') return fahrenheitToCelsius(value);
  if (from === 'fahrenheit' && to === 'kelvin') return fahrenheitToKelvin(value);
  if (from === 'kelvin' && to === 'celsius') return kelvinToCelsius(value);
  if (from === 'kelvin' && to === 'fahrenheit') return kelvinToFahrenheit(value);
  return value;
}

function unitSymbol(unit: string): string {
  if (unit === 'celsius') return '°C';
  if (unit === 'fahrenheit') return '°F';
  return 'K';
}

export default function TemperatureConverter({ defaults, lang }: Props) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('celsius');
  const [toUnit, setToUnit] = useState('fahrenheit');

  const v = parseFloat(value);
  const hasInput = !isNaN(v);

  const result = hasInput ? convert(v, fromUnit, toUnit) : null;
  const otherUnits = ['celsius', 'fahrenheit', 'kelvin'].filter(u => u !== fromUnit);

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Temperature"
          value={value}
          onChange={setValue}
          step={0.1}
          placeholder="0"
        />
        <SelectField
          label="From"
          value={fromUnit}
          onChange={setFromUnit}
          options={UNIT_OPTIONS}
        />
        <SelectField
          label="To"
          value={toUnit}
          onChange={setToUnit}
          options={UNIT_OPTIONS}
        />
      </div>

      {hasInput && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: `${v} ${unitSymbol(fromUnit)}`,
                value: `${convert(v, fromUnit, toUnit).toFixed(2)} ${unitSymbol(toUnit)}`,
                highlight: true,
              },
              ...otherUnits.map(u => ({
                label: UNIT_OPTIONS.find(o => o.value === u)!.label,
                value: `${convert(v, fromUnit, u).toFixed(2)} ${unitSymbol(u)}`,
              })),
            ]}
          />

          {/* Common reference points */}
          <div class="mt-4 grid grid-cols-3 gap-2 text-xs text-center text-gray-500">
            <div class="bg-blue-50 rounded p-2">
              <div class="font-medium text-blue-700">Freezing</div>
              <div>0°C / 32°F / 273.15K</div>
            </div>
            <div class="bg-green-50 rounded p-2">
              <div class="font-medium text-green-700">Body Temp</div>
              <div>37°C / 98.6°F / 310.15K</div>
            </div>
            <div class="bg-red-50 rounded p-2">
              <div class="font-medium text-red-700">Boiling</div>
              <div>100°C / 212°F / 373.15K</div>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
