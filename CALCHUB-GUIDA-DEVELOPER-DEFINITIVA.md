# CALCHUB — GUIDA OPERATIVA DEVELOPER DEFINITIVA
## Documento Step-by-Step per Sviluppo Completo

**Versione:** 1.0 — Febbraio 2026
**Obiettivo:** Creare CalcHub, piattaforma di calcolatori online in 25 lingue, 200 tool, ottimizzata SEO per superare calculator.net e tutti i competitor.
**Target:** Questo documento è l'istruzione operativa completa per lo sviluppatore (Claude o umano). Seguire ogni sezione nell'ordine indicato.

---

# PARTE 1 — STACK TECNOLOGICO DEFINITIVO

## 1.1 Perché Astro (e non Next.js)

CalcHub è un sito con 5.000 pagine al 95% statiche (testo educativo, FAQ, formule) con un piccolo widget interattivo per pagina (il calcolatore). Astro è progettato esattamente per questo pattern:

| Metrica | Astro | Next.js | Differenza |
|---------|-------|---------|------------|
| JS inviato al browser (default) | 0 KB | 45-85 KB | Astro 100% più leggero |
| JS per pagina calcolatore | ~3 KB (Preact island) | ~50 KB (React hydration) | 17x più leggero |
| Build 5.000 pagine | ~90 sec | ~260 sec | 3x più veloce |
| Lighthouse Performance | 100/100 automatico | 85-95 (richiede tuning) | Astro nativo |
| Page size media | 8-15 KB | 50-90 KB | 5-8x più piccolo |
| LCP mobile | <0.5s | 0.8-1.5s | 2-3x più veloce |
| i18n nativo | Sì, routing automatico | Sì, ma complesso | Astro più semplice |

**Architettura Islands:** Con Astro, ogni pagina è HTML puro. Solo il componente calcolatore (la "island") riceve JavaScript, e solo quando l'utente scrolla fino a vederlo (`client:visible`). Il resto — titolo, descrizione, Come Funziona, FAQ, Formula — è HTML statico senza un singolo byte di JS.

## 1.2 Stack Completo

```
FRAMEWORK:        Astro 5.x (latest stable)
UI ISLANDS:       Preact 10.x (3KB, stessa API React, per i calcolatori interattivi)
STYLING:          Tailwind CSS 4.x (utility-first, tree-shaking automatico)
LINGUAGGIO:       TypeScript strict
i18n:             Astro i18n nativo + Content Collections
SCHEMA MARKUP:    JSON-LD generato automaticamente per ogni pagina
HOSTING:          DigitalOcean VPS con Docker (Nginx container)
DNS/CDN:          Cloudflare DNS (gratuito, proxy opzionale per CDN)
CI/CD:            GitHub Actions → SSH deploy on VPS (o manuale git pull + docker build)
ANALYTICS:        Plausible Cloud o Umami self-hosted (privacy-first, no cookie banner)
ADS:              AdSense → Mediavine (quando >50K sessioni/mese)
REPO:             GitHub privato (monorepo)
DOMINIO:          calchub.com (o alternativa .com disponibile)
```

## 1.3 Architettura Directory Progetto

```
calchub/
├── astro.config.mjs              # Config Astro + i18n + Preact
├── tailwind.config.mjs           # Tailwind config
├── tsconfig.json                 # TypeScript strict
├── package.json
│
├── public/
│   ├── favicon.svg
│   ├── robots.txt                # Direttive crawl
│   └── ads.txt                   # Per AdSense/Mediavine
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro          # Nav + language switcher
│   │   │   ├── Footer.astro          # Footer + links lingue (VISIBILI per Google)
│   │   │   ├── Breadcrumb.astro      # Schema BreadcrumbList automatico
│   │   │   └── SEOHead.astro         # Meta tags + hreflang + Schema JSON-LD
│   │   │
│   │   ├── calculators/              # ISLANDS Preact (interattive)
│   │   │   ├── base/
│   │   │   │   ├── CalculatorShell.tsx    # Shell riutilizzabile con input/output
│   │   │   │   ├── InputField.tsx         # Campo input con validazione
│   │   │   │   ├── ResultDisplay.tsx      # Display risultato con animazione
│   │   │   │   └── UnitSelector.tsx       # Selettore unità (con defaults per lingua)
│   │   │   │
│   │   │   ├── finance/
│   │   │   │   ├── MortgageCalculator.tsx
│   │   │   │   ├── CompoundInterestCalculator.tsx
│   │   │   │   ├── LoanCalculator.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── health/
│   │   │   │   ├── BMICalculator.tsx
│   │   │   │   ├── TDEECalculator.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── math/
│   │   │   ├── conversion/
│   │   │   ├── date/
│   │   │   ├── construction/
│   │   │   ├── text/
│   │   │   ├── education/
│   │   │   └── physics/
│   │   │
│   │   └── content/                  # Componenti statici Astro (zero JS)
│   │       ├── HowItWorks.astro      # Sezione "Come Funziona"
│   │       ├── FormulaDisplay.astro  # Formula con citazione accademica
│   │       ├── FAQ.astro             # FAQ con Schema FAQPage
│   │       ├── PracticalExamples.astro
│   │       ├── RelatedTools.astro    # Links interni
│   │       └── AdPlacement.astro     # Slot pubblicitari
│   │
│   ├── content/                      # CONTENT COLLECTIONS (dati per pagina)
│   │   └── tools/
│   │       ├── en/
│   │       │   ├── mortgage-calculator.yaml
│   │       │   ├── bmi-calculator.yaml
│   │       │   └── ... (200 file)
│   │       ├── it/
│   │       │   ├── calcolo-mutuo.yaml
│   │       │   ├── calcolo-bmi.yaml
│   │       │   └── ...
│   │       ├── es/
│   │       ├── fr/
│   │       ├── de/
│   │       ├── pt-br/
│   │       ├── ar/
│   │       ├── hi/
│   │       ├── ja/
│   │       ├── ko/
│   │       ├── ru/
│   │       ├── tr/
│   │       ├── id/
│   │       ├── zh-hans/
│   │       ├── pl/
│   │       ├── nl/
│   │       ├── th/
│   │       ├── sv/
│   │       ├── ro/
│   │       ├── el/
│   │       ├── cs/
│   │       ├── hu/
│   │       ├── uk/
│   │       ├── bn/
│   │       └── vi/
│   │
│   ├── i18n/
│   │   ├── ui.ts                     # Stringhe UI tradotte (nav, footer, bottoni)
│   │   ├── utils.ts                  # Helper: getLang(), t(), getLocalePath()
│   │   ├── locales.ts                # Config 25 lingue (codici ISO, nomi, direzione)
│   │   └── defaults.ts               # Default per lingua (valuta, unità, separatori)
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro          # Layout base (HTML, head, body)
│   │   ├── ToolLayout.astro          # Layout pagina calcolatore (il template killer)
│   │   └── CategoryLayout.astro      # Layout pagina categoria
│   │
│   ├── pages/
│   │   └── [lang]/
│   │       ├── index.astro           # Homepage per lingua
│   │       ├── [...category]/
│   │       │   └── [...slug].astro   # Pagine calcolatore (dynamic routing)
│   │       └── sitemap.xml.ts        # Sitemap per lingua
│   │
│   ├── lib/
│   │   ├── formulas/                 # Logica calcolo pura (no UI)
│   │   │   ├── finance.ts
│   │   │   ├── health.ts
│   │   │   ├── math.ts
│   │   │   ├── conversions.ts
│   │   │   └── ...
│   │   │
│   │   ├── schema/                   # Generatori Schema.org
│   │   │   ├── webApplication.ts
│   │   │   ├── faqPage.ts
│   │   │   ├── breadcrumbList.ts
│   │   │   └── howTo.ts
│   │   │
│   │   └── seo/
│   │       ├── hreflang.ts           # Generatore hreflang tags
│   │       ├── meta.ts               # Generatore meta tags
│   │       └── sitemap.ts            # Generatore sitemap XML
│   │
│   └── styles/
│       └── global.css                # Tailwind imports + custom
│
├── scripts/
│   ├── validate-content.ts           # Validazione pre-build (vedi checklist)
│   ├── check-hreflang.ts             # Verifica bidirezionalità hreflang
│   ├── competitor-compare.ts         # Confronto con competitor per ogni tool
│   └── build-sitemap.ts              # Sitemap multi-lingua
│
└── docs/
    ├── CONTENT-TEMPLATE.md           # Template contenuto per ogni tool
    ├── SEO-CHECKLIST.md              # Checklist pre-pubblicazione
    └── COMPETITOR-ANALYSIS.md        # Dati competitor per confronto
```

## 1.4 Configurazione Astro

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SUPPORTED_LOCALES = [
  'en', 'es', 'pt-br', 'fr', 'de', 'it',          // Tier 1
  'ar', 'hi', 'ja', 'ko', 'ru', 'tr', 'id', 'zh-hans', // Tier 2
  'pl', 'nl', 'th', 'sv', 'ro', 'el', 'cs', 'hu', 'uk', 'bn', 'vi' // Tier 3
];

