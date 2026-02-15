import type { ComponentChildren } from 'preact';

interface ResultItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface Props {
  items: ResultItem[];
  children?: ComponentChildren;
}

/**
 * Rich result display with multiple values and optional child content.
 * Uses aria-live for screen reader announcements on value changes.
 */
export default function ResultDisplay({ items, children }: Props) {
  if (items.length === 0) return null;

  return (
    <div
      class="bg-gray-50 rounded-xl p-5 space-y-3"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {items.map((item) => (
        <div
          key={item.label}
          class={`flex items-center justify-between ${
            item.highlight ? 'text-lg' : 'text-sm'
          }`}
        >
          <span class="text-gray-600">{item.label}</span>
          <span
            class={`font-semibold ${
              item.highlight ? 'text-blue-600 text-2xl' : 'text-gray-900'
            }`}
          >
            {item.value}
          </span>
        </div>
      ))}
      {children}
    </div>
  );
}
