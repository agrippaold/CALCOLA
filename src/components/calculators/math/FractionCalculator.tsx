import { useState } from 'preact/hooks';
import {
  fractionAdd, fractionSubtract, fractionMultiply, fractionDivide,
  fractionSimplify, fractionToDecimal, decimalToFraction,
} from '../../../lib/formulas/math';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

const OPS = [
  { value: 'add', label: 'Add (+)' },
  { value: 'subtract', label: 'Subtract (−)' },
  { value: 'multiply', label: 'Multiply (×)' },
  { value: 'divide', label: 'Divide (÷)' },
  { value: 'simplify', label: 'Simplify' },
  { value: 'toDecimal', label: 'To Decimal' },
  { value: 'toFraction', label: 'Decimal → Fraction' },
];

export default function FractionCalculator({ defaults, lang }: Props) {
  const [op, setOp] = useState('add');
  const [n1, setN1] = useState('');
  const [d1, setD1] = useState('');
  const [n2, setN2] = useState('');
  const [d2, setD2] = useState('');
  const [decimal, setDecimal] = useState('');

  const needsTwo = ['add', 'subtract', 'multiply', 'divide'].includes(op);
  const isDecimalToFrac = op === 'toFraction';

  let result: { numerator: number; denominator: number } | null = null;
  let decimalResult: number | null = null;
  let hasInput = false;

  const a = parseInt(n1);
  const b = parseInt(d1);
  const c = parseInt(n2);
  const d = parseInt(d2);
  const dec = parseFloat(decimal);

  if (isDecimalToFrac && !isNaN(dec)) {
    result = decimalToFraction(dec);
    hasInput = true;
  } else if (op === 'toDecimal' && !isNaN(a) && !isNaN(b) && b !== 0) {
    decimalResult = fractionToDecimal(a, b);
    hasInput = true;
  } else if (op === 'simplify' && !isNaN(a) && !isNaN(b) && b !== 0) {
    result = fractionSimplify(a, b);
    hasInput = true;
  } else if (needsTwo && !isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d) && b !== 0 && d !== 0) {
    if (op === 'add') result = fractionAdd(a, b, c, d);
    else if (op === 'subtract') result = fractionSubtract(a, b, c, d);
    else if (op === 'multiply') result = fractionMultiply(a, b, c, d);
    else if (op === 'divide' && c !== 0) result = fractionDivide(a, b, c, d);
    hasInput = result !== null;
  }

  const opSymbols: Record<string, string> = {
    add: '+', subtract: '−', multiply: '×', divide: '÷',
  };

  return (
    <CalculatorShell>
      <div class="mb-4">
        <SelectField label="Operation" value={op} onChange={setOp} options={OPS} />
      </div>

      {isDecimalToFrac ? (
        <InputField label="Decimal" value={decimal} onChange={setDecimal} step={0.001} placeholder="0.75" />
      ) : (
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="flex-1">
              <InputField label="Numerator" value={n1} onChange={setN1} step={1} placeholder="1" />
            </div>
            <span class="text-2xl text-gray-400 mt-5">/</span>
            <div class="flex-1">
              <InputField label="Denominator" value={d1} onChange={setD1} step={1} placeholder="4" />
            </div>
          </div>

          {needsTwo && (
            <>
              <div class="text-center text-xl font-bold text-blue-600">{opSymbols[op]}</div>
              <div class="flex items-center gap-2">
                <div class="flex-1">
                  <InputField label="Numerator" value={n2} onChange={setN2} step={1} placeholder="1" />
                </div>
                <span class="text-2xl text-gray-400 mt-5">/</span>
                <div class="flex-1">
                  <InputField label="Denominator" value={d2} onChange={setD2} step={1} placeholder="3" />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {hasInput && (
        <div class="mt-6">
          {result && (
            <ResultDisplay
              items={[
                {
                  label: 'Result',
                  value: result.denominator === 1
                    ? `${result.numerator}`
                    : `${result.numerator}/${result.denominator}`,
                  highlight: true,
                },
                {
                  label: 'Decimal',
                  value: result.denominator !== 0
                    ? (result.numerator / result.denominator).toFixed(6)
                    : '—',
                },
                ...(Math.abs(result.numerator) > result.denominator && result.denominator > 1
                  ? [{
                      label: 'Mixed Number',
                      value: `${Math.trunc(result.numerator / result.denominator)} ${Math.abs(result.numerator % result.denominator)}/${result.denominator}`,
                    }]
                  : []),
              ]}
            />
          )}
          {decimalResult !== null && (
            <ResultDisplay
              items={[
                { label: 'Decimal', value: decimalResult.toFixed(6), highlight: true },
                { label: 'Fraction', value: `${a}/${b}` },
              ]}
            />
          )}
        </div>
      )}
    </CalculatorShell>
  );
}