export default defineConfig({
  site: 'https://calchub.com',
  
  integrations: [
    preact({ compat: false }), // No React compat = smaller bundle
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: Object.fromEntries(
          SUPPORTED_LOCALES.map(l => [l, l])
        ),
      },
    }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: SUPPORTED_LOCALES,
    routing: {
      prefixDefaultLocale: true, // /en/bmi-calculator (coerente per tutte le lingue)
    },
  },

  build: {
    format: 'directory', // /en/bmi-calculator/index.html (clean URLs)
  },

  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
    },
  },
});
```

## 1.5 Content Collection Schema

```typescript
// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const toolsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // === IDENTITÀ ===
    id: z.string(),                           // "mortgage-calculator"
    category: z.string(),                     // "finance"
    calculatorComponent: z.string(),          // "MortgageCalculator" (nome componente Preact)
    
    // === SEO (UNICO PER LINGUA — MAI TRADOTTO DA EN) ===
    title: z.string().max(60),                // "Calcolo Mutuo Online Gratuito | CalcHub"
    metaDescription: z.string().max(160),     // Action-oriented, con keyword nativa
    h1: z.string(),                           // "Calcolo Rata Mutuo"
    slug: z.string(),                         // "calcolo-mutuo" (in lingua target)
    
    // === KEYWORD NATIVE (ricercate per ogni lingua, MAI tradotte) ===
    primaryKeyword: z.string(),               // "calcolo rata mutuo"
    secondaryKeywords: z.array(z.string()),   // ["simulazione mutuo", "rata mensile"]
    
    // === CONTENUTO EDUCATIVO (anti-thin-content, anti-AI-detect) ===
    intro: z.string().min(100),               // Introduzione 100-200 parole
    howItWorks: z.object({
      title: z.string(),                      // "Come Funziona il Calcolo del Mutuo"
      content: z.string().min(400),           // 200-400 parole UNICHE, MAI generiche
      formula: z.string(),                    // "M = P[r(1+r)^n]/[(1+r)^n-1]"
      formulaExplanation: z.string(),         // Spiegazione variabili
      academicSource: z.string(),             // Citazione accademica
    }),
    
    // === FAQ (5-8 domande, 50+ parole per risposta) ===
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string().min(150),            // Minimo 150 caratteri (~50 parole)
    })).min(5).max(8),
    
    // === ESEMPI PRATICI (2-3 scenari con numeri reali) ===
    examples: z.array(z.object({
      title: z.string(),                      // "Mutuo 30 anni per prima casa"
      scenario: z.string(),                   // Descrizione scenario
      inputs: z.record(z.string(), z.union([z.string(), z.number()])),
      expectedResult: z.string(),             // "La rata mensile sarà di €743,21"
      explanation: z.string(),                // Perché questo risultato
    })).min(2).max(3),
    
    // === TOOL CORRELATI (3-5 link interni) ===
    relatedTools: z.array(z.string()).min(3).max(5),
    
    // === DEFAULTS LOCALIZZATI ===
    defaults: z.object({
      currency: z.string().optional(),        // "EUR", "USD", "JPY"
      currencySymbol: z.string().optional(),  // "€", "$", "¥"
      unit: z.string().optional(),            // "metric" | "imperial"
      numberFormat: z.object({
        decimal: z.string(),                  // "," per IT, "." per EN
        thousands: z.string(),                // "." per IT, "," per EN
      }).optional(),
      defaultValues: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
    }),
    
    // === META ===
    lastUpdated: z.string(),                  // "2026-02-15"
    author: z.string().default("CalcHub Team"),
    priority: z.enum(['high', 'medium', 'low']), // Wave di lancio
  }),
});

export const collections = { tools: toolsCollection };
```

## 1.6 Layout Pagina Calcolatore (Il Template SEO Killer)

```astro
---
// src/layouts/ToolLayout.astro
// TEMPLATE MASTER — Ogni pagina calcolatore usa questo layout

import BaseLayout from './BaseLayout.astro';
import Breadcrumb from '../components/layout/Breadcrumb.astro';
import SEOHead from '../components/layout/SEOHead.astro';
import HowItWorks from '../components/content/HowItWorks.astro';
import FormulaDisplay from '../components/content/FormulaDisplay.astro';
import FAQ from '../components/content/FAQ.astro';
import PracticalExamples from '../components/content/PracticalExamples.astro';
import RelatedTools from '../components/content/RelatedTools.astro';
import AdPlacement from '../components/content/AdPlacement.astro';

const { tool, lang, CalculatorComponent } = Astro.props;
---

<BaseLayout>
  <SEOHead slot="head" {tool} {lang} />
  
  <main class="max-w-4xl mx-auto px-4 py-8">
    
    <!-- 1. BREADCRUMB (Schema BreadcrumbList) -->
    <Breadcrumb {tool} {lang} />
    
    <!-- 2. H1 (keyword-rich, unico) -->
    <h1 class="text-3xl font-bold text-gray-900 mb-4">{tool.h1}</h1>
    
    <!-- 3. INTRO (100-200 parole, contextuale) -->
    <p class="text-lg text-gray-600 mb-8 leading-relaxed">{tool.intro}</p>
    
    <!-- 4. ★ CALCOLATORE INTERATTIVO (Preact Island) ★ -->
    <!-- Questo è l'unico elemento che carica JavaScript -->
    <!-- client:visible = JS caricato solo quando l'utente scrolla qui -->
    <section class="bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100">
      <CalculatorComponent 
        client:visible
        defaults={tool.defaults}
        lang={lang}
      />
    </section>
    
    <!-- 5. AD PLACEMENT #1 (dopo il calcolatore) -->
    <AdPlacement slot="after-calculator" />
    
    <!-- 6. COME FUNZIONA (200-400 parole uniche) -->
    <HowItWorks 
      title={tool.howItWorks.title}
      content={tool.howItWorks.content}
    />
    
    <!-- 7. FORMULA CON CITAZIONE ACCADEMICA (E-E-A-T) -->
    <FormulaDisplay
      formula={tool.howItWorks.formula}
      explanation={tool.howItWorks.formulaExplanation}
      source={tool.howItWorks.academicSource}
    />
    
    <!-- 8. ESEMPI PRATICI (2-3 scenari reali) -->
    <PracticalExamples examples={tool.examples} />
    
    <!-- 9. AD PLACEMENT #2 (tra esempi e FAQ) -->
    <AdPlacement slot="mid-content" />
    
    <!-- 10. FAQ CON SCHEMA (5-8 domande, 50+ parole risposta) -->
    <FAQ faqs={tool.faqs} />
    
    <!-- 11. TOOL CORRELATI (3-5 link interni per PageRank flow) -->
    <RelatedTools tools={tool.relatedTools} {lang} />
    
    <!-- 12. LAST UPDATED (freshness signal per Google) -->
    <p class="text-sm text-gray-400 mt-8">
      Ultimo aggiornamento: {tool.lastUpdated}
    </p>
    
  </main>
</BaseLayout>
```

**Risultato per pagina:**
- HTML statico: ~8-12 KB (testo, FAQ, formula, esempi)
- JavaScript: ~3 KB (solo il calcolatore Preact, caricato lazy)
- CSS: ~5 KB (Tailwind purgato)
- TOTALE: ~16-20 KB per pagina
- LCP: <0.5s su mobile 3G
- Lighthouse: 100/100 Performance

## 1.7 Schema.org Automatico (4 tipi per pagina)

```typescript
// src/lib/schema/generateSchemas.ts
// Genera automaticamente 4 Schema per OGNI pagina calcolatore

export function generateToolSchemas(tool: ToolData, lang: string, url: string) {
  return [
    // 1. WebApplication
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.h1,
      "url": url,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": tool.defaults.currency || "USD"
      },
      "inLanguage": lang,
      "description": tool.metaDescription,
    },
    
    // 2. FAQPage
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": tool.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        }
      })),
    },
    
    // 3. BreadcrumbList
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "CalcHub",
          "item": `https://calchub.com/${lang}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": getCategoryName(tool.category, lang),
          "item": `https://calchub.com/${lang}/${tool.category}/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": tool.h1,
          "item": url
        }
      ]
    },
    
    // 4. HowTo
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": tool.howItWorks.title,
      "description": tool.metaDescription,
      "step": tool.examples.map((ex, i) => ({
        "@type": "HowToStep",
        "position": i + 1,
        "name": ex.title,
        "text": ex.scenario,
      })),
    }
  ];
}
```

## 1.8 Hreflang Automatico (anti-errori)

```typescript
// src/lib/seo/hreflang.ts
// REGOLE NON NEGOZIABILI:
// 1. Ogni pagina ha hreflang per TUTTE le 25 versioni linguistiche
// 2. Tag auto-referenziante (la pagina IT linka sé stessa come it)
// 3. Link bidirezionali (EN→IT E IT→EN)
// 4. x-default punta SEMPRE a EN
// 5. Codici ISO corretti: "pt-BR" non "pt-br", "zh-Hans" non "zh-cn"

