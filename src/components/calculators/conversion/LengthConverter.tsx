import { useState } from 'preact/hooks';
import { lengthConvert } from '../../../lib/formulas/conversions';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

const UNITS = [
  { value: 'mm', label: 'Millimeters (mm)' },
  { value: 'cm', label: 'Centimeters (cm)' },
  { value: 'm', label: 'Meters (m)' },
  { value: 'km', label: 'Kilometers (km)' },
  { value: 'in', label: 'Inches (in)' },
  { value: 'ft', label: 'Feet (ft)' },
  { value: 'yd', label: 'Yards (yd)' },
  { value: 'mi', label: 'Miles (mi)' },
];

function unitShort(u: string): string {
  const map: Record<string, string> = {
    mm: 'mm', cm: 'cm', m: 'm', km: 'km',
    in: 'in', ft: 'ft', yd: 'yd', mi: 'mi',
  };
  return map[u] || u;
}

export default function LengthConverter({ defaults, lang }: Props) {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('cm');
  const [to, setTo] = useState('in');

  const v = parseFloat(value);
  const hasInput = !isNaN(v);

  const commonUnits = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'mi'];
  const otherUnits = commonUnits.filter(u => u !== from);

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="Length" value={value} onChange={setValue} step={0.01} placeholder="1" />
        <SelectField label="From" value={from} onChange={setFrom} options={UNITS} />
        <SelectField label="To" value={to} onChange={setTo} options={UNITS} />
      </div>

      {hasInput && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: `${v} ${unitShort(from)}`,
                value: `${lengthConvert(v, from, to).toFixed(4)} ${unitShort(to)}`,
                highlight: true,
              },
              ...otherUnits.map(u => ({
                label: UNITS.find(o => o.value === u)!.label,
                value: `${lengthConvert(v, from, u).toFixed(4)} ${unitShort(u)}`,
              })),
            ]}
          />

          {/* Common reference points */}
          <div class="mt-4 grid grid-cols-3 gap-2 text-xs text-center text-gray-500">
            <div class="bg-blue-50 rounded p-2">
              <div class="font-medium text-blue-700">1 inch</div>
              <div>2.54 cm</div>
            </div>
            <div class="bg-green-50 rounded p-2">
              <div class="font-medium text-green-700">1 foot</div>
              <div>30.48 cm / 12 in</div>
            </div>
            <div class="bg-purple-50 rounded p-2">
              <div class="font-medium text-purple-700">1 mile</div>
              <div>1.609 km / 5280 ft</div>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
