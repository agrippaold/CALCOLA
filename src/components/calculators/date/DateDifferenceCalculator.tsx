import { useState } from 'preact/hooks';
import { dateDifference } from '../../../lib/formulas/date';
import CalculatorShell from '../base/CalculatorShell';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

export default function DateDifferenceCalculator({ defaults, lang }: Props) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const hasInput = startDate !== '' && endDate !== '';
  const result = hasInput ? dateDifference(startDate, endDate) : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onInput={(e) => setStartDate((e.target as HTMLInputElement).value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onInput={(e) => setEndDate((e.target as HTMLInputElement).value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {hasInput && result && result.totalDays > 0 && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: 'Difference',
                value: `${result.years} years, ${result.months} months, ${result.days} days`,
                highlight: true,
              },
              { label: 'Total Days', value: result.totalDays.toLocaleString() },
              { label: 'Total Weeks', value: `${result.weeks} weeks, ${result.totalDays % 7} days` },
              { label: 'Total Hours', value: (result.totalDays * 24).toLocaleString() },
              { label: 'Total Minutes', value: (result.totalDays * 24 * 60).toLocaleString() },
            ]}
          />
        </div>
      )}
    </CalculatorShell>
  );
}
