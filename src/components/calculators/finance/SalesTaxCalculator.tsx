import { useState } from 'preact/hooks';
import { salesTax } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function SalesTaxCalculator({ defaults, lang }: Props) {
  const [price, setPrice] = useState('');
  const [taxRate, setTaxRate] = useState('');

  const p = parseFloat(price);
  const r = parseFloat(taxRate);

  const result = p > 0 && r >= 0 ? salesTax(p, r) : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Price Before Tax"
          value={price}
          onChange={setPrice}
          min={0.01}
          max={100_000_000}
          step={1}
          unit="$"
          placeholder="49.99"
        />
        <InputField
          label="Sales Tax Rate"
          value={taxRate}
          onChange={setTaxRate}
          min={0}
          max={30}
          step={0.01}
          unit="%"
          placeholder="8.25"
        />
      </div>

      {result && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Total Price', value: `$${result.totalPrice.toFixed(2)}`, highlight: true },
              { label: 'Tax Amount', value: `$${result.taxAmount.toFixed(2)}` },
              { label: 'Pre-tax Price', value: `$${p.toFixed(2)}` },
              { label: 'Tax Rate', value: `${r}%` },
            ]}
          />

          {/* Tax breakdown bar */}
          <div class="mt-4">
            <div class="h-4 rounded-full overflow-hidden flex">
              <div
                class="bg-blue-500 h-full"
                style={`width: ${(p / result.totalPrice) * 100}%`}
              />
              <div
                class="bg-orange-400 h-full"
                style={`width: ${(result.taxAmount / result.totalPrice) * 100}%`}
              />
            </div>
            <div class="flex text-xs text-gray-400 mt-1 gap-3">
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-blue-500 rounded-sm inline-block" /> Price
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-orange-400 rounded-sm inline-block" /> Tax
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
