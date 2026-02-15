/**
 * Unified Schema.org generator.
 * Generates 4 schema types for every calculator page.
 */

import { generateWebApplicationSchema } from './webApplication';
import { generateFAQPageSchema } from './faqPage';
import { generateBreadcrumbListSchema } from './breadcrumbList';
import { generateHowToSchema } from './howTo';
import { t } from '../../i18n/utils';

export interface ToolSchemaInput {
  h1: string;
  metaDescription: string;
  category: string;
  slug: string;
  lang: string;
  currency?: string;
  faqs: Array<{ question: string; answer: string }>;
  howItWorksTitle: string;
  examples: Array<{ title: string; scenario: string }>;
}

export function generateToolSchemas(input: ToolSchemaInput) {
  const url = `https://calchub.com/${input.lang}/${input.category}/${input.slug}/`;
  const homeUrl = `https://calchub.com/${input.lang}/`;
  const categoryUrl = `https://calchub.com/${input.lang}/${input.category}/`;
  const categoryName = t(`category.${input.category}`, input.lang);

  return [
    generateWebApplicationSchema({
      name: input.h1,
      url,
      description: input.metaDescription,
      lang: input.lang,
      currency: input.currency,
    }),
    generateFAQPageSchema(input.faqs),
    generateBreadcrumbListSchema([
      { name: 'CalcHub', url: homeUrl },
      { name: categoryName, url: categoryUrl },
      { name: input.h1, url },
    ]),
    generateHowToSchema({
      name: input.howItWorksTitle,
      description: input.metaDescription,
      steps: input.examples.map((ex) => ({
        title: ex.title,
        text: ex.scenario,
      })),
    }),
  ];
}

export {
  generateWebApplicationSchema,
  generateFAQPageSchema,
  generateBreadcrumbListSchema,
  generateHowToSchema,
};
