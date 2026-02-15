import { useState } from 'preact/hooks';
import { volumeConvert } from '../../../lib/formulas/conversions';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

const UNITS = [
  { value: 'ml', label: 'Milliliters (mL)' },
  { value: 'l', label: 'Liters (L)' },
  { value: 'gal', label: 'US Gallons' },
  { value: 'qt', label: 'US Quarts' },
  { value: 'pt', label: 'US Pints' },
  { value: 'cup', label: 'US Cups' },
  { value: 'fl_oz', label: 'US Fluid Ounces' },
  { value: 'tbsp', label: 'Tablespoons' },
  { value: 'tsp', label: 'Teaspoons' },
  { value: 'm3', label: 'Cubic Meters (m³)' },
];

function unitShort(u: string): string {
  const map: Record<string, string> = {
    ml: 'mL', l: 'L', gal: 'gal', qt: 'qt', pt: 'pt',
    cup: 'cups', fl_oz: 'fl oz', tbsp: 'tbsp', tsp: 'tsp', m3: 'm³',
  };
  return map[u] || u;
}

export default function VolumeConverter({ defaults, lang }: Props) {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('l');
  const [to, setTo] = useState('gal');

  const v = parseFloat(value);
  const hasInput = !isNaN(v);

  const commonUnits = ['ml', 'l', 'gal', 'cup', 'fl_oz'];
  const otherUnits = commonUnits.filter(u => u !== from);

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="Volume" value={value} onChange={setValue} step={0.01} placeholder="1" />
        <SelectField label="From" value={from} onChange={setFrom} options={UNITS} />
        <SelectField label="To" value={to} onChange={setTo} options={UNITS} />
      </div>

      {hasInput && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: `${v} ${unitShort(from)}`,
                value: `${volumeConvert(v, from, to).toFixed(4)} ${unitShort(to)}`,
                highlight: true,
              },
              ...otherUnits.map(u => ({
                label: UNITS.find(o => o.value === u)!.label,
                value: `${volumeConvert(v, from, u).toFixed(4)} ${unitShort(u)}`,
              })),
            ]}
          />

          {/* Common reference points */}
          <div class="mt-4 grid grid-cols-3 gap-2 text-xs text-center text-gray-500">
            <div class="bg-blue-50 rounded p-2">
              <div class="font-medium text-blue-700">1 US Gallon</div>
              <div>3.785 L / 128 fl oz</div>
            </div>
            <div class="bg-green-50 rounded p-2">
              <div class="font-medium text-green-700">1 Liter</div>
              <div>33.8 fl oz / 4.23 cups</div>
            </div>
            <div class="bg-purple-50 rounded p-2">
              <div class="font-medium text-purple-700">1 US Cup</div>
              <div>236.6 mL / 8 fl oz</div>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
