export interface WebApplicationSchemaInput {
  name: string;
  url: string;
  description: string;
  lang: string;
  currency?: string;
}

export function generateWebApplicationSchema(input: WebApplicationSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    url: input.url,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires HTML5',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: input.currency || 'USD',
    },
    inLanguage: input.lang,
    description: input.description,
  };
}
