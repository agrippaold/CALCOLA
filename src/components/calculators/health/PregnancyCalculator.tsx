import { useState } from 'preact/hooks';
import { pregnancyDueDate, gestationalAge } from '../../../lib/formulas/health';
import CalculatorShell from '../base/CalculatorShell';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function trimesterLabel(weeks: number): string {
  if (weeks < 13) return 'First Trimester (weeks 1-12)';
  if (weeks < 27) return 'Second Trimester (weeks 13-26)';
  if (weeks <= 40) return 'Third Trimester (weeks 27-40)';
  return 'Past due date';
}

export default function PregnancyCalculator({ defaults, lang }: Props) {
  const [lmpDate, setLmpDate] = useState('');

  const lmp = lmpDate ? new Date(lmpDate) : null;
  const isValid = lmp && !isNaN(lmp.getTime());

  const dueDate = isValid ? pregnancyDueDate(lmp) : null;
  const ga = isValid ? gestationalAge(lmp) : null;
  const weeksLeft = ga ? 40 - ga.weeks : null;
  const trimester = ga ? trimesterLabel(ga.weeks) : null;
  const progress = ga ? Math.min((ga.totalDays / 280) * 100, 100) : 0;

  return (
    <CalculatorShell>
      <div class="max-w-sm">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          First Day of Last Period (LMP)
        </label>
        <input
          type="date"
          value={lmpDate}
          onInput={(e) => setLmpDate((e.target as HTMLInputElement).value)}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {dueDate && ga && weeksLeft !== null && trimester && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Estimated Due Date', value: formatDate(dueDate), highlight: true },
              { label: 'Current Gestational Age', value: `${ga.weeks} weeks, ${ga.days} days` },
              { label: 'Trimester', value: trimester },
              { label: 'Weeks Remaining', value: `${Math.max(weeksLeft, 0)} weeks` },
            ]}
          />

          {/* Pregnancy progress bar */}
          <div class="mt-4">
            <div class="text-xs text-gray-500 mb-1">Pregnancy progress</div>
            <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full bg-pink-500 rounded-full transition-all"
                style={`width: ${progress}%`}
              />
            </div>
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>Week 0</span>
              <span>Week 13</span>
              <span>Week 27</span>
              <span>Week 40</span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