const LOCALE_MAP: Record<string, string> = {
  'en': 'en',
  'es': 'es',
  'pt-br': 'pt-BR',
  'fr': 'fr',
  'de': 'de',
  'it': 'it',
  'ar': 'ar',
  'hi': 'hi',
  'ja': 'ja',
  'ko': 'ko',
  'ru': 'ru',
  'tr': 'tr',
  'id': 'id',
  'zh-hans': 'zh-Hans',
  'pl': 'pl',
  'nl': 'nl',
  'th': 'th',
  'sv': 'sv',
  'ro': 'ro',
  'el': 'el',
  'cs': 'cs',
  'hu': 'hu',
  'uk': 'uk',
  'bn': 'bn',
  'vi': 'vi',
};

export function generateHreflangTags(
  toolSlugsByLang: Record<string, string>, // { en: "bmi-calculator", it: "calcolo-bmi" }
  category: string,
  currentLang: string
): string {
  const tags: string[] = [];
  
  // x-default (sempre EN)
  const enSlug = toolSlugsByLang['en'];
  tags.push(
    `<link rel="alternate" hreflang="x-default" href="https://calchub.com/en/${category}/${enSlug}/" />`
  );
  
  // Tag per ogni lingua (inclusa auto-referenziante)
  for (const [lang, isoCode] of Object.entries(LOCALE_MAP)) {
    const slug = toolSlugsByLang[lang];
    if (slug) {
      tags.push(
        `<link rel="alternate" hreflang="${isoCode}" href="https://calchub.com/${lang}/${category}/${slug}/" />`
      );
    }
  }
  
  // Canonical (auto-referenziante)
  const currentSlug = toolSlugsByLang[currentLang];
  tags.push(
    `<link rel="canonical" href="https://calchub.com/${currentLang}/${category}/${currentSlug}/" />`
  );
  
  return tags.join('\n');
}
```

## 1.9 Docker Deployment

### Dockerfile (Multi-Stage Build)

```dockerfile
# ============================================
# CALCHUB — Dockerfile Production
# Multi-stage: Node.js build → Nginx serve
# Immagine finale: ~30-50MB
# ============================================

# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copiare solo package files per cache layer
COPY package.json package-lock.json ./
RUN npm ci

# Copiare sorgenti e buildare
COPY . .
RUN npm run build

# --- Stage 2: Production ---
FROM nginx:1.25-alpine AS production

# Copiare config Nginx ottimizzata
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copiare sito statico dal build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
services:
  calchub:
    build:
      context: .
      dockerfile: Dockerfile
    image: calchub:latest
    container_name: calchub
    ports:
      - "8090:80"    # Porta interna 8090 (reverse proxy Nginx host su 443)
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### nginx/nginx.conf (ottimizzato per Astro statico)

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # === COMPRESSIONE ===
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 256;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml
        application/rss+xml
        image/svg+xml;

    # === CACHE ASSET STATICI ASTRO (immutabili, hash nel nome) ===
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # === CACHE ALTRI ASSET STATICI ===
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        access_log off;
    }

    # === CLEAN URLs (Astro directory format) ===
    # /en/health/bmi-calculator/ → /en/health/bmi-calculator/index.html
    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    # === REDIRECT trailing slash ===
    # Astro genera directory format, assicurarsi che URL finiscano con /
    location ~ ^([^.]*[^/])$ {
        return 301 $1/;
    }

    # === SECURITY HEADERS ===
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # === ERROR PAGES ===
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
```

### .dockerignore

```
node_modules
.git
.gitignore
.vscode
*.md
docs/
.env*
dist/
.astro/
```

---

# PARTE 2 — STRATEGIA CONTENUTI ANTI-AI-DETECT & SEO KILLER

## 2.1 Il Problema: Google e i Contenuti AI nel 2025-2026

Google nel 2025 ha implementato:
- **SpamBrain potenziato**: rileva pattern linguistici AI (uniformità frasale, em dash eccessivi, buzzword)
- **Quality Raters Update**: contenuto AI senza valore originale riceve rating "Lowest"
- **Scaled Content Abuse**: pubblicare centinaia di pagine simili = penalizzazione o de-indicizzazione
- **SynthID**: watermarking AI sotto review per rilevamento automatico

**MA**: Google NON penalizza l'uso di AI in sé. Penalizza contenuto SENZA VALORE, indipendentemente da chi lo ha scritto. La chiave è: valore unico + tocco umano + dati verificabili.

## 2.2 I 7 Segnali che Google Usa per Rilevare Contenuto AI

1. **Uniformità frasale**: Frasi tutte della stessa lunghezza (18-22 parole). Fix: variare da 5 a 35 parole
2. **Burstiness bassa**: Tono costante senza picchi emotivi. Fix: alternare tecnico e colloquiale
3. **Buzzword AI**: "streamlined", "in today's digital landscape", "leveraging", "game-changer". Fix: bandire queste parole
4. **Em dash eccessivi** (—): AI li usa 10x più degli umani. Fix: usare virgole e punti
5. **Struttura prevedibile**: Intro → 3 punti → Conclusione identica. Fix: variare struttura per pagina
6. **Zero dati originali**: Nessun numero specifico verificabile. Fix: 3+ statistiche fresche ogni 1.000 parole
7. **Nessuna opinione**: AI non prende posizione. Fix: includere raccomandazioni dirette ("Consigliamo...", "Attenzione a...")

## 2.3 Strategia Anti-AI-Detect per CalcHub (Content DNA)

### REGOLA #1: Mai "generare" contenuto — Usare AI come ASSISTENTE

Il workflow per ogni pagina:
```
1. RICERCA: Keyword nativa + competitor analysis + dati specifici per mercato
2. OUTLINE: Struttura unica per questa specifica pagina (MAI template identico)
3. DRAFT AI: Usare Claude per generare bozza con prompt specifico (vedi sotto)
4. HUMANIZE: Editing manuale — aggiungere opinioni, dati locali, esperienze
5. FACT-CHECK: Verificare ogni formula, ogni numero, ogni citazione
6. AI-CHECK: Passare su GPTZero/Originality.ai — target <30% AI score
7. PUBLISH: Solo se supera checklist completa
```

### REGOLA #2: Prompt Template per Contenuto Anti-AI

```
Scrivi il contenuto per la pagina [NOME TOOL] in [LINGUA].

REGOLE OBBLIGATORIE:
- Varia la lunghezza delle frasi tra 5 e 35 parole
- Alterna tono tecnico e colloquiale nella stessa sezione
- MAI usare em dash (—), usa virgole o punti
- MAI usare: "in today's", "streamlined", "game-changer", "landscape",
  "leverage", "cutting-edge", "revolutionary", "seamless", "robust",
  "holistic", "synergy", "paradigm", "empower", "delve", "crucial"
