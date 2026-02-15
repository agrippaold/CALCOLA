import { useState } from 'preact/hooks';
import { historicalInflation, US_CPI_DATA } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import SelectField from '../base/SelectField';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

const years = Object.keys(US_CPI_DATA).map(Number).sort((a, b) => a - b);
const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));

export default function HistoricalInflationCalculator({ defaults, lang }: Props) {
  const [amount, setAmount] = useState('100');
  const [fromYear, setFromYear] = useState('1970');
  const [toYear, setToYear] = useState('2025');

  const a = parseFloat(amount);
  const from = parseInt(fromYear);
  const to = parseInt(toYear);

  const result = a > 0 ? historicalInflation(a, from, to) : null;

  const presets = [
    { label: '1950', from: '1950', to: '2025' },
    { label: '1970', from: '1970', to: '2025' },
    { label: '1990', from: '1990', to: '2025' },
    { label: '2000', from: '2000', to: '2025' },
    { label: '2010', from: '2010', to: '2025' },
    { label: '2020', from: '2020', to: '2025' },
  ];

  return (
    <CalculatorShell>
      <div class="space-y-4">
        <InputField
          label="Amount"
          value={amount}
          onChange={setAmount}
          min={1}
          max={1_000_000_000}
          step={100}
          unit="$"
          placeholder="100"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="From Year"
            value={fromYear}
            onChange={setFromYear}
            options={yearOptions}
          />
          <SelectField
            label="To Year"
            value={toYear}
            onChange={setToYear}
            options={yearOptions}
          />
        </div>

        {/* Quick presets */}
        <div>
          <div class="text-xs text-gray-500 mb-2">Quick: What was ${amount || '100'} worth from...</div>
          <div class="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => { setFromYear(p.from); setToYear(p.to); }}
                class={`px-3 py-1 text-sm rounded-md border transition-colors ${
                  fromYear === p.from && toYear === p.to
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: `$${a.toLocaleString()} in ${from} is worth in ${to}`,
                value: `$${result.adjustedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                highlight: true,
              },
              { label: 'Cumulative Inflation', value: `${result.cumulativeRate.toFixed(1)}%` },
              { label: 'Average Annual Rate', value: `${result.avgAnnualRate.toFixed(2)}%` },
              { label: 'Price Multiplier', value: `${(result.adjustedValue / a).toFixed(2)}x` },
            ]}
          />

          {/* Visual multiplier bar */}
          <div class="mt-4">
            <div class="text-xs text-gray-500 mb-1">
              {from < to ? 'Price increase' : 'Price decrease'} ({from} to {to})
            </div>
            <div class="h-6 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                class={`h-full rounded-full transition-all ${
                  result.cumulativeRate > 0 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min(Math.abs(result.cumulativeRate) / (Math.abs(result.cumulativeRate) + 100) * 100, 95)}%`,
                }}
              />
              <span class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-800">
                {result.cumulativeRate > 0 ? '+' : ''}{result.cumulativeRate.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Decade breakdown */}
          {from < to && to - from >= 20 && (
            <div class="mt-4">
              <div class="text-sm font-medium text-gray-700 mb-2">Decade Breakdown</div>
              <div class="space-y-1">
                {(() => {
                  const decades: { label: string; rate: string }[] = [];
                  let y = Math.ceil(from / 10) * 10;
                  if (y === from) y += 10;
                  let prev = from;
                  while (y <= to) {
                    const r = historicalInflation(100, prev, y);
                    if (r) decades.push({ label: `${prev}-${y}`, rate: `${r.cumulativeRate.toFixed(1)}%` });
                    prev = y;
                    y += 10;
                  }
                  if (prev < to) {
                    const r = historicalInflation(100, prev, to);
                    if (r) decades.push({ label: `${prev}-${to}`, rate: `${r.cumulativeRate.toFixed(1)}%` });
                  }
                  return decades.map((d) => (
                    <div key={d.label} class="flex justify-between text-sm">
                      <span class="text-gray-600">{d.label}</span>
                      <span class="font-medium">{d.rate}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  );
}
