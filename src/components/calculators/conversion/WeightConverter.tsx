import { useState } from 'preact/hooks';
import { weightConvert } from '../../../lib/formulas/conversions';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

const UNITS = [
  { value: 'mg', label: 'Milligrams (mg)' },
  { value: 'g', label: 'Grams (g)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'lb', label: 'Pounds (lb)' },
  { value: 'st', label: 'Stone (st)' },
  { value: 't', label: 'Metric Tons (t)' },
];

function unitShort(u: string): string {
  const map: Record<string, string> = {
    mg: 'mg', g: 'g', kg: 'kg', oz: 'oz',
    lb: 'lb', st: 'st', t: 't',
  };
  return map[u] || u;
}

export default function WeightConverter({ defaults, lang }: Props) {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('kg');
  const [to, setTo] = useState('lb');

  const v = parseFloat(value);
  const hasInput = !isNaN(v);

  const commonUnits = ['g', 'kg', 'oz', 'lb', 'st'];
  const otherUnits = commonUnits.filter(u => u !== from);

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="Weight" value={value} onChange={setValue} step={0.01} placeholder="1" />
        <SelectField label="From" value={from} onChange={setFrom} options={UNITS} />
        <SelectField label="To" value={to} onChange={setTo} options={UNITS} />
      </div>

      {hasInput && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: `${v} ${unitShort(from)}`,
                value: `${weightConvert(v, from, to).toFixed(4)} ${unitShort(to)}`,
                highlight: true,
              },
              ...otherUnits.map(u => ({
                label: UNITS.find(o => o.value === u)!.label,
                value: `${weightConvert(v, from, u).toFixed(4)} ${unitShort(u)}`,
              })),
            ]}
          />

          {/* Common reference points */}
          <div class="mt-4 grid grid-cols-3 gap-2 text-xs text-center text-gray-500">
            <div class="bg-blue-50 rounded p-2">
              <div class="font-medium text-blue-700">1 kg</div>
              <div>2.205 lb / 35.27 oz</div>
            </div>
            <div class="bg-green-50 rounded p-2">
              <div class="font-medium text-green-700">1 pound</div>
              <div>453.6 g / 16 oz</div>
            </div>
            <div class="bg-purple-50 rounded p-2">
              <div class="font-medium text-purple-700">1 stone</div>
              <div>6.35 kg / 14 lb</div>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
