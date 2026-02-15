import { useState } from 'preact/hooks';
import { percentChange } from '../../../lib/formulas/math';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

export default function PercentChangeCalculator({ defaults, lang }: Props) {
  const [oldVal, setOldVal] = useState('');
  const [newVal, setNewVal] = useState('');

  const o = parseFloat(oldVal);
  const n = parseFloat(newVal);
  const hasInput = !isNaN(o) && !isNaN(n) && o !== 0;

  const change = hasInput ? percentChange(o, n) : null;
  const diff = hasInput ? n - o : null;
  const isIncrease = change !== null && change >= 0;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Original Value"
          value={oldVal}
          onChange={setOldVal}
          step={0.01}
          placeholder="100"
        />
        <InputField
          label="New Value"
          value={newVal}
          onChange={setNewVal}
          step={0.01}
          placeholder="125"
        />
      </div>

      {hasInput && change !== null && diff !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: 'Percent Change',
                value: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
                highlight: true,
              },
              {
                label: 'Absolute Difference',
                value: `${diff >= 0 ? '+' : ''}${diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              },
              {
                label: 'Direction',
                value: change === 0 ? 'No change' : isIncrease ? 'Increase' : 'Decrease',
              },
              {
                label: 'Multiplier',
                value: `${(n / o).toFixed(4)}x`,
              },
            ]}
          />

          {/* Visual bar */}
          <div class="mt-4 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              class={`h-full rounded-full transition-all ${isIncrease ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(Math.abs(change), 100)}%` }}
            />
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span class={isIncrease ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span>100%</span>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
