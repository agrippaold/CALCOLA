/**
 * Configuration for all 25 supported locales.
 * ISO codes, native names, English names, and text direction.
 */

export interface LocaleConfig {
  code: string;
  isoCode: string;       // ISO hreflang code (pt-BR, zh-Hans, etc.)
  name: string;          // Native name
  nameEn: string;        // English name
  dir: 'ltr' | 'rtl';
  tier: 1 | 2 | 3;      // Launch priority tier
}

export const LOCALES: Record<string, LocaleConfig> = {
  // Tier 1 — Launch languages
  en:       { code: 'en',      isoCode: 'en',      name: 'English',    nameEn: 'English',              dir: 'ltr', tier: 1 },
  es:       { code: 'es',      isoCode: 'es',      name: 'Español',    nameEn: 'Spanish',              dir: 'ltr', tier: 1 },
  'pt-br':  { code: 'pt-br',   isoCode: 'pt-BR',   name: 'Português',  nameEn: 'Portuguese (Brazil)',   dir: 'ltr', tier: 1 },
  fr:       { code: 'fr',      isoCode: 'fr',      name: 'Français',   nameEn: 'French',               dir: 'ltr', tier: 1 },
  de:       { code: 'de',      isoCode: 'de',      name: 'Deutsch',    nameEn: 'German',               dir: 'ltr', tier: 1 },
  it:       { code: 'it',      isoCode: 'it',      name: 'Italiano',   nameEn: 'Italian',              dir: 'ltr', tier: 1 },

  // Tier 2 — High-traffic languages
  ar:       { code: 'ar',      isoCode: 'ar',      name: 'العربية',     nameEn: 'Arabic',               dir: 'rtl', tier: 2 },
  hi:       { code: 'hi',      isoCode: 'hi',      name: 'हिन्दी',      nameEn: 'Hindi',                dir: 'ltr', tier: 2 },
  ja:       { code: 'ja',      isoCode: 'ja',      name: '日本語',      nameEn: 'Japanese',             dir: 'ltr', tier: 2 },
  ko:       { code: 'ko',      isoCode: 'ko',      name: '한국어',      nameEn: 'Korean',               dir: 'ltr', tier: 2 },
  ru:       { code: 'ru',      isoCode: 'ru',      name: 'Русский',    nameEn: 'Russian',              dir: 'ltr', tier: 2 },
  tr:       { code: 'tr',      isoCode: 'tr',      name: 'Türkçe',     nameEn: 'Turkish',              dir: 'ltr', tier: 2 },
  id:       { code: 'id',      isoCode: 'id',      name: 'Indonesia',  nameEn: 'Indonesian',           dir: 'ltr', tier: 2 },
  'zh-hans':{ code: 'zh-hans', isoCode: 'zh-Hans', name: '简体中文',    nameEn: 'Chinese (Simplified)', dir: 'ltr', tier: 2 },

  // Tier 3 — Additional languages
  pl:       { code: 'pl',      isoCode: 'pl',      name: 'Polski',     nameEn: 'Polish',               dir: 'ltr', tier: 3 },
  nl:       { code: 'nl',      isoCode: 'nl',      name: 'Nederlands', nameEn: 'Dutch',                dir: 'ltr', tier: 3 },
  th:       { code: 'th',      isoCode: 'th',      name: 'ไทย',        nameEn: 'Thai',                 dir: 'ltr', tier: 3 },
  sv:       { code: 'sv',      isoCode: 'sv',      name: 'Svenska',    nameEn: 'Swedish',              dir: 'ltr', tier: 3 },
  ro:       { code: 'ro',      isoCode: 'ro',      name: 'Română',     nameEn: 'Romanian',             dir: 'ltr', tier: 3 },
  el:       { code: 'el',      isoCode: 'el',      name: 'Ελληνικά',   nameEn: 'Greek',                dir: 'ltr', tier: 3 },
  cs:       { code: 'cs',      isoCode: 'cs',      name: 'Čeština',    nameEn: 'Czech',                dir: 'ltr', tier: 3 },
  hu:       { code: 'hu',      isoCode: 'hu',      name: 'Magyar',     nameEn: 'Hungarian',            dir: 'ltr', tier: 3 },
  uk:       { code: 'uk',      isoCode: 'uk',      name: 'Українська', nameEn: 'Ukrainian',            dir: 'ltr', tier: 3 },
  bn:       { code: 'bn',      isoCode: 'bn',      name: 'বাংলা',       nameEn: 'Bengali',              dir: 'ltr', tier: 3 },
  vi:       { code: 'vi',      isoCode: 'vi',      name: 'Tiếng Việt', nameEn: 'Vietnamese',           dir: 'ltr', tier: 3 },
};

export const SUPPORTED_LOCALE_CODES = Object.keys(LOCALES);
export const DEFAULT_LOCALE = 'en';
