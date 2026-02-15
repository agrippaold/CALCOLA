import { useState } from 'preact/hooks';
import { investmentGrowth } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function InvestmentCalculator({ defaults, lang }: Props) {
  const [initial, setInitial] = useState('');
  const [monthly, setMonthly] = useState('');
  const [returnRate, setReturnRate] = useState('');
  const [years, setYears] = useState('');

  const i = parseFloat(initial) || 0;
  const m = parseFloat(monthly) || 0;
  const r = parseFloat(returnRate);
  const y = parseFloat(years);

  const hasInputs = (i > 0 || m > 0) && r >= 0 && y > 0;
  const futureValue = hasInputs ? investmentGrowth(i, m, r, y) : null;
  const totalContributions = i + m * y * 12;
  const totalReturn = futureValue ? futureValue - totalContributions : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Initial Investment"
          value={initial}
          onChange={setInitial}
          min={0}
          max={100_000_000}
          step={100}
          unit="$"
          placeholder="10000"
        />
        <InputField
          label="Monthly Contribution"
          value={monthly}
          onChange={setMonthly}
          min={0}
          max={1_000_000}
          step={50}
          unit="$"
          placeholder="500"
        />
        <InputField
          label="Expected Annual Return"
          value={returnRate}
          onChange={setReturnRate}
          min={0}
          max={30}
          step={0.1}
          unit="%"
          placeholder="8"
        />
        <InputField
          label="Investment Period"
          value={years}
          onChange={setYears}
          min={1}
          max={50}
          step={1}
          unit="years"
          placeholder="20"
        />
      </div>

      {futureValue && totalReturn !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Future Value', value: `$${futureValue.toFixed(2)}`, highlight: true },
              { label: 'Total Contributions', value: `$${totalContributions.toFixed(2)}` },
              { label: 'Investment Returns', value: `$${totalReturn.toFixed(2)}` },
              { label: 'Return on Contributions', value: `${((totalReturn / totalContributions) * 100).toFixed(1)}%` },
            ]}
          />

          {/* Growth breakdown bar */}
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
                style={`width: ${(totalReturn / futureValue) * 100}%`}
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
                <span class="w-3 h-3 bg-green-400 rounded-sm inline-block" /> Returns
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