- Includi almeno 1 domanda retorica per sezione
- Includi almeno 1 raccomandazione diretta ("Consigliamo...", "Attenzione...")
- Usa dati SPECIFICI e verificabili (es: "In Italia il tasso medio mutuo
  a febbraio 2026 è del 3,2% secondo Mutuionline")
- NON iniziare 2 paragrafi consecutivi con la stessa parola
- Usa almeno 2 congiunzioni avversative non banali per sezione
  (es: "eppure", "ciononostante", "d'altro canto")
- La prima frase di ogni sezione deve essere DIVERSA dal topic sentence
  standard (mai "In questa sezione vedremo...")

STRUTTURA SPECIFICA PER QUESTA PAGINA:
[inserire struttura personalizzata]

DATI LOCALI DA INCLUDERE:
[inserire dati specifici per mercato/lingua target]
```

### REGOLA #3: Contenuto UNICO per Lingua (MAI tradurre da EN)

**SBAGLIATO:**
```
EN: "A mortgage calculator helps you estimate monthly payments"
IT: "Un calcolatore di mutuo ti aiuta a stimare i pagamenti mensili" ← traduzione letterale
```

**CORRETTO:**
```
EN: "A mortgage calculator helps you estimate monthly payments"
IT: "Stai comprando casa e vuoi sapere quanto pagherai ogni mese? 
     Il calcolo del mutuo ti permette di simulare la rata in base 
     al tasso fisso o variabile. In Italia, con i tassi Euribor 
     attuali, la differenza può essere di centinaia di euro al mese."
```

Ogni versione linguistica deve:
- Usare keyword NATIVE (ricercate, non tradotte)
- Riferire dati del MERCATO LOCALE (tassi, leggi, abitudini)
- FAQ su problemi LOCALI (IMU in Italia, ISF in Francia, Grundsteuer in Germania)
- Default LOCALI (EUR in IT, USD in US, JPY in JP)
- Formato numeri LOCALE ("1.234,56" in IT, "1,234.56" in EN)

### REGOLA #4: Parole e Frasi VIETATE (Blacklist)

```typescript
// src/lib/content/blacklist.ts
export const AI_BLACKLIST = [
  // Inglese
  "in today's", "digital landscape", "game-changer", "cutting-edge",
  "revolutionary", "seamless", "robust", "holistic", "synergy",
  "paradigm shift", "empower", "leverage", "delve into", "crucial",
  "it's important to note", "it's worth noting", "at the end of the day",
  "let's dive in", "without further ado", "in conclusion",
  "comprehensive guide", "ultimate guide", "everything you need to know",
  
  // Italiano
  "nel panorama odierno", "all'avanguardia", "rivoluzionario",
  "è importante notare che", "senza ulteriori indugi",
  "guida completa", "guida definitiva", "tutto quello che devi sapere",
  "in questo articolo vedremo", "in conclusione possiamo dire",
  
  // Strutturali
  "in this article", "in this guide", "let's explore",
  "as we can see", "as mentioned earlier", "as discussed above",
];
```

### REGOLA #5: Diversificazione Strutturale

Le 200 pagine NON devono avere la stessa struttura testuale. Creare 5 varianti:

**Variante A — Problem-Solution:**
```
Intro: Presenti il problema ("Quanto costa davvero il tuo mutuo?")
Tool: Calcolatore
Soluzione: Come interpretare i risultati
Formula: Dettaglio tecnico
FAQ: Domande pratiche
```

**Variante B — Story-Driven:**
```
Intro: Scenario reale ("Marco e Laura hanno appena trovato casa...")
Tool: Calcolatore
Come Funziona: Spiegazione nel contesto della storia
Confronto: Tabella comparativa (es: fisso vs variabile)
FAQ: Domande dal punto di vista dell'utente
```

**Variante C — Data-First:**
```
Intro: Dato shock ("Il 67% degli italiani non sa quanto paga di interessi")
Tool: Calcolatore
Analisi: Cosa dicono i numeri
Formula: Con dimostrazione matematica
Esempi: 3 scenari con numeri reali
FAQ: Domande tecniche
```

**Variante D — Expert-Advice:**
```
Intro: Raccomandazione diretta ("Prima di firmare un mutuo, fai questi calcoli")
Tool: Calcolatore
Guida esperta: Errori comuni da evitare
Formula: Con citazione accademica
Checklist: Cosa verificare prima di decidere
FAQ: Domande avanzate
```

**Variante E — Comparison:**
```
Intro: Confronto ("Tasso fisso o variabile? Dipende da 3 fattori")
Tool: Calcolatore (con opzione confronto)
Tabella comparativa: Pro/contro con numeri
Come Funziona: Le due formule a confronto
Esempi: Stesso scenario, risultati diversi
FAQ: "Qual è meglio se..." domande condizionali
```

Assegnare varianti in modo distribuito: su 200 tool, ~40 per variante.

---

# PARTE 3 — ANALISI COMPETITOR PER OGNI TOOL

## 3.1 Procedura di Confronto Competitor (da eseguire PRIMA di sviluppare ogni tool)

Per OGNI calcolatore, PRIMA di scrivere codice o contenuto, lo sviluppatore deve:

### Step 1: Ricerca Competitor
```
1. Cercare su Google la keyword primaria (es: "mortgage calculator")
2. Aprire i primi 5 risultati organici
3. Per ognuno documentare:
   - URL
   - Title tag (esatto)
   - H1 (esatto)
   - Numero campi input del calcolatore
   - Funzionalità speciali (grafici, tabelle amortamento, export PDF...)
   - Lunghezza contenuto testuale (word count approssimativo)
   - Presenza FAQ (quante domande?)
   - Presenza Schema markup (verificare con Rich Results Test)
   - Core Web Vitals (verificare con PageSpeed Insights)
   - Punti deboli evidenti (design datato, no mobile, no i18n, slow, no schema...)
```

### Step 2: Analisi Gap
```
Per ogni competitor, identificare:
- Cosa fa BENE che dobbiamo eguagliare
- Cosa fa MALE che possiamo migliorare
- Cosa NON fa che possiamo aggiungere
- Quale keyword serve meglio e quale ignora
```

### Step 3: Piano Superamento
```
Definire per il nostro tool:
- MINIMO 2 funzionalità IN PIÙ rispetto al miglior competitor
- CONTENUTO più lungo e più specifico di tutti i competitor
- DESIGN più moderno di tutti i competitor
- PERFORMANCE migliore di tutti i competitor (LCP, CLS, INP)
- SCHEMA più ricco di tutti i competitor
```

### Step 4: Documentazione
```
Salvare l'analisi nel file YAML del tool:
competitorAnalysis:
  date: "2026-02-15"
  competitors:
    - url: "https://calculator.net/mortgage-calculator.html"
      title: "Mortgage Calculator"
      strengths: ["tabella amortamento completa", "28 anni di DA"]
      weaknesses: ["design 2008", "no mobile-first", "no schema FAQPage", "LCP 2.3s"]
      wordCount: 450
      faqCount: 0
      schemaTypes: ["WebApplication"]
    - url: "https://www.bankrate.com/mortgages/mortgage-calculator/"
      ...
  ourAdvantages:
    - "Real-time calculation (no submit button)"
    - "Interactive amortization chart with Recharts"
    - "25 language versions with local rates"
    - "4 Schema types vs competitor's 1"
    - "LCP <0.5s vs competitor's 2.3s"
    - "1,200+ words vs competitor's 450"
```

## 3.2 Template Confronto (da compilare per ogni tool)

```yaml
# competitor-comparison-template.yaml
toolId: "mortgage-calculator"
keyword: "mortgage calculator"
searchDate: "2026-02-15"

googleTop5:
  - position: 1
    url: ""
    domain: ""
    titleTag: ""
    h1: ""
    inputFields: 0
    specialFeatures: []
    wordCount: 0
    faqCount: 0
    schemaTypes: []
    lighthousePerformance: 0
    lighthouseSEO: 0
    mobileOptimized: false
    designAge: ""           # "modern", "dated", "ancient"
    languages: 1
    weaknesses: []

ourTool:
  titleTag: ""
  h1: ""
  inputFields: 0
  specialFeatures: []
  targetWordCount: 0       # sempre > del massimo competitor
  faqCount: 0              # sempre >= 5
  schemaTypes: ["WebApplication", "FAQPage", "BreadcrumbList", "HowTo"]
  targetLighthousePerformance: 100
  targetLighthouseSEO: 100
  mobileOptimized: true
  languages: 25
  
  advantagesOverCompetitors:
    - ""
    - ""
    - ""
```

---

# PARTE 4 — LISTA COMPLETA 200 TOOL

## 4.1 Legenda

- **Priority** 🔴 = Wave 1-2 (primi 60 tool, mese 1-2) | 🟡 = Wave 3-4 (mese 3-6) | 🟢 = Wave 5 (mese 7-12)
- **Category** = cartella nel routing URL
- **Component** = nome file Preact in `src/components/calculators/`
- **Slug EN** = URL path in inglese (ogni lingua ha il proprio slug nativo)
- **Min Inputs** = minimo campi input (anti-thin content: almeno 2)
- **Content Variant** = A/B/C/D/E (vedi sezione 2.3 Regola #5)

## 4.2 FINANCE & BUSINESS (45 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 1 | Mortgage Calculator | mortgage-calculator | MortgageCalc | 🔴 | 4 | A |
| 2 | Loan Calculator | loan-calculator | LoanCalc | 🔴 | 4 | B |
| 3 | Compound Interest Calculator | compound-interest-calculator | CompoundInterestCalc | 🔴 | 5 | C |
| 4 | Simple Interest Calculator | simple-interest-calculator | SimpleInterestCalc | 🟡 | 3 | D |
| 5 | Auto Loan Calculator | auto-loan-calculator | AutoLoanCalc | 🔴 | 4 | B |
| 6 | Personal Loan Calculator | personal-loan-calculator | PersonalLoanCalc | 🟡 | 4 | A |
| 7 | Student Loan Calculator | student-loan-calculator | StudentLoanCalc | 🟡 | 4 | D |
| 8 | Business Loan Calculator | business-loan-calculator | BusinessLoanCalc | 🟢 | 5 | E |
| 9 | Loan Payoff Calculator | loan-payoff-calculator | LoanPayoffCalc | 🟡 | 4 | A |
| 10 | Amortization Calculator | amortization-calculator | AmortizationCalc | 🔴 | 4 | C |
| 11 | APR Calculator | apr-calculator | APRCalc | 🟡 | 4 | D |
| 12 | Credit Card Payoff Calculator | credit-card-payoff-calculator | CreditCardPayoffCalc | 🟡 | 3 | A |
| 13 | Debt-to-Income Calculator | debt-to-income-calculator | DTICalc | 🟡 | 4 | E |
| 14 | Down Payment Calculator | down-payment-calculator | DownPaymentCalc | 🟡 | 3 | B |
| 15 | Rent vs Buy Calculator | rent-vs-buy-calculator | RentVsBuyCalc | 🟢 | 6 | E |
| 16 | Investment Calculator | investment-calculator | InvestmentCalc | 🔴 | 5 | C |
| 17 | ROI Calculator | roi-calculator | ROICalc | 🔴 | 3 | D |
| 18 | Savings Calculator | savings-calculator | SavingsCalc | 🔴 | 4 | B |
| 19 | Retirement Calculator | retirement-calculator | RetirementCalc | 🟡 | 6 | A |
| 20 | 401k Calculator | 401k-calculator | FourOhOneKCalc | 🟡 | 5 | C |
| 21 | Inflation Calculator | inflation-calculator | InflationCalc | 🔴 | 3 | C |
| 22 | Currency Converter | currency-converter | CurrencyConv | 🔴 | 2 | D |
| 23 | Tip Calculator | tip-calculator | TipCalc | 🔴 | 3 | B |
| 24 | Discount Calculator | discount-calculator | DiscountCalc | 🔴 | 2 | A |
| 25 | Markup Calculator | markup-calculator | MarkupCalc | 🟡 | 2 | D |
| 26 | Margin Calculator | margin-calculator | MarginCalc | 🟡 | 2 | E |
| 27 | Profit Calculator | profit-calculator | ProfitCalc | 🟡 | 3 | A |
| 28 | Break-Even Calculator | break-even-calculator | BreakEvenCalc | 🟡 | 3 | C |
| 29 | Sales Tax Calculator | sales-tax-calculator | SalesTaxCalc | 🔴 | 2 | B |
| 30 | VAT Calculator | vat-calculator | VATCalc | 🔴 | 2 | D |
| 31 | Income Tax Calculator | income-tax-calculator | IncomeTaxCalc | 🟡 | 4 | A |
| 32 | Paycheck Calculator | paycheck-calculator | PaycheckCalc | 🟡 | 5 | B |
| 33 | Hourly to Salary Calculator | hourly-to-salary-calculator | HourlyToSalaryCalc | 🟡 | 2 | D |
| 34 | Overtime Calculator | overtime-calculator | OvertimeCalc | 🟢 | 3 | A |
| 35 | Net Worth Calculator | net-worth-calculator | NetWorthCalc | 🟢 | 6 | E |
| 36 | CAGR Calculator | cagr-calculator | CAGRCalc | 🟡 | 3 | C |
| 37 | Present Value Calculator | present-value-calculator | PresentValueCalc | 🟡 | 3 | D |
| 38 | Future Value Calculator | future-value-calculator | FutureValueCalc | 🟡 | 3 | C |
| 39 | IRR Calculator | irr-calculator | IRRCalc | 🟢 | 4 | D |
| 40 | NPV Calculator | npv-calculator | NPVCalc | 🟢 | 4 | C |
| 41 | Bond Calculator | bond-calculator | BondCalc | 🟢 | 4 | D |
| 42 | Stock Profit Calculator | stock-profit-calculator | StockProfitCalc | 🟡 | 4 | E |
| 43 | Dividend Calculator | dividend-calculator | DividendCalc | 🟢 | 4 | C |
| 44 | Lease Calculator | lease-calculator | LeaseCalc | 🟢 | 5 | A |
| 45 | Invoice Calculator | invoice-calculator | InvoiceCalc | 🟢 | 5 | B |

## 4.3 HEALTH & FITNESS (28 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 46 | BMI Calculator | bmi-calculator | BMICalc | 🔴 | 2 | A |
| 47 | BMR Calculator | bmr-calculator | BMRCalc | 🔴 | 4 | B |
| 48 | TDEE Calculator | tdee-calculator | TDEECalc | 🔴 | 5 | C |
| 49 | Calorie Calculator | calorie-calculator | CalorieCalc | 🔴 | 5 | A |
| 50 | Macro Calculator | macro-calculator | MacroCalc | 🔴 | 5 | D |
| 51 | Body Fat Calculator | body-fat-calculator | BodyFatCalc | 🟡 | 4 | B |
| 52 | Ideal Weight Calculator | ideal-weight-calculator | IdealWeightCalc | 🟡 | 3 | E |
| 53 | Calorie Deficit Calculator | calorie-deficit-calculator | CalorieDeficitCalc | 🟡 | 4 | A |
| 54 | Protein Calculator | protein-calculator | ProteinCalc | 🟡 | 3 | C |
| 55 | Water Intake Calculator | water-intake-calculator | WaterIntakeCalc | 🟡 | 3 | D |
| 56 | Pregnancy Due Date Calculator | pregnancy-due-date-calculator | PregnancyDueDateCalc | 🔴 | 2 | B |
| 57 | Pregnancy Week Calculator | pregnancy-week-calculator | PregnancyWeekCalc | 🟡 | 2 | A |
| 58 | Ovulation Calculator | ovulation-calculator | OvulationCalc | 🔴 | 2 | D |
| 59 | Conception Date Calculator | conception-date-calculator | ConceptionDateCalc | 🟡 | 2 | B |
| 60 | BAC Calculator | bac-calculator | BACCalc | 🟡 | 4 | E |
| 61 | Heart Rate Zone Calculator | heart-rate-zone-calculator | HeartRateZoneCalc | 🟡 | 2 | C |
| 62 | Max Heart Rate Calculator | max-heart-rate-calculator | MaxHeartRateCalc | 🟡 | 2 | D |
| 63 | VO2 Max Calculator | vo2-max-calculator | VO2MaxCalc | 🟢 | 3 | C |
| 64 | Pace Calculator | pace-calculator | PaceCalc | 🟡 | 3 | A |
| 65 | One Rep Max Calculator | one-rep-max-calculator | OneRepMaxCalc | 🟡 | 2 | B |
| 66 | Lean Body Mass Calculator | lean-body-mass-calculator | LeanBodyMassCalc | 🟢 | 3 | D |
| 67 | Waist-to-Hip Ratio Calculator | waist-to-hip-ratio-calculator | WaistToHipCalc | 🟢 | 2 | E |
| 68 | Army Body Fat Calculator | army-body-fat-calculator | ArmyBodyFatCalc | 🟢 | 4 | A |
| 69 | Sleep Calculator | sleep-calculator | SleepCalc | 🟡 | 2 | B |
| 70 | Blood Type Calculator | blood-type-calculator | BloodTypeCalc | 🟢 | 2 | C |
| 71 | Child Height Predictor | child-height-predictor | ChildHeightCalc | 🟢 | 3 | E |
| 72 | Dog Age Calculator | dog-age-calculator | DogAgeCalc | 🟢 | 2 | B |
| 73 | Smoking Cost Calculator | smoking-cost-calculator | SmokingCostCalc | 🟢 | 3 | A |

## 4.4 MATH & SCIENCE (35 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 74 | Percentage Calculator | percentage-calculator | PercentageCalc | 🔴 | 2 | A |
| 75 | Percent Change Calculator | percent-change-calculator | PercentChangeCalc | 🔴 | 2 | C |
| 76 | Percent Increase Calculator | percent-increase-calculator | PercentIncreaseCalc | 🟡 | 2 | D |
| 77 | Fraction Calculator | fraction-calculator | FractionCalc | 🔴 | 4 | B |
| 78 | Fraction to Decimal | fraction-to-decimal-converter | FractionToDecimalCalc | 🟡 | 2 | A |
| 79 | Decimal to Fraction | decimal-to-fraction-converter | DecimalToFractionCalc | 🟡 | 2 | D |
| 80 | Scientific Calculator | scientific-calculator | ScientificCalc | 🔴 | 2 | C |
| 81 | Exponent Calculator | exponent-calculator | ExponentCalc | 🟡 | 2 | A |
| 82 | Square Root Calculator | square-root-calculator | SqrtCalc | 🟡 | 2 | D |
| 83 | Logarithm Calculator | logarithm-calculator | LogCalc | 🟡 | 2 | C |
| 84 | Standard Deviation Calculator | standard-deviation-calculator | StdDevCalc | 🟡 | 3 | B |
| 85 | Mean/Median/Mode Calculator | mean-median-mode-calculator | MeanMedianModeCalc | 🟡 | 3 | A |
| 86 | Probability Calculator | probability-calculator | ProbabilityCalc | 🟡 | 2 | E |
| 87 | Combination Calculator | combination-calculator | CombinationCalc | 🟢 | 2 | D |
| 88 | Permutation Calculator | permutation-calculator | PermutationCalc | 🟢 | 2 | C |
| 89 | Area Calculator | area-calculator | AreaCalc | 🔴 | 2 | B |
| 90 | Volume Calculator | volume-calculator | VolumeCalc | 🔴 | 2 | A |
| 91 | Circumference Calculator | circumference-calculator | CircumferenceCalc | 🟡 | 2 | D |
| 92 | Triangle Calculator | triangle-calculator | TriangleCalc | 🟡 | 3 | B |
| 93 | Pythagorean Theorem Calculator | pythagorean-theorem-calculator | PythagoreanCalc | 🟡 | 2 | C |
| 94 | Circle Calculator | circle-calculator | CircleCalc | 🟡 | 2 | A |
| 95 | Sphere Calculator | sphere-calculator | SphereCalc | 🟢 | 2 | D |
| 96 | Cylinder Calculator | cylinder-calculator | CylinderCalc | 🟢 | 2 | B |
| 97 | Quadratic Formula Calculator | quadratic-formula-calculator | QuadraticCalc | 🟡 | 3 | C |
| 98 | Matrix Calculator | matrix-calculator | MatrixCalc | 🟢 | 4 | D |
| 99 | GCF Calculator | gcf-calculator | GCFCalc | 🟡 | 2 | A |
| 100 | LCM Calculator | lcm-calculator | LCMCalc | 🟡 | 2 | A |
| 101 | Prime Factorization Calculator | prime-factorization-calculator | PrimeFactCalc | 🟡 | 2 | B |
| 102 | Binary Calculator | binary-calculator | BinaryCalc | 🟡 | 2 | C |
| 103 | Hex Calculator | hex-calculator | HexCalc | 🟡 | 2 | D |
| 104 | Number Base Converter | number-base-converter | NumberBaseConv | 🟡 | 2 | A |
| 105 | Roman Numeral Converter | roman-numeral-converter | RomanNumeralConv | 🟢 | 2 | B |
| 106 | Random Number Generator | random-number-generator | RandomNumGen | 🟡 | 2 | D |
| 107 | Ratio Calculator | ratio-calculator | RatioCalc | 🟡 | 3 | E |
| 108 | Proportion Calculator | proportion-calculator | ProportionCalc | 🟡 | 3 | A |

## 4.5 CONVERSIONS (30 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 109 | Temperature Converter | temperature-converter | TempConv | 🔴 | 2 | A |
| 110 | Length Converter | length-converter | LengthConv | 🔴 | 2 | B |
| 111 | Weight Converter | weight-converter | WeightConv | 🔴 | 2 | C |
| 112 | Volume Converter | volume-converter | VolumeConv | 🔴 | 2 | D |
| 113 | Speed Converter | speed-converter | SpeedConv | 🟡 | 2 | A |
| 114 | Area Converter | area-converter | AreaConv | 🟡 | 2 | B |
| 115 | Pressure Converter | pressure-converter | PressureConv | 🟡 | 2 | C |
| 116 | Energy Converter | energy-converter | EnergyConv | 🟡 | 2 | D |
| 117 | Power Converter | power-converter | PowerConv | 🟢 | 2 | A |
| 118 | Force Converter | force-converter | ForceConv | 🟢 | 2 | B |
| 119 | Data Storage Converter | data-storage-converter | DataStorageConv | 🟡 | 2 | C |
| 120 | Fuel Consumption Converter | fuel-consumption-converter | FuelConv | 🟡 | 2 | E |
| 121 | Cooking Converter | cooking-converter | CookingConv | 🟡 | 2 | B |
| 122 | Shoe Size Converter | shoe-size-converter | ShoeSizeConv | 🟡 | 2 | D |
| 123 | Clothing Size Converter | clothing-size-converter | ClothingSizeConv | 🟡 | 2 | E |
| 124 | Ring Size Converter | ring-size-converter | RingSizeConv | 🟢 | 2 | A |
| 125 | Timezone Converter | timezone-converter | TimezoneConv | 🔴 | 2 | B |
| 126 | Inches to CM | inches-to-cm-converter | InchesToCMConv | 🔴 | 2 | A |
| 127 | CM to Inches | cm-to-inches-converter | CMToInchesConv | 🔴 | 2 | D |
| 128 | KG to LBS | kg-to-lbs-converter | KGToLBSConv | 🔴 | 2 | B |
| 129 | LBS to KG | lbs-to-kg-converter | LBSToKGConv | 🔴 | 2 | C |
| 130 | Miles to KM | miles-to-km-converter | MilesToKMConv | 🟡 | 2 | A |
| 131 | KM to Miles | km-to-miles-converter | KMToMilesConv | 🟡 | 2 | D |
| 132 | Feet to Meters | feet-to-meters-converter | FeetToMetersConv | 🟡 | 2 | B |
| 133 | Meters to Feet | meters-to-feet-converter | MetersToFeetConv | 🟡 | 2 | C |
| 134 | Gallons to Liters | gallons-to-liters-converter | GallonsToLitersConv | 🟡 | 2 | D |
| 135 | Liters to Gallons | liters-to-gallons-converter | LitersToGallonsConv | 🟡 | 2 | A |
| 136 | Celsius to Fahrenheit | celsius-to-fahrenheit-converter | CelsiusToFahrenheitConv | 🔴 | 2 | B |
| 137 | Fahrenheit to Celsius | fahrenheit-to-celsius-converter | FahrenheitToCelsiusConv | 🔴 | 2 | C |
| 138 | Ounces to Grams | ounces-to-grams-converter | OuncesToGramsConv | 🟡 | 2 | D |

## 4.6 DATE & TIME (12 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 139 | Age Calculator | age-calculator | AgeCalc | 🔴 | 2 | A |
| 140 | Date Difference Calculator | date-difference-calculator | DateDiffCalc | 🔴 | 2 | B |
| 141 | Date Calculator (Add/Subtract) | date-calculator | DateCalc | 🔴 | 3 | C |
| 142 | Time Calculator | time-calculator | TimeCalc | 🟡 | 3 | D |
| 143 | Hours Calculator | hours-calculator | HoursCalc | 🟡 | 2 | A |
| 144 | Time Zone Converter | time-zone-converter | TimeZoneCalc | 🟡 | 2 | B |
| 145 | Countdown Calculator | countdown-calculator | CountdownCalc | 🟡 | 2 | E |
| 146 | Work Days Calculator | work-days-calculator | WorkDaysCalc | 🟡 | 2 | C |
| 147 | Military Time Converter | military-time-converter | MilitaryTimeConv | 🟢 | 2 | D |
| 148 | Unix Timestamp Converter | unix-timestamp-converter | UnixTimestampConv | 🟢 | 2 | A |
| 149 | Stopwatch Online | online-stopwatch | StopwatchTool | 🟢 | 2 | B |
| 150 | Timer Online | online-timer | TimerTool | 🟢 | 2 | D |

## 4.7 CONSTRUCTION & HOME (16 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 151 | Square Footage Calculator | square-footage-calculator | SqFootageCalc | 🔴 | 2 | A |
| 152 | Concrete Calculator | concrete-calculator | ConcreteCalc | 🔴 | 3 | B |
| 153 | Paint Calculator | paint-calculator | PaintCalc | 🟡 | 3 | C |
| 154 | Tile Calculator | tile-calculator | TileCalc | 🟡 | 3 | D |
| 155 | Flooring Calculator | flooring-calculator | FlooringCalc | 🟡 | 3 | A |
| 156 | Roofing Calculator | roofing-calculator | RoofingCalc | 🟡 | 3 | B |
| 157 | Fence Calculator | fence-calculator | FenceCalc | 🟢 | 3 | E |
| 158 | Deck Calculator | deck-calculator | DeckCalc | 🟢 | 3 | C |
| 159 | Mulch Calculator | mulch-calculator | MulchCalc | 🟡 | 3 | D |
| 160 | Gravel Calculator | gravel-calculator | GravelCalc | 🟡 | 3 | A |
| 161 | Drywall Calculator | drywall-calculator | DrywallCalc | 🟢 | 3 | B |
| 162 | Stair Calculator | stair-calculator | StairCalc | 🟡 | 3 | E |
| 163 | Wallpaper Calculator | wallpaper-calculator | WallpaperCalc | 🟢 | 3 | C |
| 164 | Board Foot Calculator | board-foot-calculator | BoardFootCalc | 🟢 | 3 | D |
| 165 | Brick Calculator | brick-calculator | BrickCalc | 🟢 | 3 | A |
| 166 | Insulation Calculator | insulation-calculator | InsulationCalc | 🟢 | 3 | B |

## 4.8 TEXT & WEB TOOLS (14 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 167 | Word Counter | word-counter | WordCounter | 🔴 | 2 | A |
| 168 | Character Counter | character-counter | CharCounter | 🔴 | 2 | B |
| 169 | Password Generator | password-generator | PasswordGen | 🔴 | 3 | C |
| 170 | Lorem Ipsum Generator | lorem-ipsum-generator | LoremIpsumGen | 🟡 | 2 | D |
| 171 | Case Converter | case-converter | CaseConv | 🟡 | 2 | A |
| 172 | Hash Generator (MD5/SHA) | hash-generator | HashGen | 🟡 | 2 | C |
| 173 | URL Encoder/Decoder | url-encoder-decoder | URLEncoderDecoder | 🟡 | 2 | B |
| 174 | Base64 Encoder/Decoder | base64-encoder-decoder | Base64EncoderDecoder | 🟡 | 2 | D |
| 175 | JSON Formatter | json-formatter | JSONFormatter | 🟡 | 2 | A |
| 176 | HTML Entity Encoder | html-entity-encoder | HTMLEntityEncoder | 🟢 | 2 | C |
| 177 | Color Converter (HEX/RGB/HSL) | color-converter | ColorConv | 🟡 | 2 | E |
| 178 | QR Code Generator | qr-code-generator | QRCodeGen | 🟡 | 2 | B |
| 179 | Text Diff Tool | text-diff-tool | TextDiff | 🟢 | 2 | D |
| 180 | Regex Tester | regex-tester | RegexTester | 🟢 | 2 | C |

## 4.9 EDUCATION & FUN (12 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 181 | GPA Calculator | gpa-calculator | GPACalc | 🔴 | 3 | A |
| 182 | Grade Calculator | grade-calculator | GradeCalc | 🔴 | 3 | B |
| 183 | Final Grade Calculator | final-grade-calculator | FinalGradeCalc | 🟡 | 3 | C |
| 184 | College GPA Calculator | college-gpa-calculator | CollegeGPACalc | 🟡 | 4 | D |
| 185 | Study Time Calculator | study-time-calculator | StudyTimeCalc | 🟢 | 3 | A |
| 186 | Reading Speed Calculator | reading-speed-calculator | ReadingSpeedCalc | 🟢 | 2 | E |
| 187 | Dice Roller | dice-roller | DiceRoller | 🟡 | 2 | B |
| 188 | Coin Flipper | coin-flipper | CoinFlipper | 🟡 | 2 | D |
| 189 | Random Name Picker | random-name-picker | RandomNamePicker | 🟡 | 2 | A |
| 190 | Spin the Wheel | spin-the-wheel | SpinWheel | 🟢 | 2 | E |
| 191 | Typing Speed Test | typing-speed-test | TypingSpeedTest | 🟢 | 2 | C |
| 192 | Number to Words | number-to-words-converter | NumberToWords | 🟢 | 2 | D |

## 4.10 ELECTRICITY & PHYSICS (10 tool)

| # | Tool | Slug EN | Component | Priority | Min Inputs | Variant |
|---|------|---------|-----------|----------|------------|---------|
| 193 | Ohm's Law Calculator | ohms-law-calculator | OhmsLawCalc | 🟡 | 2 | A |
| 194 | Electricity Cost Calculator | electricity-cost-calculator | ElectricityCostCalc | 🔴 | 3 | B |
| 195 | Voltage Drop Calculator | voltage-drop-calculator | VoltageDropCalc | 🟡 | 4 | C |
| 196 | Wire Size Calculator | wire-size-calculator | WireSizeCalc | 🟢 | 3 | D |
| 197 | BTU Calculator | btu-calculator | BTUCalc | 🟡 | 3 | A |
| 198 | AC Size Calculator | ac-size-calculator | ACSizeCalc | 🟢 | 3 | E |
| 199 | Solar Panel Calculator | solar-panel-calculator | SolarPanelCalc | 🟡 | 4 | C |
| 200 | LED Savings Calculator | led-savings-calculator | LEDSavingsCalc | 🟢 | 3 | B |

## 4.11 Conteggio per Wave

| Wave | Periodo | Tool | Lingue | Pagine Totali |
|------|---------|------|--------|---------------|
| 1 | Settimana 1-4 | 30 tool 🔴 | EN only | 30 |
| 2 | Settimana 5-8 | +30 tool 🔴 | EN + ES, FR, DE | 240 |
| 3 | Mese 3-4 | +60 tool 🟡 | + IT, PT-BR (6 Tier 1) | 720 |
| 4 | Mese 5-8 | +40 tool 🟡 | + 8 Tier 2 (14 totali) | 2.100 |
| 5 | Mese 9-12 | +40 tool 🟢 | + 11 Tier 3 (25 totali) | 5.000 |

---

# PARTE 5 — CHECKLIST PRE-PUBBLICAZIONE

## 5.1 Checklist Automatizzata (script `validate-content.ts`)

Questo script DEVE passare per ogni pagina PRIMA della pubblicazione. Se anche un solo check fallisce, la pagina NON viene pubblicata.

```typescript
// scripts/validate-content.ts
interface ValidationResult {
  pass: boolean;
  errors: string[];
  warnings: string[];
}

export function validateToolPage(tool: ToolData, lang: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // === CONTENUTO ===
  
  // C1: Title tag
  if (tool.title.length > 60) errors.push(`Title troppo lungo: ${tool.title.length}/60 caratteri`);
  if (tool.title.length < 30) warnings.push(`Title troppo corto: ${tool.title.length} caratteri`);
  if (!tool.title.includes(tool.primaryKeyword.split(' ')[0])) 
    errors.push('Title non contiene keyword primaria');
  
  // C2: Meta description
  if (tool.metaDescription.length > 160) errors.push(`Meta description troppo lunga: ${tool.metaDescription.length}/160`);
  if (tool.metaDescription.length < 100) warnings.push(`Meta description corta: ${tool.metaDescription.length}`);
  
  // C3: H1 unico
  if (tool.h1 === tool.title) warnings.push('H1 identico a Title — differenziare');
  
  // C4: Intro
  const introWords = tool.intro.split(/\s+/).length;
  if (introWords < 50) errors.push(`Intro troppo corta: ${introWords} parole (min 50)`);
  if (introWords > 200) warnings.push(`Intro lunga: ${introWords} parole`);
  
  // C5: How It Works
  const howWords = tool.howItWorks.content.split(/\s+/).length;
  if (howWords < 200) errors.push(`How It Works troppo corto: ${howWords} parole (min 200)`);
  if (howWords > 500) warnings.push(`How It Works lungo: ${howWords} parole`);
  
  // C6: Formula
  if (!tool.howItWorks.formula) errors.push('Formula mancante');
  if (!tool.howItWorks.academicSource) errors.push('Citazione accademica mancante');
  
  // C7: FAQ
  if (tool.faqs.length < 5) errors.push(`FAQ insufficienti: ${tool.faqs.length}/5 minimo`);
  tool.faqs.forEach((faq, i) => {
    const answerWords = faq.answer.split(/\s+/).length;
    if (answerWords < 40) errors.push(`FAQ #${i+1} risposta troppo corta: ${answerWords} parole (min 40)`);
  });
  
  // C8: Esempi
  if (tool.examples.length < 2) errors.push(`Esempi insufficienti: ${tool.examples.length}/2 minimo`);
  
  // C9: Related Tools
  if (tool.relatedTools.length < 3) errors.push(`Related tools insufficienti: ${tool.relatedTools.length}/3 minimo`);
  
  // C10: Word count totale
  const totalWords = countAllWords(tool);
  if (totalWords < 800) errors.push(`Word count totale: ${totalWords} (min 800)`);
  
  // === ANTI-AI-DETECT ===
  
  // AI1: Blacklist check
  const allText = getAllText(tool);
  AI_BLACKLIST.forEach(phrase => {
    if (allText.toLowerCase().includes(phrase.toLowerCase())) {
      errors.push(`Frase AI-detect trovata: "${phrase}"`);
    }
  });
  
  // AI2: Em dash check
  const emDashCount = (allText.match(/—/g) || []).length;
  if (emDashCount > 2) warnings.push(`Troppi em dash: ${emDashCount} (max 2 per pagina)`);
  
  // AI3: Sentence length variation
  const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLen, 2), 0) / sentenceLengths.length;
  if (variance < 15) warnings.push(`Frasi troppo uniformi (variance ${variance.toFixed(1)}, target >15)`);
  
  // AI4: Consecutive paragraph starts
  const paragraphs = allText.split('\n\n').filter(p => p.trim());
  for (let i = 1; i < paragraphs.length; i++) {
    const prevFirst = paragraphs[i-1].trim().split(/\s+/)[0];
    const currFirst = paragraphs[i].trim().split(/\s+/)[0];
    if (prevFirst === currFirst) {
      warnings.push(`Paragrafi ${i} e ${i+1} iniziano con la stessa parola: "${currFirst}"`);
    }
  }
  
  // === SEO TECNICO ===
  
  // S1: Slug in lingua
  if (lang !== 'en' && tool.slug === tool.id) {
    warnings.push('Slug identico all\'inglese — usare slug nativo');
  }
  
  // S2: Defaults localizzati
  if (lang !== 'en') {
    if (!tool.defaults.currency) warnings.push('Valuta locale non specificata');
    if (!tool.defaults.numberFormat) warnings.push('Formato numeri locale non specificato');
  }
  
  // S3: Last updated
  if (!tool.lastUpdated) errors.push('lastUpdated mancante');
  
  return {
    pass: errors.length === 0,
    errors,
    warnings,
  };
}
```

## 5.2 Checklist Manuale (per ogni pagina, ogni lingua)

```
CONTENUTO:
[ ] Tool funzionante (testato con 5+ scenari)
[ ] Risultati verificati (confrontati con 2+ fonti esterne)
[ ] "Come Funziona" 200-400 parole UNICHE (non template)
[ ] Formula con citazione accademica
[ ] 5-8 FAQ con risposte 50+ parole (Schema FAQPage)
[ ] 2-3 esempi pratici con numeri reali
[ ] Nessuna duplicazione con altre pagine (95%+ unico)
[ ] Word count totale >= 800
[ ] Nessuna frase dalla blacklist AI
[ ] Varianza lunghezza frasi > 15
[ ] Contenuto diverso da versione EN (non tradotto)

