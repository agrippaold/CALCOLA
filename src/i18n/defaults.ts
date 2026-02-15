/**
 * Locale-specific defaults: currency, units, number formatting, text direction.
 * Used by calculators to show locally relevant defaults.
 */

export interface LocaleDefaults {
  currency: string;
  symbol: string;
  unit: 'metric' | 'imperial';
  decimal: string;
  thousands: string;
  dir: 'ltr' | 'rtl';
}

export const LOCALE_DEFAULTS: Record<string, LocaleDefaults> = {
  en:       { currency: 'USD', symbol: '$',    unit: 'imperial', decimal: '.', thousands: ',', dir: 'ltr' },
  es:       { currency: 'EUR', symbol: '€',    unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  'pt-br':  { currency: 'BRL', symbol: 'R$',   unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  fr:       { currency: 'EUR', symbol: '€',    unit: 'metric',   decimal: ',', thousands: ' ', dir: 'ltr' },
  de:       { currency: 'EUR', symbol: '€',    unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  it:       { currency: 'EUR', symbol: '€',    unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  ar:       { currency: 'SAR', symbol: 'ر.س',  unit: 'metric',   decimal: '٫', thousands: '٬', dir: 'rtl' },
  hi:       { currency: 'INR', symbol: '₹',    unit: 'metric',   decimal: '.', thousands: ',', dir: 'ltr' },
  ja:       { currency: 'JPY', symbol: '¥',    unit: 'metric',   decimal: '.', thousands: ',', dir: 'ltr' },
  ko:       { currency: 'KRW', symbol: '₩',    unit: 'metric',   decimal: '.', thousands: ',', dir: 'ltr' },
  ru:       { currency: 'RUB', symbol: '₽',    unit: 'metric',   decimal: ',', thousands: ' ', dir: 'ltr' },
  tr:       { currency: 'TRY', symbol: '₺',    unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  id:       { currency: 'IDR', symbol: 'Rp',   unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  'zh-hans':{ currency: 'CNY', symbol: '¥',    unit: 'metric',   decimal: '.', thousands: ',', dir: 'ltr' },
  pl:       { currency: 'PLN', symbol: 'zł',   unit: 'metric',   decimal: ',', thousands: ' ', dir: 'ltr' },
  nl:       { currency: 'EUR', symbol: '€',    unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  th:       { currency: 'THB', symbol: '฿',    unit: 'metric',   decimal: '.', thousands: ',', dir: 'ltr' },
  sv:       { currency: 'SEK', symbol: 'kr',   unit: 'metric',   decimal: ',', thousands: ' ', dir: 'ltr' },
  ro:       { currency: 'RON', symbol: 'lei',  unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  el:       { currency: 'EUR', symbol: '€',    unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
  cs:       { currency: 'CZK', symbol: 'Kč',   unit: 'metric',   decimal: ',', thousands: ' ', dir: 'ltr' },
  hu:       { currency: 'HUF', symbol: 'Ft',   unit: 'metric',   decimal: ',', thousands: ' ', dir: 'ltr' },
  uk:       { currency: 'UAH', symbol: '₴',    unit: 'metric',   decimal: ',', thousands: ' ', dir: 'ltr' },
  bn:       { currency: 'BDT', symbol: '৳',    unit: 'metric',   decimal: '.', thousands: ',', dir: 'ltr' },
  vi:       { currency: 'VND', symbol: '₫',    unit: 'metric',   decimal: ',', thousands: '.', dir: 'ltr' },
};
