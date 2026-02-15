/**
 * Text utility formulas — pure functions, no UI dependencies.
 */

/**
 * Count words in a text string.
 */
export function wordCount(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Count characters in a text string.
 */
export function charCount(
  text: string,
): { total: number; withoutSpaces: number; letters: number; digits: number; punctuation: number; lines: number; sentences: number; paragraphs: number } {
  if (!text) {
    return { total: 0, withoutSpaces: 0, letters: 0, digits: 0, punctuation: 0, lines: 0, sentences: 0, paragraphs: 0 };
  }

  const total = text.length;
  const withoutSpaces = text.replace(/\s/g, '').length;
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const digits = (text.match(/\d/g) || []).length;
  const punctuation = (text.match(/[^\w\s]/g) || []).length;
  const lines = text.split('\n').length;
  const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length || (text.trim() ? 1 : 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || (text.trim() ? 1 : 0);

  return { total, withoutSpaces, letters, digits, punctuation, lines, sentences, paragraphs };
}

/**
 * Estimate reading time in minutes.
 * Average adult reads ~250 words per minute.
 */
export function readingTime(text: string, wpm: number = 250): number {
  const words = wordCount(text);
  return Math.ceil(words / wpm);
}

/**
 * Generate a random password.
 */
export function generatePassword(
  length: number = 16,
  options: {
    uppercase?: boolean;
    lowercase?: boolean;
    digits?: boolean;
    symbols?: boolean;
  } = {},
): string {
  const {
    uppercase = true,
    lowercase = true,
    digits = true,
    symbols = true,
  } = options;

  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (digits) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Estimate password strength (0-100).
 */
export function passwordStrength(password: string): {
  score: number;
  label: string;
  suggestions: string[];
} {
  if (!password) return { score: 0, label: 'None', suggestions: ['Enter a password'] };

  let score = 0;
  const suggestions: string[] = [];

  // Length scoring
  if (password.length >= 8) score += 20;
  else suggestions.push('Use at least 8 characters');

  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety
  if (/[a-z]/.test(password)) score += 10;
  else suggestions.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 10;
  else suggestions.push('Add uppercase letters');

  if (/\d/.test(password)) score += 10;
  else suggestions.push('Add numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  else suggestions.push('Add special characters');

  // Bonus for mixed types
  const types = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter(r => r.test(password)).length;
  if (types >= 3) score += 10;
  if (types >= 4) score += 5;

  // Penalty for common patterns
  if (/^[a-zA-Z]+$/.test(password)) score = Math.max(score - 10, 0);
  if (/^[0-9]+$/.test(password)) score = Math.max(score - 15, 0);
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(score - 10, 0);
    suggestions.push('Avoid repeated characters');
  }

  score = Math.min(100, score);

  let label: string;
  if (score < 25) label = 'Very Weak';
  else if (score < 50) label = 'Weak';
  else if (score < 70) label = 'Fair';
  else if (score < 90) label = 'Strong';
  else label = 'Very Strong';

  return { score, label, suggestions };
}

/**
 * Calculate GPA from grades and credit hours.
 * Uses standard 4.0 scale: A=4, B=3, C=2, D=1, F=0.
 * Supports +/- modifiers (A-=3.7, B+=3.3, etc.)
 */
export function calculateGPA(
  courses: { grade: string; credits: number }[],
): { gpa: number; totalCredits: number; totalPoints: number } {
  const gradePoints: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  };

  let totalCredits = 0;
  let totalPoints = 0;

  for (const course of courses) {
    const points = gradePoints[course.grade.toUpperCase()];
    if (points !== undefined && course.credits > 0) {
      totalCredits += course.credits;
      totalPoints += points * course.credits;
    }
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

  return {
    gpa: Math.round(gpa * 100) / 100,
    totalCredits,
    totalPoints: Math.round(totalPoints * 100) / 100,
  };
}
