interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  id?: string;
}

/**
 * Accessible slider input with visible value display.
 * Includes ARIA roles for screen readers.
 */
export default function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  id,
}: Props) {
  const sliderId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label
          htmlFor={sliderId}
          class="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <span class="text-sm font-semibold text-blue-600">
          {value}{unit ? ` ${unit}` : ''}
        </span>
      </div>
      <input
        id={sliderId}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onInput={(e) => onChange(Number((e.target as HTMLInputElement).value))}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div class="flex justify-between text-xs text-gray-400">
        <span>{min}{unit ? ` ${unit}` : ''}</span>
        <span>{max}{unit ? ` ${unit}` : ''}</span>
      </div>
    </div>
  );
}
