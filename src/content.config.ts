import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const toolsCollection = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/tools' }),
  schema: z.object({
    // === IDENTITY ===
    id: z.string(),
    category: z.string(),
    calculatorComponent: z.string(),

    // === SEO (unique per language, never translated from EN) ===
    title: z.string().max(60),
    metaDescription: z.string().max(160),
    h1: z.string(),
    slug: z.string(),

    // === NATIVE KEYWORDS (researched per language, never translated) ===
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()),

    // === EDUCATIONAL CONTENT (anti-thin-content, anti-AI-detect) ===
    intro: z.string().min(100),
    howItWorks: z.object({
      title: z.string(),
      content: z.string().min(400),
      formula: z.string(),
      formulaExplanation: z.string(),
      academicSource: z.string(),
    }),

    // === FAQ (5-8 questions, 50+ words per answer) ===
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string().min(150),
    })).min(5).max(8),

    // === PRACTICAL EXAMPLES (2-3 scenarios with real numbers) ===
    examples: z.array(z.object({
      title: z.string(),
      scenario: z.string(),
      inputs: z.record(z.string(), z.union([z.string(), z.number()])),
      expectedResult: z.string(),
      explanation: z.string(),
    })).min(2).max(3),

    // === RELATED TOOLS (3-5 internal links) ===
    relatedTools: z.array(z.string()).min(3).max(5),

    // === LOCALIZED DEFAULTS ===
    defaults: z.object({
      currency: z.string().optional(),
      currencySymbol: z.string().optional(),
      unit: z.string().optional(),
      numberFormat: z.object({
        decimal: z.string(),
        thousands: z.string(),
      }).optional(),
      defaultValues: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
    }),

    // === META ===
    lastUpdated: z.string(),
    author: z.string().default('CalcHub Team'),
    priority: z.enum(['high', 'medium', 'low']),
  }),
});

export const collections = { tools: toolsCollection };
