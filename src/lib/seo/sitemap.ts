/**
 * Sitemap helper for multi-language URL generation.
 */

import { LOCALES } from '../../i18n/locales';

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  alternates: Array<{ hreflang: string; href: string }>;
}

export function generateSitemapEntry(
  category: string,
  slug: string,
  lastUpdated: string,
  priority: 'high' | 'medium' | 'low'
): SitemapEntry[] {
  const priorityMap = { high: 0.8, medium: 0.6, low: 0.4 };

  return Object.entries(LOCALES).map(([code, locale]) => ({
    url: `https://calchub.com/${code}/${category}/${slug}/`,
    lastmod: lastUpdated,
    changefreq: 'monthly',
    priority: priorityMap[priority],
    alternates: Object.entries(LOCALES).map(([altCode, altLocale]) => ({
      hreflang: altLocale.isoCode,
      href: `https://calchub.com/${altCode}/${category}/${slug}/`,
    })),
  }));
}
