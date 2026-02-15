interface Props {
  label: string;
  value: number | string;
  onChange: (value: string) => void;
  type?: 'number' | 'text';
  min?: number;
  max?: number;
  step?: number | string;
  unit?: string;
  placeholder?: string;
  id?: string;
  helpText?: string;
}

/**
 * Accessible input field with label, optional unit suffix, and help text.
 * Supports number and text inputs with ARIA attributes.
 */
export default function InputField({
  label,
  value,
  onChange,
  type = 'number',
  min,
  max,
  step,
  unit,
  placeholder,
  id,
  helpText,
}: Props) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  const helpId = helpText ? `${inputId}-help` : undefined;

  return (
    <div class="space-y-1">
      <label
        htmlFor={inputId}
        class="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div class="relative">
        <input
          id={inputId}
          type={type}
          value={value}
          onInput={(e) => onChange((e.target as HTMLInputElement).value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-label={label}
          aria-describedby={helpId}
          class={`w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${unit ? 'pr-12' : ''}`}
        />
        {unit && (
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {helpText && (
        <p id={helpId} class="text-xs text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}
