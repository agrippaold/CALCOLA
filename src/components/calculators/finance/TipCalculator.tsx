import { useState } from 'preact/hooks';
import { tipCalculation } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function TipCalculator({ defaults, lang }: Props) {
  const [bill, setBill] = useState('');
  const [tipPct, setTipPct] = useState('');
  const [split, setSplit] = useState('1');

  const b = parseFloat(bill);
  const t = parseFloat(tipPct);
  const s = parseInt(split) || 1;

  const result = b > 0 && t >= 0 ? tipCalculation(b, t, s) : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Bill Amount"
          value={bill}
          onChange={setBill}
          min={0.01}
          max={100_000}
          step={1}
          unit="$"
          placeholder="85.00"
        />
        <InputField
          label="Tip Percentage"
          value={tipPct}
          onChange={setTipPct}
          min={0}
          max={100}
          step={1}
          unit="%"
          placeholder="20"
        />
        <InputField
          label="Split Between"
          value={split}
          onChange={setSplit}
          min={1}
          max={50}
          step={1}
          unit="people"
          placeholder="1"
        />
      </div>

      {/* Quick tip buttons */}
      <div class="flex gap-2 mt-3">
        {[15, 18, 20, 25].map((pct) => (
          <button
            type="button"
            class={`px-3 py-1 text-sm rounded-full border transition-colors ${
              tipPct === String(pct)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
            onClick={() => setTipPct(String(pct))}
          >
            {pct}%
          </button>
        ))}
      </div>

      {result && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Tip Amount', value: `$${result.tipAmount.toFixed(2)}`, highlight: true },
              { label: 'Total Bill', value: `$${result.totalBill.toFixed(2)}` },
              ...(s > 1
                ? [{ label: `Per Person (${s})`, value: `$${result.perPerson.toFixed(2)}` }]
                : []),
            ]}
          />
        </div>
      )}
    </CalculatorShell>
  );
}