SEO TECNICO:
[ ] Title unico <60 caratteri con keyword
[ ] Meta description unica <160 caratteri, action-oriented
[ ] H1 unico (diverso da title)
[ ] Struttura heading gerarchica (H1 > H2 > H3)
[ ] 4 Schema markup (WebApplication + FAQPage + BreadcrumbList + HowTo)
[ ] Hreflang per tutte le 25 versioni + self-referencing + x-default
[ ] Canonical auto-referenziante
[ ] 3+ link interni + breadcrumb
[ ] Slug in lingua nativa con keyword

PERFORMANCE:
[ ] LCP <0.8s su mobile (target <0.5s)
[ ] CLS <0.05
[ ] INP <200ms
[ ] Page size <50KB totale
[ ] Lighthouse 95+ su tutti i pilastri
[ ] Mobile responsive testato

MULTILINGUA (pagine non-EN):
[ ] Keyword nativa ricercata (non tradotta da EN)
[ ] Default locali (valuta, unità, formato numeri)
[ ] 3/8 FAQ specifiche per mercato locale
[ ] Native review (Tier 1) o AI + spot check (Tier 2-3)
[ ] Test RTL per arabo
[ ] Hreflang bidirezionale verificato
```

---

# PARTE 6 — ROADMAP ESECUZIONE STEP-BY-STEP

## Phase 0: Setup Progetto (Giorno 1-3)

```
STEP 0.1: Creare repo GitHub privato "calchub"
STEP 0.2: npm create astro@latest calchub -- --template minimal
STEP 0.3: npx astro add preact tailwind sitemap
STEP 0.4: Configurare astro.config.mjs (sezione 1.4)
STEP 0.5: Configurare TypeScript strict
STEP 0.6: Creare struttura directory (sezione 1.3)
STEP 0.7: Configurare Content Collection schema (sezione 1.5)
STEP 0.8: Creare BaseLayout.astro + ToolLayout.astro (sezione 1.6)
STEP 0.9: Creare sistema i18n (ui.ts, utils.ts, locales.ts, defaults.ts)
STEP 0.10: Creare componenti base Preact (CalculatorShell, InputField, ResultDisplay)
STEP 0.11: Creare generatori Schema.org (sezione 1.7)
STEP 0.12: Creare generatore hreflang (sezione 1.8)
STEP 0.13: Creare script validazione (sezione 5.1)
STEP 0.14: Setup Cloudflare Pages + GitHub Actions auto-deploy
STEP 0.15: Creare robots.txt + sitemap.xml base
STEP 0.16: Registrare dominio + setup DNS Cloudflare
STEP 0.17: Registrare Google Search Console + Bing Webmaster
STEP 0.18: Deploy pagina "Coming Soon" per attivare indicizzazione dominio
```

## Phase 1: Wave 1 — Primi 30 Tool EN (Settimana 1-4)

```
Per OGNI tool (30 tool in 4 settimane = ~1-2 tool/giorno):

