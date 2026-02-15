import { useState } from 'preact/hooks';
import { autoLoanPayment } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function AutoLoanCalculator({ defaults, lang }: Props) {
  const [price, setPrice] = useState('');
  const [down, setDown] = useState('');
  const [tradeIn, setTradeIn] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const p = parseFloat(price);
  const d = parseFloat(down) || 0;
  const ti = parseFloat(tradeIn) || 0;
  const r = parseFloat(rate);
  const y = parseFloat(years);

  const loanAmount = p > 0 ? p - d - ti : 0;
  const monthly = p > 0 && r >= 0 && y > 0 && loanAmount > 0
    ? autoLoanPayment(p, d, ti, r, y)
    : null;
  const totalPaid = monthly ? monthly * y * 12 : null;
  const totalInterest = totalPaid && loanAmount > 0 ? totalPaid - loanAmount : null;
  const totalCost = totalPaid ? totalPaid + d + ti : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Vehicle Price"
          value={price}
          onChange={setPrice}
          min={1}
          max={500_000}
          step={100}
          unit="$"
          placeholder="35000"
        />
        <InputField
          label="Down Payment"
          value={down}
          onChange={setDown}
          min={0}
          max={500_000}
          step={100}
          unit="$"
          placeholder="5000"
        />
        <InputField
          label="Trade-in Value"
          value={tradeIn}
          onChange={setTradeIn}
          min={0}
          max={200_000}
          step={100}
          unit="$"
          placeholder="3000"
        />
        <InputField
          label="Interest Rate"
          value={rate}
          onChange={setRate}
          min={0}
          max={30}
          step={0.01}
          unit="%"
          placeholder="5.9"
        />
        <InputField
          label="Loan Term"
          value={years}
          onChange={setYears}
          min={1}
          max={8}
          step={1}
          unit="years"
          placeholder="5"
        />
      </div>

      {monthly && totalPaid && totalInterest !== null && totalCost && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Monthly Payment', value: `$${monthly.toFixed(2)}`, highlight: true },
              { label: 'Loan Amount', value: `$${loanAmount.toFixed(2)}` },
              { label: 'Total Interest', value: `$${totalInterest.toFixed(2)}` },
              { label: 'Total Cost of Vehicle', value: `$${totalCost.toFixed(2)}` },
            ]}
          />

          {/* Cost breakdown bar */}
          <div class="mt-4">
            <div class="h-4 rounded-full overflow-hidden flex">
              <div
                class="bg-blue-500 h-full"
                style={`width: ${(loanAmount / totalCost) * 100}%`}
              />
              <div
                class="bg-orange-400 h-full"
                style={`width: ${(totalInterest / totalCost) * 100}%`}
              />
              <div
                class="bg-green-400 h-full"
                style={`width: ${((d + ti) / totalCost) * 100}%`}
              />
            </div>
            <div class="flex text-xs text-gray-400 mt-1 gap-3">
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-blue-500 rounded-sm inline-block" /> Principal
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-orange-400 rounded-sm inline-block" /> Interest
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-green-400 rounded-sm inline-block" /> Down + Trade-in
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
