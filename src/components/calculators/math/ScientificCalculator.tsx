import { useState } from 'preact/hooks';
import { factorial, logBase, combination, permutation } from '../../../lib/formulas/math';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

type OpCategory = 'trig' | 'log' | 'power' | 'combo';

const CATEGORIES: { value: OpCategory; label: string }[] = [
  { value: 'trig', label: 'Trigonometry' },
  { value: 'log', label: 'Logarithms' },
  { value: 'power', label: 'Powers & Roots' },
  { value: 'combo', label: 'Combinatorics' },
];

export default function ScientificCalculator({ defaults, lang }: Props) {
  const [category, setCategory] = useState<OpCategory>('trig');
  const [val, setVal] = useState('');
  const [val2, setVal2] = useState('');
  const [angleUnit, setAngleUnit] = useState('degrees');

  const v = parseFloat(val);
  const v2 = parseFloat(val2);
  const hasV = !isNaN(v);
  const hasV2 = !isNaN(v2);

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const computeResults = () => {
    if (!hasV) return null;

    if (category === 'trig') {
      const angle = angleUnit === 'degrees' ? toRad(v) : v;
      return [
        { label: 'sin', value: Math.sin(angle).toFixed(8) },
        { label: 'cos', value: Math.cos(angle).toFixed(8) },
        { label: 'tan', value: Math.abs(Math.cos(angle)) < 1e-10 ? 'undefined' : Math.tan(angle).toFixed(8) },
        { label: 'asin', value: (v >= -1 && v <= 1) ? (angleUnit === 'degrees' ? (Math.asin(v) * 180 / Math.PI).toFixed(4) + '°' : Math.asin(v).toFixed(8) + ' rad') : '—' },
        { label: 'acos', value: (v >= -1 && v <= 1) ? (angleUnit === 'degrees' ? (Math.acos(v) * 180 / Math.PI).toFixed(4) + '°' : Math.acos(v).toFixed(8) + ' rad') : '—' },
        { label: 'atan', value: angleUnit === 'degrees' ? (Math.atan(v) * 180 / Math.PI).toFixed(4) + '°' : Math.atan(v).toFixed(8) + ' rad' },
      ];
    }

    if (category === 'log') {
      return [
        { label: 'ln (natural log)', value: v > 0 ? Math.log(v).toFixed(8) : '—' },
        { label: 'log₁₀', value: v > 0 ? Math.log10(v).toFixed(8) : '—' },
        { label: 'log₂', value: v > 0 ? logBase(v, 2).toFixed(8) : '—' },
        ...(hasV2 && v2 > 0 && v2 !== 1 ? [{ label: `log base ${v2}`, value: v > 0 ? logBase(v, v2).toFixed(8) : '—' }] : []),
        { label: 'eˣ', value: Math.exp(v).toFixed(8) },
        { label: '10ˣ', value: Math.pow(10, v).toFixed(8) },
      ];
    }

    if (category === 'power') {
      const base = v;
      const exp = hasV2 ? v2 : 2;
      return [
        { label: `${base}^${exp}`, value: Math.pow(base, exp).toFixed(8), highlight: true },
        { label: '√x', value: v >= 0 ? Math.sqrt(v).toFixed(8) : '—' },
        { label: '∛x', value: Math.cbrt(v).toFixed(8) },
        { label: 'x!', value: v >= 0 && v <= 170 && Number.isInteger(v) ? factorial(v).toLocaleString() : v >= 0 ? '—' : '—' },
        { label: '|x|', value: Math.abs(v).toFixed(8) },
        { label: '1/x', value: v !== 0 ? (1 / v).toFixed(8) : '—' },
      ];
    }

    if (category === 'combo' && hasV2) {
      const n = Math.round(v);
      const r = Math.round(v2);
      return [
        { label: `C(${n}, ${r})`, value: combination(n, r).toLocaleString(), highlight: true },
        { label: `P(${n}, ${r})`, value: permutation(n, r).toLocaleString() },
        { label: `${n}!`, value: n >= 0 && n <= 170 ? factorial(n).toLocaleString() : '—' },
        { label: `${r}!`, value: r >= 0 && r <= 170 ? factorial(r).toLocaleString() : '—' },
      ];
    }

    return null;
  };

  const results = computeResults();

  return (
    <CalculatorShell>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <SelectField label="Category" value={category} onChange={(v) => setCategory(v as OpCategory)} options={CATEGORIES} />
        {category === 'trig' && (
          <SelectField
            label="Angle Unit"
            value={angleUnit}
            onChange={setAngleUnit}
            options={[
              { value: 'degrees', label: 'Degrees' },
              { value: 'radians', label: 'Radians' },
            ]}
          />
        )}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label={category === 'combo' ? 'n' : 'Value'}
          value={val}
          onChange={setVal}
          step={category === 'combo' ? 1 : 0.001}
          placeholder="0"
        />
        {(category === 'log' || category === 'power' || category === 'combo') && (
          <InputField
            label={category === 'combo' ? 'r' : category === 'log' ? 'Custom Base' : 'Exponent'}
            value={val2}
            onChange={setVal2}
            step={category === 'combo' ? 1 : 0.001}
            placeholder={category === 'combo' ? '0' : '2'}
          />
        )}
      </div>

      {results && (
        <div class="mt-6">
          <ResultDisplay items={results} />
        </div>
      )}
    </CalculatorShell>
  );
}
