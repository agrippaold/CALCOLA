import { useState } from 'preact/hooks';
import { percentage, percentChange, percentOf, percentIncrease, percentDecrease } from '../../../lib/formulas/math';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

type CalcMode = 'of' | 'is_what' | 'change' | 'increase' | 'decrease';

const MODE_OPTIONS = [
  { value: 'of', label: 'What is X% of Y?' },
  { value: 'is_what', label: 'X is what % of Y?' },
  { value: 'change', label: 'Percent change from X to Y' },
  { value: 'increase', label: 'Increase X by Y%' },
  { value: 'decrease', label: 'Decrease X by Y%' },
];

export default function PercentageCalculator({ defaults, lang }: Props) {
  const [mode, setMode] = useState<string>('of');
  const [valueA, setValueA] = useState('');
  const [valueB, setValueB] = useState('');

  const a = parseFloat(valueA);
  const b = parseFloat(valueB);
  const hasInputs = !isNaN(a) && !isNaN(b);

  let result: number | null = null;
  let resultLabel = '';
  let resultSuffix = '';
  let labelA = '';
  let labelB = '';
  let unitA = '';
  let unitB = '';

  switch (mode as CalcMode) {
    case 'of':
      labelA = 'Percentage'; unitA = '%';
      labelB = 'Value';
      if (hasInputs) { result = percentage(a, b); resultLabel = `${a}% of ${b}`; }
      break;
    case 'is_what':
      labelA = 'Value (X)';
      labelB = 'Total (Y)';
      if (hasInputs) { result = percentOf(a, b); resultLabel = `${a} is of ${b}`; resultSuffix = '%'; }
      break;
    case 'change':
      labelA = 'Old Value';
      labelB = 'New Value';
      if (hasInputs) { result = percentChange(a, b); resultLabel = 'Change'; resultSuffix = '%'; }
      break;
    case 'increase':
      labelA = 'Value';
      labelB = 'Increase by'; unitB = '%';
      if (hasInputs) { result = percentIncrease(a, b); resultLabel = `${a} + ${b}%`; }
      break;
    case 'decrease':
      labelA = 'Value';
      labelB = 'Decrease by'; unitB = '%';
      if (hasInputs) { result = percentDecrease(a, b); resultLabel = `${a} - ${b}%`; }
      break;
  }

  return (
    <CalculatorShell>
      <div class="space-y-4">
        <SelectField
          label="Calculation Type"
          value={mode}
          onChange={setMode}
          options={MODE_OPTIONS}
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label={labelA}
            value={valueA}
            onChange={setValueA}
            step={0.01}
            unit={unitA}
            placeholder="0"
          />
          <InputField
            label={labelB}
            value={valueB}
            onChange={setValueB}
            step={0.01}
            unit={unitB}
            placeholder="0"
          />
        </div>
      </div>

      {result !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              {
                label: resultLabel,
                value: `${result.toFixed(2)}${resultSuffix}`,
                highlight: true,
              },
            ]}
          />
        </div>
      )}
    </CalculatorShell>
  );
}
