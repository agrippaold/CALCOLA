import type { ComponentChildren } from 'preact';

interface Props {
  title?: string;
  children: ComponentChildren;
}

/**
 * Reusable calculator container shell.
 * Provides consistent card styling and layout for all calculators.
 */
export default function CalculatorShell({ title, children }: Props) {
  return (
    <div class="space-y-6">
      {title && (
        <h2 class="text-xl font-semibold text-gray-800">{title}</h2>
      )}
      {children}
    </div>
  );
}
