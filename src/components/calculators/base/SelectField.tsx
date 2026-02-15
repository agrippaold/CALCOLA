interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  id?: string;
}

/**
 * Accessible select dropdown for calculator options.
 * Supports keyboard navigation (arrows, Escape).
 */
export default function SelectField({
  label,
  value,
  onChange,
  options,
  id,
}: Props) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div class="space-y-1">
      <label
        htmlFor={selectId}
        class="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
        aria-label={label}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
