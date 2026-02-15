import { useState } from 'preact/hooks';
import { amortizationSchedule, mortgagePayment } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function AmortizationCalculator({ defaults, lang }: Props) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const p = parseFloat(principal);
  const r = parseFloat(rate);
  const y = parseFloat(years);

  const monthly = p > 0 && r >= 0 && y > 0 ? mortgagePayment(p, r, y) : null;
  const totalPaid = monthly ? monthly * y * 12 : null;
  const totalInterest = totalPaid ? totalPaid - p : null;

  // Only generate schedule for display when inputs are valid
  const schedule = p > 0 && r >= 0 && y > 0 ? amortizationSchedule(p, r, y) : [];

  // Yearly summary (aggregate months into years)
  const yearlySummary = [];
  for (let yr = 0; yr < y && schedule.length > 0; yr++) {
    const startIdx = yr * 12;
    const endIdx = Math.min(startIdx + 12, schedule.length);
    const yearRows = schedule.slice(startIdx, endIdx);
    const yearPrincipal = yearRows.reduce((s, row) => s + row.principal, 0);
    const yearInterest = yearRows.reduce((s, row) => s + row.interest, 0);
    const endBalance = yearRows[yearRows.length - 1]?.balance ?? 0;
    yearlySummary.push({
      year: yr + 1,
      principal: yearPrincipal,
      interest: yearInterest,
      balance: endBalance,
    });
  }

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Loan Amount"
          value={principal}
          onChange={setPrincipal}
          min={1}
          max={10_000_000}
          step={1000}
          unit="$"
          placeholder="200000"
        />
        <InputField
          label="Interest Rate"
          value={rate}
          onChange={setRate}
          min={0}
          max={30}
          step={0.01}
          unit="%"
          placeholder="6"
        />
        <InputField
          label="Loan Term"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
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
              { label: 'Total Amount Paid', value: `$${totalPaid.toFixed(2)}` },
              { label: 'Total Interest', value: `$${totalInterest.toFixed(2)}` },
            ]}
          />

          {/* Yearly amortization table */}
          {yearlySummary.length > 0 && (
            <div class="mt-6 overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-gray-200 text-gray-500 text-left">
                    <th class="py-2 pr-4">Year</th>
                    <th class="py-2 pr-4 text-right">Principal</th>
                    <th class="py-2 pr-4 text-right">Interest</th>
                    <th class="py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlySummary.slice(0, 10).map((row) => (
                    <tr class="border-b border-gray-100">
                      <td class="py-1.5 pr-4 text-gray-700">{row.year}</td>
                      <td class="py-1.5 pr-4 text-right text-gray-600">${row.principal.toFixed(0)}</td>
                      <td class="py-1.5 pr-4 text-right text-gray-600">${row.interest.toFixed(0)}</td>
                      <td class="py-1.5 text-right text-gray-700">${row.balance.toFixed(0)}</td>
                    </tr>
                  ))}
                  {yearlySummary.length > 10 && (
                    <tr>
                      <td colspan={4} class="py-2 text-center text-gray-400 text-xs">
                        ... {yearlySummary.length - 10} more years
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  );
}
