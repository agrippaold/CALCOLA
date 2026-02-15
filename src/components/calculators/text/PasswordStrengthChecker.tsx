import { useState } from 'preact/hooks';
import { passwordStrength } from '../../../lib/formulas/text';
import CalculatorShell from '../base/CalculatorShell';
import ResultDisplay from '../base/ResultDisplay';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

export default function PasswordStrengthChecker({ defaults, lang }: Props) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const strength = passwordStrength(password);

  const strengthColor = strength.score >= 90 ? 'bg-green-500' :
    strength.score >= 70 ? 'bg-blue-500' :
    strength.score >= 50 ? 'bg-yellow-500' :
    strength.score >= 25 ? 'bg-orange-500' : 'bg-red-500';

  const strengthTextColor = strength.score >= 90 ? 'text-green-700' :
    strength.score >= 70 ? 'text-blue-700' :
    strength.score >= 50 ? 'text-yellow-700' :
    strength.score >= 25 ? 'text-orange-700' : 'text-red-700';

  // Character analysis
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const hasRepeated = /(.)\1{2,}/.test(password);
  const isLong = password.length >= 12;
  const isVeryLong = password.length >= 16;

  // Estimated crack time (simplified)
  const getEstimatedCrackTime = (): string => {
    if (!password) return '-';
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasDigits) poolSize += 10;
    if (hasSpecial) poolSize += 32;
    if (poolSize === 0) poolSize = 26;

    const combinations = Math.pow(poolSize, password.length);
    // Assume 10 billion guesses per second (modern GPU)
    const seconds = combinations / 10_000_000_000;

    if (seconds < 0.001) return 'Instantly';
    if (seconds < 1) return 'Less than a second';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 31536000 * 1_000_000) return `${Math.round(seconds / 31536000 / 1000)}k years`;
    if (seconds < 31536000 * 1_000_000_000) return `${Math.round(seconds / 31536000 / 1_000_000)}M years`;
    return 'Billions of years';
  };

  const checks = [
    { label: 'Lowercase letters (a-z)', pass: hasLower },
    { label: 'Uppercase letters (A-Z)', pass: hasUpper },
    { label: 'Numbers (0-9)', pass: hasDigits },
    { label: 'Special characters (!@#$)', pass: hasSpecial },
    { label: 'At least 12 characters', pass: isLong },
    { label: '16+ characters (recommended)', pass: isVeryLong },
    { label: 'No repeated characters (aaa)', pass: password.length > 0 && !hasRepeated },
  ];

  return (
    <CalculatorShell>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Enter Your Password</label>
          <div class="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              placeholder="Type or paste your password..."
              class="w-full px-3 py-2.5 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
              aria-label="Password to check"
              autocomplete="off"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded"
              type="button"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-400">Your password is never stored or sent anywhere. All checks run locally in your browser.</p>
        </div>
      </div>

      {password && (
        <div class="mt-6 space-y-5">
          {/* Strength meter */}
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-gray-700">Strength</span>
              <span class={`text-sm font-bold ${strengthTextColor}`}>{strength.label}</span>
            </div>
            <div class="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                class={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          </div>

          <ResultDisplay
            items={[
              { label: 'Strength Score', value: `${strength.score}/100`, highlight: true },
              { label: 'Estimated Crack Time', value: getEstimatedCrackTime() },
              { label: 'Password Length', value: `${password.length} characters` },
              { label: 'Character Types Used', value: `${[hasLower, hasUpper, hasDigits, hasSpecial].filter(Boolean).length} of 4` },
            ]}
          />

          {/* Checklist */}
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Security Checklist</h3>
            <div class="space-y-1.5">
              {checks.map((c) => (
                <div key={c.label} class="flex items-center gap-2 text-sm">
                  <span class={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    c.pass ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {c.pass ? '\u2713' : '\u2717'}
                  </span>
                  <span class={c.pass ? 'text-gray-700' : 'text-gray-500'}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          {strength.suggestions.length > 0 && (
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h3 class="text-sm font-medium text-yellow-800 mb-1">Suggestions to Improve</h3>
              <ul class="list-disc list-inside text-sm text-yellow-700 space-y-0.5">
                {strength.suggestions.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </CalculatorShell>
  );
}
