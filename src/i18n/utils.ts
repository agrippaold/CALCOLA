/**
 * i18n utility functions.
 * getLang() — extract language from URL
 * t() — translate UI string
 * getLocalePath() — build localized URL path
 * formatNumber() — format number per locale conventions
 */

import { LOCALES, DEFAULT_LOCALE, type LocaleConfig } from './locales';
import { LOCALE_DEFAULTS, type LocaleDefaults } from './defaults';
import { UI_STRINGS } from './ui';

/**
 * Extract language code from a URL pathname.
 * /en/finance/mortgage-calculator/ → "en"
 * /it/salute/calcolo-bmi/ → "it"
 */
export function getLang(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0] || DEFAULT_LOCALE;
  return firstSegment in LOCALES ? firstSegment : DEFAULT_LOCALE;
}

/**
 * Get translated UI string for the given key and language.
 * Falls back to English if translation is missing.
 */
export function t(key: string, lang: string): string {
  const langStrings = UI_STRINGS[lang];
  if (langStrings && key in langStrings) {
    return langStrings[key];
  }
  // Fallback to English
  const enStrings = UI_STRINGS[DEFAULT_LOCALE];
  if (enStrings && key in enStrings) {
    return enStrings[key];
  }
  return key;
}

/**
 * Build a localized URL path.
 * getLocalePath('en', 'health', 'bmi-calculator') → "/en/health/bmi-calculator/"
 */
export function getLocalePath(lang: string, ...segments: string[]): string {
  const path = ['', lang, ...segments.filter(Boolean)].join('/');
  return path.endsWith('/') ? path : path + '/';
}

/**
 * Get the locale configuration for a language code.
 */
export function getLocaleConfig(lang: string): LocaleConfig {
  return LOCALES[lang] || LOCALES[DEFAULT_LOCALE];
}

/**
 * Get locale defaults (currency, units, number format) for a language.
 */
export function getLocaleDefaults(lang: string): LocaleDefaults {
  return LOCALE_DEFAULTS[lang] || LOCALE_DEFAULTS[DEFAULT_LOCALE];
}

/**
 * Format a number according to locale conventions.
 * formatNumber(1234.56, 'it') → "1.234,56"
 * formatNumber(1234.56, 'en') → "1,234.56"
 */
export function formatNumber(value: number, lang: string, decimals?: number): string {
  const defaults = getLocaleDefaults(lang);
  const parts = (decimals !== undefined ? value.toFixed(decimals) : value.toString()).split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  // Add thousands separators
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, defaults.thousands);

  if (decPart !== undefined) {
    return formatted + defaults.decimal + decPart;
  }
  return formatted;
}

/**
 * Format currency amount for a locale.
 * formatCurrency(1234.56, 'it') → "€1.234,56"
 * formatCurrency(1234.56, 'en') → "$1,234.56"
 */
export function formatCurrency(value: number, lang: string): string {
  const defaults = getLocaleDefaults(lang);
  const formatted = formatNumber(value, lang, 2);
  return defaults.symbol + formatted;
}
