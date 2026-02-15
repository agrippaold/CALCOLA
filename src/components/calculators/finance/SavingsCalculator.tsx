import { useState } from 'preact/hooks';
import { savingsGrowth } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function SavingsCalculator({ defaults, lang }: Props) {
  const [initial, setInitial] = useState('');
  const [monthly, setMonthly] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const i = parseFloat(initial) || 0;
  const m = parseFloat(monthly) || 0;
  const r = parseFloat(rate);
  const y = parseFloat(years);

  const hasInputs = (i > 0 || m > 0) && r >= 0 && y > 0;
  const futureValue = hasInputs ? savingsGrowth(i, m, r, y) : null;
  const totalContributions = i + m * y * 12;
  const interestEarned = futureValue ? futureValue - totalContributions : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Initial Deposit"
          value={initial}
          onChange={setInitial}
          min={0}
          max={100_000_000}
          step={100}
          unit="$"
          placeholder="5000"
        />
        <InputField
          label="Monthly Contribution"
          value={monthly}
          onChange={setMonthly}
          min={0}
          max={1_000_000}
          step={50}
          unit="$"
          placeholder="200"
        />
        <InputField
          label="Annual Interest Rate"
          value={rate}
          onChange={setRate}
          min={0}
          max={30}
          step={0.01}
          unit="%"
          placeholder="5"
        />
        <InputField
          label="Time Period"
          value={years}
          onChange={setYears}
          min={1}
          max={60}
          step={1}
          unit="years"
          placeholder="20"
        />
      </div>

      {futureValue && interestEarned !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Future Value', value: `$${futureValue.toFixed(2)}`, highlight: true },
              { label: 'Total Contributions', value: `$${totalContributions.toFixed(2)}` },
              { label: 'Interest Earned', value: `$${interestEarned.toFixed(2)}` },
            ]}
          />

          {/* Savings breakdown bar */}
          <div class="mt-4">
            <div class="h-4 rounded-full overflow-hidden flex">
              <div
                class="bg-blue-500 h-full"
                style={`width: ${(i / futureValue) * 100}%`}
              />
              <div
                class="bg-blue-300 h-full"
                style={`width: ${((m * y * 12) / futureValue) * 100}%`}
              />
              <div
                class="bg-green-400 h-full"
                style={`width: ${(interestEarned / futureValue) * 100}%`}
              />
            </div>
            <div class="flex text-xs text-gray-400 mt-1 gap-3">
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-blue-500 rounded-sm inline-block" /> Initial
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-blue-300 rounded-sm inline-block" /> Contributions
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-green-400 rounded-sm inline-block" /> Interest
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
