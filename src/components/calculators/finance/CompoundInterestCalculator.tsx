import { useState } from 'preact/hooks';
import { compoundInterest } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

const COMPOUND_OPTIONS = [
  { value: '1', label: 'Annually' },
  { value: '2', label: 'Semi-Annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
  { value: '365', label: 'Daily' },
];

export default function CompoundInterestCalculator({ defaults, lang }: Props) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [frequency, setFrequency] = useState('12');

  const p = parseFloat(principal);
  const r = parseFloat(rate);
  const y = parseFloat(years);
  const n = parseInt(frequency);

  const futureValue = p > 0 && r >= 0 && y > 0 ? compoundInterest(p, r, y, n) : null;
  const totalInterest = futureValue ? futureValue - p : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Initial Investment"
          value={principal}
          onChange={setPrincipal}
          min={1}
          max={100_000_000}
          step={100}
          unit="$"
          placeholder="10000"
        />
        <InputField
          label="Annual Interest Rate"
          value={rate}
          onChange={setRate}
          min={0}
          max={100}
          step={0.01}
          unit="%"
          placeholder="7"
        />
        <InputField
          label="Time Period"
          value={years}
          onChange={setYears}
          min={1}
          max={100}
          step={1}
          unit="years"
          placeholder="10"
        />
        <SelectField
          label="Compounding Frequency"
          value={frequency}
          onChange={setFrequency}
          options={COMPOUND_OPTIONS}
        />
      </div>

      {futureValue && totalInterest !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Future Value', value: `$${futureValue.toFixed(2)}`, highlight: true },
              { label: 'Total Interest Earned', value: `$${totalInterest.toFixed(2)}` },
              { label: 'Initial Investment', value: `$${p.toFixed(2)}` },
            ]}
          />

          {/* Growth breakdown bar */}
          <div class="mt-4">
            <div class="h-4 rounded-full overflow-hidden flex">
              <div
                class="bg-green-500 h-full"
                style={`width: ${(p / futureValue) * 100}%`}
              />
              <div
                class="bg-emerald-300 h-full"
                style={`width: ${(totalInterest / futureValue) * 100}%`}
              />
            </div>
            <div class="flex text-xs text-gray-400 mt-1">
              <span class="flex-1 flex items-center gap-1">
                <span class="w-3 h-3 bg-green-500 rounded-sm inline-block" /> Principal
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-emerald-300 rounded-sm inline-block" /> Interest
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
