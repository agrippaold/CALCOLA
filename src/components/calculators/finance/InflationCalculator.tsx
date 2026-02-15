import { useState } from 'preact/hooks';
import { inflationAdjust, inflationFutureValue } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function InflationCalculator({ defaults, lang }: Props) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const a = parseFloat(amount);
  const r = parseFloat(rate);
  const y = parseFloat(years);

  const hasInputs = a > 0 && r > 0 && y > 0;
  const futureCost = hasInputs ? inflationFutureValue(a, r, y) : null;
  const purchasingPower = hasInputs ? inflationAdjust(a, r, y) : null;
  const lostValue = hasInputs && purchasingPower ? a - purchasingPower : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Current Amount"
          value={amount}
          onChange={setAmount}
          min={1}
          max={100_000_000}
          step={100}
          unit="$"
          placeholder="1000"
        />
        <InputField
          label="Annual Inflation Rate"
          value={rate}
          onChange={setRate}
          min={0.1}
          max={30}
          step={0.1}
          unit="%"
          placeholder="3"
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
      </div>

      {futureCost && purchasingPower && lostValue !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Future Cost of Same Item', value: `$${futureCost.toFixed(2)}`, highlight: true },
              { label: 'Purchasing Power of Your Money', value: `$${purchasingPower.toFixed(2)}` },
              { label: 'Value Lost to Inflation', value: `$${lostValue.toFixed(2)}` },
              { label: 'Purchasing Power Loss', value: `${((lostValue / a) * 100).toFixed(1)}%` },
            ]}
          />

          {/* Purchasing power bar */}
          <div class="mt-4">
            <div class="text-xs text-gray-500 mb-1">Purchasing power after {y} years</div>
            <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500 rounded-full transition-all"
                style={`width: ${(purchasingPower / a) * 100}%`}
              />
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>$0</span>
              <span>${a.toFixed(0)} (today)</span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