STEP 1.1: Competitor analysis (Parte 3 — compilare template confronto)
STEP 1.2: Creare componente Preact calcolatore
STEP 1.3: Scrivere formule pure in src/lib/formulas/
STEP 1.4: Testare calcoli (5+ scenari, confronto con competitor)
STEP 1.5: Creare file YAML contenuto EN (src/content/tools/en/)
STEP 1.6: Scrivere contenuto anti-AI seguendo Content DNA (Parte 2)
STEP 1.7: Eseguire validazione automatizzata
STEP 1.8: Fix errori + warnings
STEP 1.9: Test mobile + Lighthouse
STEP 1.10: Deploy + verifica indicizzazione in Search Console
```

## Phase 2: Wave 2 — 60 Tool + 3 Lingue (Settimana 5-8)

```
STEP 2.1: Completare restanti 30 tool 🔴 (EN)
STEP 2.2: Aggiungere lingue Tier 1: ES, FR, DE per primi 30 tool
STEP 2.3: Per OGNI lingua: keyword research nativa (non tradurre!)
STEP 2.4: Creare file YAML per ES, FR, DE
STEP 2.5: Verificare hreflang bidirezionale (script check-hreflang.ts)
STEP 2.6: Applicare per AdSense (requisito: 30+ pagine qualità)
STEP 2.7: Monitorare indicizzazione in Search Console
STEP 2.8: Verificare che "Discovered - not indexed" < 40%
```

## Phase 3: Espansione (Mese 3-12)

```
MESE 3-4: +60 tool 🟡, aggiungere IT + PT-BR → 6 lingue Tier 1
MESE 5-8: +40 tool 🟡, aggiungere 8 lingue Tier 2 → 14 lingue
MESE 9-12: +40 tool 🟢, aggiungere 11 lingue Tier 3 → 25 lingue, 200 tool = 5.000 pagine

