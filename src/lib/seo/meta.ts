/**
 * Meta tag generator for calculator pages.
 */

export interface MetaTags {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: string;
  ogSiteName: string;
  locale: string;
}

export function generateMetaTags(
  title: string,
  description: string,
  lang: string,
  category: string,
  slug: string
): MetaTags {
  return {
    title,
    description,
    canonicalUrl: `https://calchub.com/${lang}/${category}/${slug}/`,
    ogType: 'website',
    ogSiteName: 'CalcHub',
    locale: lang,
  };
}
