import { useState } from 'preact/hooks';
import { calculateAge } from '../../../lib/formulas/date';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

export default function AgeCalculator({ defaults, lang }: Props) {
  const [birthDate, setBirthDate] = useState('');

  const hasInput = birthDate !== '';
  const result = hasInput ? calculateAge(birthDate) : null;

  return (
    <CalculatorShell>
      <div class="max-w-sm">
        <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input
          type="date"
          value={birthDate}
          onInput={(e) => setBirthDate((e.target as HTMLInputElement).value)}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {hasInput && result && result.totalDays > 0 && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: 'Age',
                value: `${result.years} years, ${result.months} months, ${result.days} days`,
                highlight: true,
              },
              { label: 'Total Days', value: result.totalDays.toLocaleString() },
              { label: 'Total Weeks', value: Math.floor(result.totalDays / 7).toLocaleString() },
              { label: 'Total Months', value: `${result.years * 12 + result.months}` },
            ]}
          />

          {/* Age milestones */}
          <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center text-gray-500">
            <div class={`rounded p-2 ${result.totalDays >= 10000 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div class="font-medium text-gray-700">10,000 days</div>
              <div>{result.totalDays >= 10000 ? 'Reached!' : `${(10000 - result.totalDays).toLocaleString()} to go`}</div>
            </div>
            <div class={`rounded p-2 ${result.totalDays >= 20000 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div class="font-medium text-gray-700">20,000 days</div>
              <div>{result.totalDays >= 20000 ? 'Reached!' : `${(20000 - result.totalDays).toLocaleString()} to go`}</div>
            </div>
            <div class={`rounded p-2 ${result.years >= 50 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div class="font-medium text-gray-700">50 years</div>
              <div>{result.years >= 50 ? 'Reached!' : `${50 - result.years} years to go`}</div>
            </div>
            <div class={`rounded p-2 ${result.years >= 100 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div class="font-medium text-gray-700">100 years</div>
              <div>{result.years >= 100 ? 'Reached!' : `${100 - result.years} years to go`}</div>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
