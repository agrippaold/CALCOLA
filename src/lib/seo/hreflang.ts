/**
 * Hreflang tag generator.
 * Rules (non-negotiable):
 * 1. Every page has hreflang for ALL 25 language versions
 * 2. Self-referencing tag (IT page links itself as "it")
 * 3. Bidirectional links (EN→IT AND IT→EN)
 * 4. x-default always points to EN
 * 5. Correct ISO codes: "pt-BR" not "pt-br", "zh-Hans" not "zh-cn"
 */

import { LOCALES } from '../../i18n/locales';

export interface HreflangTag {
  hreflang: string;
  href: string;
}

export function generateHreflangTags(
  category: string,
  slug: string,
  currentLang: string
): HreflangTag[] {
  const tags: HreflangTag[] = [];

  // x-default (always EN)
  tags.push({
    hreflang: 'x-default',
    href: `https://calchub.com/en/${category}/${slug}/`,
  });

  // Tag for every language (including self-referencing)
  for (const [code, locale] of Object.entries(LOCALES)) {
    tags.push({
      hreflang: locale.isoCode,
      href: `https://calchub.com/${code}/${category}/${slug}/`,
    });
  }

  return tags;
}

export function getCanonicalUrl(
  lang: string,
  category: string,
  slug: string
): string {
  return `https://calchub.com/${lang}/${category}/${slug}/`;
}