REGOLA DI STOP: Non aggiungere nuova lingua se:
- "Discovered - not indexed" > 40% delle pagine
- Bounce rate > 75% su pagine tradotte
- Zero click da SERP per lingua specifica
- Ranking drops in lingue già lanciate
```

---

# PARTE 7 — METRICHE & MONITORAGGIO

## Dashboard KPI Settimanale

| Metrica | Mese 3 | Mese 6 | Mese 12 |
|---------|--------|--------|---------|
| Tool live | 60 | 150 | 200 |
| Lingue attive | 6 | 14 | 25 |
| Pagine indicizzate (GSC) | 200 | 1.000 | 3.500 |
| Visite organiche/mese | 10K | 150K | 800K |
| Posizione media Google | 45 | 28 | 18 |
| CTR media | 1.5% | 3% | 4.5% |
| Bounce rate | <65% | <60% | <55% |
| Session duration | >2min | >2.5min | >3min |
| Lighthouse Performance | 100 | 100 | 100 |
| Revenue/mese | $0 | $2K | $15K |
| Domain Rating | 10 | 30 | 50 |
| Backlinks totali | 100 | 1.000 | 5.000 |

---

# PARTE 8 — RISCHI CRITICI E MITIGAZIONE

## 8.1 Rischio Thin Content (CRITICO)
**Problema:** Calcolatore con solo form = thin content → de-indicizzazione
**Mitigazione:** Minimo 800 parole uniche + 5 FAQ + 2 esempi + formula per OGNI pagina

## 8.2 Rischio Scaled Content Abuse (CRITICO)
**Problema:** 200 pagine simili generate con AI = penalizzazione Google 2025
**Mitigazione:** 5 varianti strutturali, contenuto anti-AI, keyword native, dati locali

## 8.3 Rischio Contenuto Duplicato (ALTO)
**Problema:** "Percentage Calculator" vs "Percent Change" = pagine simili
**Mitigazione:** Consolidare tool ridondanti, 100% contenuto unico per pagina

## 8.4 Rischio Traduzioni Low-Quality (ALTO)
**Problema:** Google penalizza traduzioni meccaniche senza valore aggiunto
**Mitigazione:** 3-Tier approach (Gold/Silver/Bronze), keyword native, FAQ locali

## 8.5 Rischio Errori Hreflang (ALTO)
**Problema:** 31% siti internazionali hanno errori hreflang → pagine in "Discovered - not indexed"
**Mitigazione:** Script automatico verifica bidirezionalità, x-default, codici ISO

## 8.6 Rischio Crawl Budget (MEDIO)
**Problema:** Dominio nuovo DR 0 + 5.000 pagine = Google indicizza solo una frazione
**Mitigazione:** Rilascio a wave graduali, monitorare GSC, non superare 40% "Discovered"

---

# APPENDICE A — Defaults per Lingua

```typescript
// src/i18n/defaults.ts
export const LOCALE_DEFAULTS: Record<string, LocaleConfig> = {
  en: { currency: 'USD', symbol: '$', unit: 'imperial', decimal: '.', thousands: ',', dir: 'ltr' },
  es: { currency: 'EUR', symbol: '€', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  'pt-br': { currency: 'BRL', symbol: 'R$', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  fr: { currency: 'EUR', symbol: '€', unit: 'metric', decimal: ',', thousands: ' ', dir: 'ltr' },
  de: { currency: 'EUR', symbol: '€', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  it: { currency: 'EUR', symbol: '€', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  ar: { currency: 'SAR', symbol: 'ر.س', unit: 'metric', decimal: '٫', thousands: '٬', dir: 'rtl' },
  hi: { currency: 'INR', symbol: '₹', unit: 'metric', decimal: '.', thousands: ',', dir: 'ltr' },
  ja: { currency: 'JPY', symbol: '¥', unit: 'metric', decimal: '.', thousands: ',', dir: 'ltr' },
  ko: { currency: 'KRW', symbol: '₩', unit: 'metric', decimal: '.', thousands: ',', dir: 'ltr' },
  ru: { currency: 'RUB', symbol: '₽', unit: 'metric', decimal: ',', thousands: ' ', dir: 'ltr' },
  tr: { currency: 'TRY', symbol: '₺', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  id: { currency: 'IDR', symbol: 'Rp', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  'zh-hans': { currency: 'CNY', symbol: '¥', unit: 'metric', decimal: '.', thousands: ',', dir: 'ltr' },
  pl: { currency: 'PLN', symbol: 'zł', unit: 'metric', decimal: ',', thousands: ' ', dir: 'ltr' },
  nl: { currency: 'EUR', symbol: '€', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  th: { currency: 'THB', symbol: '฿', unit: 'metric', decimal: '.', thousands: ',', dir: 'ltr' },
  sv: { currency: 'SEK', symbol: 'kr', unit: 'metric', decimal: ',', thousands: ' ', dir: 'ltr' },
  ro: { currency: 'RON', symbol: 'lei', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  el: { currency: 'EUR', symbol: '€', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
  cs: { currency: 'CZK', symbol: 'Kč', unit: 'metric', decimal: ',', thousands: ' ', dir: 'ltr' },
  hu: { currency: 'HUF', symbol: 'Ft', unit: 'metric', decimal: ',', thousands: ' ', dir: 'ltr' },
  uk: { currency: 'UAH', symbol: '₴', unit: 'metric', decimal: ',', thousands: ' ', dir: 'ltr' },
  bn: { currency: 'BDT', symbol: '৳', unit: 'metric', decimal: '.', thousands: ',', dir: 'ltr' },
  vi: { currency: 'VND', symbol: '₫', unit: 'metric', decimal: ',', thousands: '.', dir: 'ltr' },
};
```

---

**FINE DOCUMENTO — Questo è il pacchetto completo per lo sviluppo di CalcHub. Seguire le sezioni nell'ordine indicato. Ogni step ha le informazioni necessarie per procedere senza ambiguità.**
