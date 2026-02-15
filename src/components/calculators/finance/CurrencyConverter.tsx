import { useState } from 'preact/hooks';
import { currencyConvert } from '../../../lib/formulas/finance';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
];

// Static reference rates (USD-based, approximate mid-market Feb 2026)
const RATES_TO_USD: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.26,
  JPY: 0.0066,
  CAD: 0.74,
  AUD: 0.65,
  CHF: 1.13,
  CNY: 0.138,
  INR: 0.0119,
  BRL: 0.174,
};

function getRate(from: string, to: string): number {
  const fromToUsd = RATES_TO_USD[from] || 1;
  const toToUsd = RATES_TO_USD[to] || 1;
  return fromToUsd / toToUsd;
}

export default function CurrencyConverter({ defaults, lang }: Props) {
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');

  const a = parseFloat(amount);
  const rate = getRate(from, to);
  const result = a > 0 ? currencyConvert(a, rate) : null;
  const inverseRate = rate > 0 ? 1 / rate : 0;

  const fromCurrency = CURRENCIES.find((c) => c.code === from);
  const toCurrency = CURRENCIES.find((c) => c.code === to);

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField
          label="Amount"
          value={amount}
          onChange={setAmount}
          min={0.01}
          max={1_000_000_000}
          step={1}
          unit={fromCurrency?.symbol || '$'}
          placeholder="1000"
        />
        <SelectField
          label="From"
          value={from}
          onChange={setFrom}
          options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }))}
        />
        <SelectField
          label="To"
          value={to}
          onChange={setTo}
          options={CURRENCIES.map((c) => ({ value: c.code, label: `${c.code} - ${c.name}` }))}
        />
      </div>

      {result !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: `${a.toFixed(2)} ${from}`,
                value: `${toCurrency?.symbol || ''}${result.toFixed(2)} ${to}`,
                highlight: true,
              },
              { label: `1 ${from}`, value: `${rate.toFixed(6)} ${to}` },
              { label: `1 ${to}`, value: `${inverseRate.toFixed(6)} ${from}` },
            ]}
          />
          <p class="text-xs text-gray-400 mt-3">
            Rates are approximate mid-market reference rates for educational purposes.
            Always check with your bank or provider for live transaction rates.
          </p>
        </div>
      )}
    </CalculatorShell>
  );
}
