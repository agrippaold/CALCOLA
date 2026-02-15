import { useState } from 'preact/hooks';
import { roi } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

export default function ROICalculator({ defaults, lang }: Props) {
  const [invested, setInvested] = useState('');
  const [returned, setReturned] = useState('');

  const cost = parseFloat(invested);
  const gain = parseFloat(returned);

  const roiValue = cost > 0 && gain >= 0 ? roi(gain, cost) : null;
  const netProfit = cost > 0 && gain >= 0 ? gain - cost : null;

  const roiColor =
    roiValue === null
      ? 'text-gray-700'
      : roiValue >= 0
        ? 'text-green-600'
        : 'text-red-600';

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Amount Invested"
          value={invested}
          onChange={setInvested}
          min={0.01}
          max={100_000_000}
          step={100}
          unit="$"
          placeholder="10000"
        />
        <InputField
          label="Amount Returned"
          value={returned}
          onChange={setReturned}
          min={0}
          max={1_000_000_000}
          step={100}
          unit="$"
          placeholder="15000"
        />
      </div>

      {roiValue !== null && netProfit !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'ROI', value: `${roiValue >= 0 ? '+' : ''}${roiValue.toFixed(2)}%`, highlight: true },
              { label: 'Net Profit / Loss', value: `${netProfit >= 0 ? '+' : ''}$${netProfit.toFixed(2)}` },
              { label: 'Amount Invested', value: `$${cost.toFixed(2)}` },
              { label: 'Amount Returned', value: `$${gain.toFixed(2)}` },
            ]}
          />

          {/* Visual ROI indicator */}
          <div class="mt-4">
            <div class="h-3 bg-gray-200 rounded-full overflow-hidden relative">
              {roiValue >= 0 ? (
                <div
                  class="h-full bg-green-500 rounded-full transition-all"
                  style={`width: ${Math.min(roiValue, 200) / 2}%`}
                />
              ) : (
                <div
                  class="h-full bg-red-500 rounded-full transition-all"
                  style={`width: ${Math.min(Math.abs(roiValue), 100)}%`}
                />
              )}
            </div>
            <div class={`text-center text-sm font-medium mt-1 ${roiColor}`}>
              {roiValue >= 0 ? 'Profit' : 'Loss'}
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
