import { useState, useCallback } from 'preact/hooks';
import { generatePassword, passwordStrength } from '../../../lib/formulas/text';
import CalculatorShell from '../base/CalculatorShell';
import InputField from '../base/InputField';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

export default function PasswordGenerator({ defaults, lang }: Props) {
  const [length, setLength] = useState('16');
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const pw = generatePassword(parseInt(length) || 16, {
      uppercase: upper,
      lowercase: lower,
      digits,
      symbols,
    });
    setPassword(pw);
    setCopied(false);
  }, [length, upper, lower, digits, symbols]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = passwordStrength(password);

  const strengthColor = strength.score >= 90 ? 'bg-green-500' :
    strength.score >= 70 ? 'bg-blue-500' :
    strength.score >= 50 ? 'bg-yellow-500' :
    strength.score >= 25 ? 'bg-orange-500' : 'bg-red-500';

  return (
    <CalculatorShell>
      <div class="space-y-4">
        <InputField
          label="Password Length"
          value={length}
          onChange={setLength}
          min={4}
          max={128}
          step={1}
          placeholder="16"
        />

        <div class="flex flex-wrap gap-3">
          {[
            { label: 'Uppercase (A-Z)', checked: upper, onChange: setUpper },
            { label: 'Lowercase (a-z)', checked: lower, onChange: setLower },
            { label: 'Numbers (0-9)', checked: digits, onChange: setDigits },
            { label: 'Symbols (!@#$)', checked: symbols, onChange: setSymbols },
          ].map(opt => (
            <label class="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={(e) => opt.onChange((e.target as HTMLInputElement).checked)}
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {opt.label}
            </label>
          ))}
        </div>

        <button
          onClick={generate}
          class="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Generate Password
        </button>
      </div>

      {password && (
        <div class="mt-6">
          <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
            <code class="flex-1 text-lg font-mono break-all select-all">{password}</code>
            <button
              onClick={copyToClipboard}
              class="flex-shrink-0 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Strength meter */}
          <div class="mt-4">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600">Strength</span>
              <span class="font-medium">{strength.label}</span>
            </div>
            <div class="bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                class={`h-full rounded-full transition-all ${strengthColor}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>

          <ResultDisplay
            items={[
              { label: 'Strength Score', value: `${strength.score}/100`, highlight: true },
              { label: 'Length', value: `${password.length} characters` },
              { label: 'Character Types', value: [
                upper && 'uppercase',
                lower && 'lowercase',
                digits && 'digits',
                symbols && 'symbols',
              ].filter(Boolean).join(', ') },
            ]}
          />

          {strength.suggestions.length > 0 && (
            <div class="mt-3 text-sm text-gray-600">
              <p class="font-medium mb-1">Suggestions:</p>
              <ul class="list-disc list-inside">
                {strength.suggestions.map(s => <li>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  );
}
