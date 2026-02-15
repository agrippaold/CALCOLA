import { useState } from 'preact/hooks';
import { ovulationDate } from '../../../lib/formulas/health';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function OvulationCalculator({ defaults, lang }: Props) {
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState('28');

  const lp = lastPeriod ? new Date(lastPeriod) : null;
  const cl = parseInt(cycleLength) || 28;
  const isValid = lp && !isNaN(lp.getTime()) && cl >= 21 && cl <= 45;

  const result = isValid ? ovulationDate(lp, cl) : null;

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            First Day of Last Period
          </label>
          <input
            type="date"
            value={lastPeriod}
            onInput={(e) => setLastPeriod((e.target as HTMLInputElement).value)}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <InputField
          label="Average Cycle Length"
          value={cycleLength}
          onChange={setCycleLength}
          min={21}
          max={45}
          step={1}
          unit="days"
          placeholder="28"
        />
      </div>

      {result && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Estimated Ovulation', value: formatDate(result.ovulation), highlight: true },
              { label: 'Fertile Window Start', value: formatDate(result.fertileStart) },
              { label: 'Fertile Window End', value: formatDate(result.fertileEnd) },
              { label: 'Next Expected Period', value: formatDate(result.nextPeriod) },
            ]}
          />

          {/* Cycle visualization */}
          <div class="mt-4">
            <div class="text-xs text-gray-500 mb-1">Cycle overview ({cl} days)</div>
            <div class="h-4 rounded-full overflow-hidden flex">
              {/* Menstruation (days 1-5) */}
              <div class="bg-red-400 h-full" style={`width: ${(5 / cl) * 100}%`} />
              {/* Pre-fertile */}
              <div class="bg-gray-200 h-full" style={`width: ${((cl - 14 - 5 - 5) / cl) * 100}%`} />
              {/* Fertile window (6 days) */}
              <div class="bg-green-400 h-full" style={`width: ${(6 / cl) * 100}%`} />
              {/* Luteal phase */}
              <div class="bg-gray-300 h-full" style={`width: ${(13 / cl) * 100}%`} />
            </div>
            <div class="flex text-xs text-gray-400 mt-1 gap-3">
              <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-400 rounded-sm inline-block" /> Period</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 bg-green-400 rounded-sm inline-block" /> Fertile</span>
              <span class="flex items-center gap-1"><span class="w-3 h-3 bg-gray-300 rounded-sm inline-block" /> Luteal</span>
            </div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
