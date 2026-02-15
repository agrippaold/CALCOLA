import { useState } from 'preact/hooks';
import { mortgagePayment, amortizationSchedule } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function MortgageCalculator({ defaults, lang }: Props) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const p = parseFloat(principal);
  const r = parseFloat(rate);
  const y = parseFloat(years);

  const monthly = p > 0 && r >= 0 && y > 0 ? mortgagePayment(p, r, y) : null;
  const totalPaid = monthly ? monthly * y * 12 : null;
  const totalInterest = totalPaid && p > 0 ? totalPaid - p : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Loan Amount"
          value={principal}
          onChange={setPrincipal}
          min={1}
          max={100_000_000}
          step={1000}
          unit="$"
          placeholder="250000"
        />
        <InputField
          label="Interest Rate"
          value={rate}
          onChange={setRate}
          min={0}
          max={30}
          step={0.01}
          unit="%"
          placeholder="6.5"
        />
        <InputField
          label="Loan Term"
          value={years}
          onChange={setYears}
          min={1}
          max={50}
          step={1}
          unit="years"
          placeholder="30"
        />
      </div>

      {monthly && totalPaid && totalInterest !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Monthly Payment', value: `$${monthly.toFixed(2)}`, highlight: true },
              { label: 'Total Paid', value: `$${totalPaid.toFixed(2)}` },
              { label: 'Total Interest', value: `$${totalInterest.toFixed(2)}` },
            ]}
          />

          {/* Payment breakdown bar */}
          <div class="mt-4">
            <div class="flex text-sm text-gray-600 mb-1">
              <span class="flex-1">Principal: ${p.toLocaleString()}</span>
              <span>Interest: ${totalInterest.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
            </div>
            <div class="h-4 rounded-full overflow-hidden flex">
              <div
                class="bg-blue-500 h-full"
                style={`width: ${(p / totalPaid) * 100}%`}
              />
              <div
                class="bg-orange-400 h-full"
                style={`width: ${(totalInterest / totalPaid) * 100}%`}
              />
            </div>
            <div class="flex text-xs text-gray-400 mt-1">
              <span class="flex-1 flex items-center gap-1">
                <span class="w-3 h-3 bg-blue-500 rounded-sm inline-block" /> Principal
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-orange-400 rounded-sm inline-block" /> Interest
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
