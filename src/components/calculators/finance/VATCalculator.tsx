import { useState } from 'preact/hooks';
import { vatCalculation } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function VATCalculator({ defaults, lang }: Props) {
  const [amount, setAmount] = useState('');
  const [vatRate, setVatRate] = useState('20');
  const [mode, setMode] = useState('add');

  const a = parseFloat(amount);
  const r = parseFloat(vatRate);

  const result = a > 0 && r >= 0
    ? vatCalculation(a, r, mode as 'add' | 'extract')
    : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label={mode === 'add' ? 'Net Price (excl. VAT)' : 'Gross Price (incl. VAT)'}
          value={amount}
          onChange={setAmount}
          min={0.01}
          max={100_000_000}
          step={1}
          unit="$"
          placeholder="100"
        />
        <InputField
          label="VAT Rate"
          value={vatRate}
          onChange={setVatRate}
          min={0}
          max={50}
          step={0.5}
          unit="%"
          placeholder="20"
        />
        <SelectField
          label="Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'add', label: 'Add VAT to price' },
            { value: 'extract', label: 'Extract VAT from price' },
          ]}
        />
      </div>

      {/* Common VAT rates */}
      <div class="flex gap-2 mt-3">
        {[5, 10, 15, 20, 21, 25].map((pct) => (
          <button
            type="button"
            class={`px-3 py-1 text-sm rounded-full border transition-colors ${
              vatRate === String(pct)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
            }`}
            onClick={() => setVatRate(String(pct))}
          >
            {pct}%
          </button>
        ))}
      </div>

      {result && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Net Price (excl. VAT)', value: `$${result.netPrice.toFixed(2)}` },
              { label: 'VAT Amount', value: `$${result.vatAmount.toFixed(2)}`, highlight: true },
              { label: 'Gross Price (incl. VAT)', value: `$${result.grossPrice.toFixed(2)}` },
            ]}
          />

          {/* VAT breakdown bar */}
          <div class="mt-4">
            <div class="h-4 rounded-full overflow-hidden flex">
              <div
                class="bg-blue-500 h-full"
                style={`width: ${(result.netPrice / result.grossPrice) * 100}%`}
              />
              <div
                class="bg-orange-400 h-full"
                style={`width: ${(result.vatAmount / result.grossPrice) * 100}%`}
              />
            </div>
            <div class="flex text-xs text-gray-400 mt-1 gap-3">
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-blue-500 rounded-sm inline-block" /> Net Price
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-orange-400 rounded-sm inline-block" /> VAT
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
