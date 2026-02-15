import { useState } from 'preact/hooks';
import { charCount, wordCount, readingTime } from '../../../lib/formulas/text';
import CalculatorShell from '../base/CalculatorShell';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

const LIMITS = [
  { name: 'Twitter/X', limit: 280 },
  { name: 'SMS', limit: 160 },
  { name: 'Meta Title', limit: 60 },
  { name: 'Meta Description', limit: 160 },
];

export default function CharacterCounter({ defaults, lang }: Props) {
  const [text, setText] = useState('');

  const chars = charCount(text);
  const words = wordCount(text);
  const readTime = readingTime(text);

  return (
    <CalculatorShell>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Enter or paste your text</label>
        <textarea
          value={text}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] font-mono text-sm"
          placeholder="Type or paste your text here..."
        />
      </div>

      <div class="mt-4">
        <ResultDisplay
          items={[
            { label: 'Characters', value: chars.total.toLocaleString(), highlight: true },
            { label: 'Without Spaces', value: chars.withoutSpaces.toLocaleString() },
            { label: 'Words', value: words.toLocaleString() },
            { label: 'Lines', value: chars.lines.toLocaleString() },
            { label: 'Sentences', value: chars.sentences.toLocaleString() },
            { label: 'Reading Time', value: `~${readTime} min` },
          ]}
        />
      </div>

      {/* Character limit indicators */}
      {chars.total > 0 && (
        <div class="mt-4 space-y-2">
          <p class="text-sm font-medium text-gray-700">Character Limits</p>
          {LIMITS.map(({ name, limit }) => {
            const pct = Math.min((chars.total / limit) * 100, 100);
            const over = chars.total > limit;
            return (
              <div key={name}>
                <div class="flex justify-between text-xs text-gray-500 mb-0.5">
                  <span>{name}</span>
                  <span class={over ? 'text-red-600 font-medium' : ''}>
                    {chars.total}/{limit} {over ? `(${chars.total - limit} over)` : ''}
                  </span>
                </div>
                <div class="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    class={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CalculatorShell>
  );
}
