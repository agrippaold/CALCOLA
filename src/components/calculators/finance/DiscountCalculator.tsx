import { useState } from 'preact/hooks';
import { discountPrice } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function DiscountCalculator({ defaults, lang }: Props) {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const p = parseFloat(price);
  const d = parseFloat(discount);

  const result = p > 0 && d > 0 && d <= 100 ? discountPrice(p, d) : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Original Price"
          value={price}
          onChange={setPrice}
          min={0.01}
          max={100_000_000}
          step={1}
          unit="$"
          placeholder="99.99"
        />
        <InputField
          label="Discount"
          value={discount}
          onChange={setDiscount}
          min={0.1}
          max={100}
          step={0.5}
          unit="%"
          placeholder="25"
        />
      </div>

      {result && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Final Price', value: `$${result.finalPrice.toFixed(2)}`, highlight: true },
              { label: 'You Save', value: `$${result.savings.toFixed(2)}` },
              { label: 'Original Price', value: `$${p.toFixed(2)}` },
              { label: 'Discount', value: `${d}%` },
            ]}
          />

          {/* Savings visual */}
          <div class="mt-4">
            <div class="h-4 rounded-full overflow-hidden flex">
              <div
                class="bg-green-500 h-full"
                style={`width: ${((p - result.savings) / p) * 100}%`}
              />
              <div
                class="bg-red-300 h-full"
                style={`width: ${(result.savings / p) * 100}%`}
              />
            </div>
            <div class="flex text-xs text-gray-400 mt-1 gap-3">
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-green-500 rounded-sm inline-block" /> You Pay
              </span>
              <span class="flex items-center gap-1">
                <span class="w-3 h-3 bg-red-300 rounded-sm inline-block" /> You Save
              </span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
