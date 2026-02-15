import { useState } from 'preact/hooks';
import { areaRectangle, areaCircle, areaTriangle, areaTrapezoid, areaEllipse } from '../../../lib/formulas/math';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import SelectField from '../base/SelectField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: { unit?: string };
  lang?: string;
}

const SHAPE_OPTIONS = [
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'circle', label: 'Circle' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'trapezoid', label: 'Trapezoid' },
  { value: 'ellipse', label: 'Ellipse' },
];

export default function AreaCalculator({ defaults, lang }: Props) {
  const [shape, setShape] = useState('rectangle');
  const [dim1, setDim1] = useState('');
  const [dim2, setDim2] = useState('');
  const [dim3, setDim3] = useState('');

  const d1 = parseFloat(dim1);
  const d2 = parseFloat(dim2);
  const d3 = parseFloat(dim3);

  let result: number | null = null;
  let formula = '';
  let label1 = '', label2 = '', label3 = '';
  let showDim2 = true, showDim3 = false;

  switch (shape) {
    case 'rectangle':
      label1 = 'Length'; label2 = 'Width';
      if (d1 > 0 && d2 > 0) { result = areaRectangle(d1, d2); formula = `${d1} x ${d2}`; }
      break;
    case 'circle':
      label1 = 'Radius'; showDim2 = false;
      if (d1 > 0) { result = areaCircle(d1); formula = `π × ${d1}²`; }
      break;
    case 'triangle':
      label1 = 'Base'; label2 = 'Height';
      if (d1 > 0 && d2 > 0) { result = areaTriangle(d1, d2); formula = `½ × ${d1} × ${d2}`; }
      break;
    case 'trapezoid':
      label1 = 'Side A'; label2 = 'Side B'; label3 = 'Height'; showDim3 = true;
      if (d1 > 0 && d2 > 0 && d3 > 0) { result = areaTrapezoid(d1, d2, d3); formula = `½ × (${d1} + ${d2}) × ${d3}`; }
      break;
    case 'ellipse':
      label1 = 'Semi-major axis'; label2 = 'Semi-minor axis';
      if (d1 > 0 && d2 > 0) { result = areaEllipse(d1, d2); formula = `π × ${d1} × ${d2}`; }
      break;
  }

  return (
    <CalculatorShell>
      <div class="space-y-4">
        <SelectField
          label="Shape"
          value={shape}
          onChange={(v) => { setShape(v); setDim1(''); setDim2(''); setDim3(''); }}
          options={SHAPE_OPTIONS}
        />
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField
            label={label1}
            value={dim1}
            onChange={setDim1}
            min={0}
            step={0.01}
            placeholder="0"
          />
          {showDim2 && (
            <InputField
              label={label2}
              value={dim2}
              onChange={setDim2}
              min={0}
              step={0.01}
              placeholder="0"
            />
          )}
          {showDim3 && (
            <InputField
              label={label3}
              value={dim3}
              onChange={setDim3}
              min={0}
              step={0.01}
              placeholder="0"
            />
          )}
        </div>
      </div>

      {result !== null && (
        <div class="mt-6">
          <ResultDisplay
            items={[
              { label: 'Area', value: result.toFixed(4), highlight: true },
              { label: 'Formula used', value: formula },
            ]}
          />
        </div>
      )}
    </CalculatorShell>
  );
}
