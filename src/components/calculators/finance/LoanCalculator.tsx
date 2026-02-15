import { useState } from 'preact/hooks';
import { loanPayment } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function LoanCalculator({ defaults, lang }: Props) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');

  const p = parseFloat(principal);
  const r = parseFloat(rate);
  const y = parseFloat(years);

  const monthly = p > 0 && r >= 0 && y > 0 ? loanPayment(p, r, y) : null;
  const totalPaid = monthly ? monthly * y * 12 : null;
  const totalInterest = totalPaid ? totalPaid - p : null;
  const interestRatio = totalPaid && totalPaid > 0 ? ((totalInterest ?? 0) / totalPaid) * 100 : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Loan Amount"
          value={principal}
          onChange={setPrincipal}
          min={1}
          max={10_000_000}
          step={100}
          unit="$"
          placeholder="25000"
        />
        <InputField
          label="Interest Rate"
          value={rate}
          onChange={setRate}
          min={0}
          max={50}
          step={0.01}
          unit="%"
          placeholder="8"
        />
        <InputField
          label="Loan Term"
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          unit="years"
          placeholder="5"
        />
      </div>

      {monthly && totalPaid && totalInterest !== null && interestRatio !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Monthly Payment', value: `$${monthly.toFixed(2)}`, highlight: true },
              { label: 'Total Amount Paid', value: `$${totalPaid.toFixed(2)}` },
              { label: 'Total Interest', value: `$${totalInterest.toFixed(2)}` },
              { label: 'Interest as % of Total', value: `${interestRatio.toFixed(1)}%` },
            ]}
          />
        </div>
      )}
    </CalculatorShell>
  );
}
