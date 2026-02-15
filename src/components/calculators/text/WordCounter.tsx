import { useState } from 'preact/hooks';
import { wordCount, charCount, readingTime } from '../../../lib/formulas/text';
import CalculatorShell from '../base/CalculatorShell';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

export default function WordCounter({ defaults, lang }: Props) {
  const [text, setText] = useState('');

  const words = wordCount(text);
  const chars = charCount(text);
  const readTime = readingTime(text);
  const hasInput = text.length > 0;

  return (
    <CalculatorShell>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Enter or paste your text</label>
        <textarea
          value={text}
          onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] font-mono text-sm"
          placeholder="Type or paste your text here..."
        />
      </div>

      <div class="mt-4">
        <ResultDisplay
          items={[
            { label: 'Words', value: words.toLocaleString(), highlight: true },
            { label: 'Characters', value: chars.total.toLocaleString() },
            { label: 'Characters (no spaces)', value: chars.withoutSpaces.toLocaleString() },
            { label: 'Sentences', value: chars.sentences.toLocaleString() },
            { label: 'Paragraphs', value: chars.paragraphs.toLocaleString() },
            { label: 'Reading Time', value: `~${readTime} min` },
          ]}
        />
      </div>

      {hasInput && (
        <div class="mt-4 grid grid-cols-4 gap-2 text-xs text-center text-gray-500">
          <div class="bg-blue-50 rounded p-2">
            <div class="font-medium text-blue-700">Letters</div>
            <div>{chars.letters}</div>
          </div>
          <div class="bg-green-50 rounded p-2">
            <div class="font-medium text-green-700">Digits</div>
            <div>{chars.digits}</div>
          </div>
          <div class="bg-purple-50 rounded p-2">
            <div class="font-medium text-purple-700">Punctuation</div>
            <div>{chars.punctuation}</div>
          </div>
          <div class="bg-orange-50 rounded p-2">
            <div class="font-medium text-orange-700">Lines</div>
            <div>{chars.lines}</div>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
