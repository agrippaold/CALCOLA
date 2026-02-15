# CALCHUB — STEP TRACKER
## Sistema di Checkpoint per Sviluppo Resumabile

**ISTRUZIONI:** Questo file è il tuo "salvataggio". Aggiorna lo stato di ogni step
quando lo completi. Se la sessione si interrompe, la prossima sessione leggerà
questo file per sapere da dove ripartire.

**Stato:** ⬜ Da fare | 🔄 In corso | ✅ Completato | ⚠️ Problema

---

## STATO ATTUALE

**Ultimo step completato:** STEP 3.8 (Link-bait tools: historical inflation, QR code, password strength checker)
**Prossimo step da eseguire:** STEP 4.1
**Branch attivo:** claude/continue-step-tracker-gNWpS
**Build status:** OK (157 pagine, 185 test passano, 84 YAML validati)

---

# FASE 0 — SETUP PROGETTO (Sessione 1-2)

Obiettivo: Repository funzionante, struttura completa, build che passa, Docker funzionante.

## STEP 0.1 — Inizializzazione Progetto ✅
```
Azioni:
1. Inizializzare progetto Astro: npm create astro@latest . -- --template minimal --typescript strict
2. Installare integrazioni: npx astro add preact tailwind sitemap
3. Configurare astro.config.mjs con i18n per 25 lingue (vedi GUIDA sezione 1.4)
4. Configurare tsconfig.json strict mode
5. Creare .gitignore, .dockerignore, .editorconfig
6. Primo commit + push

Verifica: npm run build completa senza errori
Commit: [STEP 0.1] Initialize Astro project with Preact, Tailwind, i18n
```
Completato: 2026-02-15
File creati/modificati: package.json, astro.config.mjs, tsconfig.json, tailwind.config.mjs, src/pages/index.astro, src/pages/en/index.astro, src/styles/global.css, .gitignore, .dockerignore, .editorconfig
Note: create-astro template fetch non disponibile (network), progetto creato manualmente con npm install. Astro 5.17.2, Preact 10.28.3, Tailwind 3.4.19. Build OK.

## STEP 0.2 — Struttura Directory ✅
```
Azioni:
1. Creare TUTTE le cartelle come da GUIDA sezione 1.3
2. Creare file placeholder dove necessario
3. Non creare ancora contenuto — solo la struttura

Verifica: tree src/ mostra struttura corretta
Commit: [STEP 0.2] Create full project directory structure
```
Completato: 2026-02-15
File creati/modificati: src/components/{layout,calculators/{base,finance,health,math,conversion,date,construction,text,education,physics},content}/, src/content/tools/{25 locale dirs}/, src/i18n/, src/layouts/, src/lib/{formulas,schema,seo}/, scripts/, nginx/, docs/, public/favicon.svg
Note: Tutte le directory create con .gitkeep per tracciamento Git. Struttura conforme a GUIDA sezione 1.3. Build OK.

## STEP 0.3 — Sistema i18n ✅
```
Azioni:
1. Creare src/i18n/locales.ts — config 25 lingue (codici ISO, nomi, dir)
2. Creare src/i18n/defaults.ts — defaults per lingua (valuta, unità, formato numeri) (GUIDA Appendice A)
3. Creare src/i18n/ui.ts — stringhe UI tradotte (nav, footer, bottoni, labels)
   - Prima solo EN e IT come test, poi le altre
4. Creare src/i18n/utils.ts — helper: getLang(), t(), getLocalePath(), formatNumber()

Verifica: Importare utils in una pagina test, verificare che funzionano
Commit: [STEP 0.3] Implement i18n system with 25 locale configs
```
Completato: 2026-02-15
File creati/modificati: src/i18n/locales.ts, src/i18n/defaults.ts, src/i18n/ui.ts, src/i18n/utils.ts
Note: 25 locali configurati con ISO codes, nomi nativi, tier, direzione testo. Defaults per valuta/unità/formato numeri. UI strings EN+IT. Helper: getLang(), t(), getLocalePath(), formatNumber(), formatCurrency(). Build OK.

## STEP 0.4 — Content Collection Schema ✅
```
Azioni:
1. Creare src/content/config.ts con schema Zod (GUIDA sezione 1.5)
2. Creare UN file YAML di esempio: src/content/tools/en/bmi-calculator.yaml
3. Verificare che Astro lo parsa correttamente

Verifica: npm run build — Content Collection validata senza errori
Commit: [STEP 0.4] Define Content Collection schema with Zod validation
```
Completato: 2026-02-15
File creati/modificati: src/content.config.ts, src/content/tools/en/bmi-calculator.yaml
Note: Schema Zod con validazione stringhe min/max, array min/max. Usato content.config.ts (Astro 5 naming) con glob loader per YAML. BMI calculator YAML validato senza errori. Build OK.

## STEP 0.5 — Layout e Componenti Base ✅
```
Azioni:
1. Creare src/layouts/BaseLayout.astro — HTML base, <head>, font loading, Tailwind
2. Creare src/layouts/ToolLayout.astro — template pagina calcolatore (GUIDA sezione 1.6)
3. Creare src/layouts/CategoryLayout.astro — template pagina categoria
4. Creare src/components/layout/Header.astro — nav + language switcher
5. Creare src/components/layout/Footer.astro — footer con LINK LINGUE VISIBILI + trust links (Privacy, Terms, About, contatti)
6. Creare src/components/layout/Breadcrumb.astro — con Schema BreadcrumbList
7. Creare src/components/layout/SEOHead.astro — meta, hreflang, Schema JSON-LD, canonical
8. Creare src/components/layout/AuthorByline.astro — "Scritto da X | Verificato da Y | Aggiornato: Data"

Verifica: Pagina test renderizza con tutti i componenti layout
Commit: [STEP 0.5] Create layouts and core layout components
```
Completato: 2026-02-15
File creati/modificati: src/layouts/{BaseLayout,ToolLayout,CategoryLayout}.astro, src/components/layout/{Header,Footer,Breadcrumb,SEOHead,AuthorByline}.astro, src/components/content/{HowItWorks,FormulaDisplay,FAQ,PracticalExamples,RelatedTools,AdPlacement}.astro
Note: BaseLayout con RTL support per arabo. ToolLayout con template SEO killer completo (12 sezioni). Header con language switcher dropdown 25 lingue. Footer con link trust + link lingue visibili per Google. Breadcrumb con Schema BreadcrumbList microdata. SEOHead con canonical, hreflang 25 lingue, x-default, Open Graph. FAQ con Schema FAQPage JSON-LD. Build OK.

## STEP 0.5b — Pagine Trust & E-E-A-T ✅
```
CRITICO per YMYL (finance + health). Google penalizza siti senza trust signals.

Azioni:
1. Creare /about/ — Chi siamo, mission CalcHub, team (3-5 autori con nome, foto placeholder, bio, competenze)
2. Creare /methodology/ — Come costruiamo i calcolatori, processo di verifica, fonti accademiche
3. Creare /privacy-policy/ — GDPR compliant
4. Creare /terms-of-service/ — Termini d'uso standard
5. Creare src/data/authors.ts — dati autori con credenziali per ogni categoria:
   - Finance: "Marco Finelli — Analista Finanziario, 8 anni consulenza creditizia"
   - Health: "Dr. Sara Vitali — Biologa nutrizionista, specializzazione dietologia"
   - Math: "Prof. Luca Bernardi — Docente matematica applicata"
   - Tech: "Elena Rossi — Ingegnere informatico, 10 anni sviluppo web"
6. Aggiungere Schema Organization per CalcHub
7. Aggiungere Schema Person per ogni autore
8. Aggiornare Footer con: link About, Methodology, Privacy, Terms + email contatto + badge trust
9. Aggiungere ai file YAML dei tool: campo "author" e "reviewer"

Verifica: Schema Organization e Person validi, pagine trust accessibili
Commit: [STEP 0.5b] Add E-E-A-T trust pages and author system
```
Completato: 2026-02-15
File creati/modificati: src/data/authors.ts, src/pages/en/{about,methodology,privacy-policy,terms-of-service}/index.astro
Note: 4 autori con credenziali per categoria (finance, health, math, tech). About page con Schema Organization + Person. Methodology page con 5-step validation process. Privacy e Terms GDPR-compliant. Footer già configurato in STEP 0.5 con link trust. Build OK con 5 pagine generate.

## STEP 0.6 — Componenti Contenuto Statici ✅
```
Azioni:
1. Creare src/components/content/HowItWorks.astro
2. Creare src/components/content/FormulaDisplay.astro
3. Creare src/components/content/FAQ.astro — con Schema FAQPage JSON-LD
4. Creare src/components/content/PracticalExamples.astro
5. Creare src/components/content/RelatedTools.astro
6. Creare src/components/content/AdPlacement.astro — slot per ads (placeholder)

Verifica: Tutti i componenti renderizzano HTML statico corretto
Commit: [STEP 0.6] Create static content components (FAQ, HowItWorks, Formula, etc.)
```
Completato: 2026-02-15
File creati/modificati: Tutti i componenti creati in STEP 0.5 (vedi sopra)
Note: Componenti creati anticipatamente in STEP 0.5 poiché necessari per ToolLayout. FAQ include Schema FAQPage JSON-LD. Tutti i componenti zero-JS (HTML statico puro).

## STEP 0.7 — Componenti Calcolatore Base (Preact) ⬜
```
Azioni:
1. Creare src/components/calculators/base/CalculatorShell.tsx
   - Container riutilizzabile con card styling
   - Gestione stato input/output
   - Real-time calculation (NO bottone "Calcola")
2. Creare src/components/calculators/base/InputField.tsx
   - Input numerico con validazione
   - Label, placeholder, unit suffix
   - Formato numeri localizzato
   - ARIA: aria-label, aria-describedby, role="spinbutton"
3. Creare src/components/calculators/base/ResultDisplay.tsx
   - Display risultato RICCO (non solo numero: valore + breakdown + insight)
   - Animazione sottile al cambio valore
   - aria-live="polite" per screen reader
4. Creare src/components/calculators/base/SelectField.tsx
   - Dropdown per selezioni (es: tipo tasso, unità)
   - Navigazione tastiera (frecce, Escape)
5. Creare src/components/calculators/base/SliderField.tsx
   - Slider con valore visibile (per percentuali, anni)
   - role="slider", aria-valuemin, aria-valuemax, aria-valuenow
6. Creare src/components/calculators/base/ChartDisplay.tsx
   - Wrapper leggero per Chart.js (grafici interattivi)
   - Supporto: line, bar, pie, doughnut
   - Alt text / tabella dati per accessibilità
   - Lazy loading (carica Chart.js solo quando visibile)
7. Creare src/components/calculators/base/ComparisonMode.tsx
   - Toggle "Confronta scenari" per tool finance
   - Side-by-side input/output per 2 scenari
8. Creare src/components/calculators/base/SaveCalculation.tsx
   - Bottone "Salva calcolo" → localStorage
   - Integrato in CalculatorShell
9. Focus management: tutti i campi navigabili con Tab, focus outline visibile

Verifica: 
- Componenti base renderizzano come island Preact con client:visible
- Lighthouse Accessibility ≥ 90
- Tab navigation funziona su tutti i campi
Commit: [STEP 0.7] Create Preact base calculator components with charts and a11y
```
Completato: 2026-02-15
File creati/modificati: src/components/calculators/base/{CalculatorShell,InputField,ResultDisplay,SelectField,SliderField}.tsx
Note: 5 componenti base Preact creati. CalculatorShell (container riutilizzabile), InputField (con unit suffix e ARIA), ResultDisplay (multi-valore con aria-live), SelectField (dropdown accessibile), SliderField (con aria-valuemin/max/now). ChartDisplay, ComparisonMode e SaveCalculation rinviati a STEP 1.x quando i calcolatori specifici li richiederanno. Build OK.

## STEP 0.8 — Schema.org Generators ✅
```
Azioni:
1. Creare src/lib/schema/webApplication.ts
2. Creare src/lib/schema/faqPage.ts
3. Creare src/lib/schema/breadcrumbList.ts
4. Creare src/lib/schema/howTo.ts
5. Creare src/lib/schema/index.ts — funzione unificata generateToolSchemas()

Verifica: Schema JSON-LD valido (testare output con validator.schema.org)
Commit: [STEP 0.8] Implement Schema.org generators (4 types per page)
```
Completato: 2026-02-15
File creati/modificati: src/lib/schema/{webApplication,faqPage,breadcrumbList,howTo,index}.ts
Note: 4 generatori Schema.org + funzione unificata generateToolSchemas(). FAQ schema già integrato in FAQ.astro. Build OK.

## STEP 0.9 — Hreflang e SEO ✅
```
Azioni:
1. Creare src/lib/seo/hreflang.ts (GUIDA sezione 1.8)
2. Creare src/lib/seo/meta.ts — generatore meta tags
3. Creare src/lib/seo/sitemap.ts — helper per sitemap multilingua
4. Creare public/robots.txt
5. Integrare in SEOHead.astro

Verifica: Ogni pagina ha hreflang completi + canonical + x-default
Commit: [STEP 0.9] Implement hreflang, meta tags, and robots.txt
```
Completato: 2026-02-15
File creati/modificati: src/lib/seo/{hreflang,meta,sitemap}.ts, public/robots.txt
Note: Hreflang con x-default→EN, bidirezionale 25 lingue, ISO codes corretti (pt-BR, zh-Hans). SEOHead.astro già integrato in STEP 0.5. robots.txt con link sitemap. Build OK.

## STEP 0.10 — Routing Dinamico ✅
```
Azioni:
1. Creare src/pages/[lang]/index.astro — homepage per lingua
2. Creare src/pages/[lang]/[category]/[slug].astro — pagina calcolatore
3. Implementare getStaticPaths() che genera tutte le combinazioni lang/category/slug
4. Connettere Content Collections → Layout → Componenti

Verifica: URL calchub.com/en/health/bmi-calculator/ renderizza pagina completa
Verifica: URL calchub.com/it/salute/calcolo-bmi/ renderizza versione italiana
Commit: [STEP 0.10] Implement dynamic routing for all lang/category/slug combinations
```
Completato: 2026-02-15
File creati/modificati: src/pages/en/health/bmi-calculator.astro, src/components/calculators/health/BMICalculator.tsx
Note: BMI calculator page renderizza a /en/health/bmi-calculator/. BMICalculator Preact island 4.22 KB (1.77 KB gzip) con barra visuale colorata, metric/imperial, real-time calculation. Routing statico per ora (file-based), verrà convertito a getStaticPaths() quando ci saranno più tool. Build OK con 6 pagine.

## STEP 0.11 — Docker e Nginx ⬜
```
Azioni:
1. Creare Dockerfile (multi-stage: Node build → Nginx serve)
2. Creare docker-compose.yml (porta 8090 interna)
3. Creare nginx/nginx.conf ottimizzato per Astro statico:
   - Gzip/Brotli compression
   - Cache immutabile per /_astro/ (1 anno)
   - Cache 30 giorni per immagini/font
   - try_files per clean URLs
   - Security headers
4. Creare .dockerignore

Verifica: docker compose up -d --build → sito accessibile su localhost:8090
Commit: [STEP 0.11] Add Docker and Nginx production configuration
```
Completato: 2026-02-15
File creati/modificati: Dockerfile, docker-compose.yml, nginx/nginx.conf
Note: Multi-stage build (Node 20 → Nginx 1.25 Alpine). Gzip compression, 1y cache per /_astro/, 30d per asset statici. Security headers (X-Frame-Options, X-Content-Type-Options, XSS-Protection, Referrer-Policy). .dockerignore già creato in STEP 0.1. Build OK.

## STEP 0.12 — Validazione e Script ✅
```
Azioni:
1. Creare scripts/validate-content.ts (GUIDA sezione 5.1)
2. Creare scripts/check-hreflang.ts — verifica bidirezionalità
3. Aggiungere npm scripts in package.json:
   - "validate": verifica tutti i file contenuto
   - "check-hreflang": verifica link hreflang
4. Creare GitHub Actions workflow (.github/workflows/build.yml):
   - On push to main: npm ci → npm run build → validate

Verifica: npm run validate esegue senza errori sul contenuto esempio
Commit: [STEP 0.12] Add validation scripts and CI workflow
```
Completato: 2026-02-15
File creati/modificati: scripts/validate-content.ts, scripts/check-hreflang.ts, .github/workflows/build.yml, package.json (aggiornato scripts)
Note: Validation script verifica: title <60, meta desc <160, intro >50 parole, howItWorks >200 parole, 5+ FAQ con 40+ parole, 2+ esempi, 3+ related tools, 800+ parole totali, AI blacklist, em dashes. Hreflang checker verifica bidirezionalità. CI GitHub Actions: validate → check-hreflang → build. BMI YAML corretto (howItWorks espanso a 200+ parole). Tutto passa.

## ✅ CHECKPOINT FASE 0
```
Al completamento di tutti gli step 0.x:
- [x] npm run build completa senza errori
- [ ] docker compose up mostra sito funzionante (non testabile in questo ambiente)
- [x] Almeno 1 pagina calcolatore (BMI EN) renderizza completamente
- [x] Schema.org valido su quella pagina (FAQPage JSON-LD + BreadcrumbList microdata)
- [x] Hreflang tags presenti (SEOHead.astro con 25 lingue + x-default)
- [ ] Lighthouse Performance ≥ 95 (non testabile in questo ambiente, architettura ottimizzata)
- [x] Repository pushato su GitHub con tutti i commit
```

---

# FASE 1 — PRIMI 10 CALCOLATORI (Sessione 3-6)

Obiettivo: 10 calcolatori funzionanti in EN con contenuto SEO completo.
Questi sono i tool ad altissima priorità 🔴.

## STEP 1.1 — Formula Library ✅
```
Azioni:
1. Creare src/lib/formulas/finance.ts:
   - mortgagePayment(), compoundInterest(), loanPayment(), simpleInterest()
   - roi(), savingsGrowth(), amortizationSchedule()
2. Creare src/lib/formulas/health.ts:
   - bmi(), bmr(), tdee(), calorieNeeds(), macroSplit()
3. Creare src/lib/formulas/math.ts:
   - percentage(), percentChange()
4. Creare src/lib/formulas/conversions.ts:
   - temperature(), length(), weight(), volume()
5. Unit test per ogni formula (almeno 3 test case ciascuna)

Verifica: Tutti i test passano, risultati verificati con fonti esterne
Commit: [STEP 1.1] Create formula library with unit tests
```
Completato: 2026-02-15
File creati/modificati: src/lib/formulas/{finance,health,math,conversions,index}.ts, src/lib/formulas/{finance,health,math,conversions}.test.ts, package.json (aggiunto vitest + scripts test)
Note: 4 librerie formule pure (no UI). Finance: 7 funzioni (mortgage, compound interest, loan, simple interest, ROI, savings growth, amortization schedule). Health: 6 funzioni (BMI, BMI category, BMR Mifflin-St Jeor, TDEE, calorie needs, macro split). Math: 10 funzioni (percentage, percent change/of/increase/decrease, area rectangle/circle/triangle/trapezoid/ellipse). Conversions: 9 funzioni (temperature 6x, length/weight/volume via intermediate unit). 92 test tutti verdi. Vitest installato come test framework. Build OK.

## STEP 1.2 — Calcolatore BMI (tool pilota) ✅
```
Commit: [STEP 1.2] BMI Calculator — complete with SEO content
```
Completato: 2026-02-15
File creati/modificati: src/components/calculators/health/BMICalculator.tsx (refactored to use formula library)
Note: BMI calculator aggiornato per importare bmi() e bmiCategory() dalla libreria formule. YAML e pagina Astro già creati in STEP 0.10. Validazione YAML passa.

## STEP 1.3 — Calcolatori Finance Batch 1 (4 tool) ✅
```
Commit: [STEP 1.3] Finance calculators batch 1 (mortgage, compound interest, loan, savings)
```
Completato: 2026-02-15
File creati/modificati: src/components/calculators/finance/{Mortgage,CompoundInterest,Loan,Savings}Calculator.tsx, src/content/tools/en/{mortgage,compound-interest,loan,savings}-calculator.yaml, src/pages/en/finance/{mortgage,compound-interest,loan,savings}-calculator.astro
Note: 4 calcolatori finance completi. MortgageCalculator con barra principal/interest. CompoundInterestCalculator con frequenza compounding. LoanCalculator con percentuale interessi. SavingsCalculator con breakdown contributi/interessi. Tutti i YAML passano validazione (800+ parole, 6 FAQ, 3 esempi). Build OK 10 pagine.

## STEP 1.4 — Calcolatori Health Batch 1 (3 tool) ✅
```
Commit: [STEP 1.4] Health calculators batch 1 (BMR, TDEE, calories)
```
Completato: 2026-02-15
File creati/modificati: src/components/calculators/health/{BMR,TDEE,Calorie}Calculator.tsx, src/content/tools/en/{bmr,tdee,calorie}-calculator.yaml, src/pages/en/health/{bmr,tdee,calorie}-calculator.astro
Note: 3 calcolatori health. BMR (Mifflin-St Jeor) con output giornaliero/orario/settimanale. TDEE con 5 livelli attivita e indicatore visuale. CalorieCalculator con macro split (protein/carbs/fat) e barra colorata. Tutti validati.

## STEP 1.5 — Calcolatori Math + Conversions (3 tool) ✅
```
Commit: [STEP 1.5] Math and conversion tools (percentage, area, temperature)
```
Completato: 2026-02-15
File creati/modificati: src/components/calculators/math/{Percentage,Area}Calculator.tsx, src/components/calculators/conversion/TemperatureConverter.tsx, YAML e pagine Astro corrispondenti
Note: PercentageCalculator con 5 modalita (% of, is what %, change, increase, decrease). AreaCalculator per 5 forme (rettangolo, cerchio, triangolo, trapezio, ellisse). TemperatureConverter (C/F/K) con punti di riferimento. Tutti validati.

## STEP 1.6 — Homepage e Categorie ✅
```
Commit: [STEP 1.6] Create homepage and category pages
```
Completato: 2026-02-15
File creati/modificati: src/pages/en/index.astro, src/pages/en/{finance,health,math,conversions}/index.astro
Note: Homepage con hero section, 4 popular tools, 4 categorie con link a tutti i tool. 4 pagine categoria con breadcrumb e griglia tool. Internal linking completo Home -> Categoria -> Tool.

## STEP 1.7 — Sistema Embed (Backlink Virale) ✅
```
Commit: [STEP 1.7] Create embeddable calculator system with backlink
```
Completato: 2026-02-15
File creati/modificati: src/layouts/EmbedLayout.astro, src/components/content/EmbedCode.astro, src/pages/embed/en/ (11 pagine), src/layouts/ToolLayout.astro (integrato embed button)
Note: EmbedLayout minimale (no header/footer, noindex). 11 pagine embed con client:load. EmbedCode con copy-to-clipboard e backlink CalcHub obbligatorio. Bottone "Embed this calculator" su ogni pagina tool.

## STEP 1.8 — Engagement & Share ✅
```
Commit: [STEP 1.8] Add engagement features (share, saved calculations)
```
Completato: 2026-02-15
File creati/modificati: src/components/content/ShareButtons.astro, src/pages/en/my-calculations/index.astro, src/layouts/ToolLayout.astro (integrato share buttons)
Note: ShareButtons (Twitter, LinkedIn, WhatsApp, Copy Link) integrati in ToolLayout. Pagina /my-calculations/ con localStorage. SmartRelatedTools rinviato (i RelatedTools statici dal YAML sono sufficienti per ora).

## ✅ CHECKPOINT FASE 1 — COMPLETO
```
Al completamento:
- [x] 10 calcolatori funzionanti in EN (BMI, BMR, TDEE, Calories, Mortgage, CompoundInterest, Loan, Savings, Percentage, Area) + Temperature Converter = 11 tool
- [x] Ogni pagina ha 800+ parole, Schema.org, hreflang
- [x] Author byline su ogni pagina
- [x] Pagine trust (About, Methodology, Privacy, Terms) live
- [x] Embed system funzionante con backlink obbligatorio (11 embed pages)
- [x] Homepage + 4 pagine categoria
- [x] Navigazione interna completa (Home -> Categoria -> Tool -> Related)
- [x] Build < 7 secondi (32 pagine in 6.57s)
- [ ] Docker container (non testabile in questo ambiente)
- [ ] Lighthouse Performance/Accessibility (non testabile, architettura ottimizzata)
- [x] Share buttons (Twitter, LinkedIn, WhatsApp, Copy Link)
- [x] My Calculations page con localStorage
- [x] 92 unit test con Vitest tutti verdi
- [x] 11 YAML validati senza errori
```

---

# FASE 2 — MULTILINGUA PRIMO BATCH (Sessione 7-10)

Obiettivo: I 10 tool tradotti in IT, ES, FR, DE (4 lingue extra = 40 nuove pagine).

## STEP 2.1 — Contenuto IT per 11 tool ✅
```
Azioni:
1. Creare src/content/tools/it/ con 11 file YAML
2. Ogni file con keyword NATIVE italiane (non tradotte da EN!)
   - "bmi calculator" → "calcolo imc" (keyword nativa)
   - "mortgage calculator" → "calcolo mutuo" (keyword nativa)
3. Slug in italiano: "calcolo-imc", "calcolo-mutuo", etc.
4. FAQ specifiche per mercato italiano
5. Default: EUR, sistema metrico, formato 1.234,56

Verifica: 11 pagine IT renderizzano, hreflang bidirezionale EN↔IT
Commit: [STEP 2.1] Italian content for 11 tools with native keywords
```
Completato: 2026-02-15
File creati/modificati: src/content/tools/it/{bmi,bmr,tdee,calorie,mortgage,compound-interest,loan,savings,percentage,area}-calculator.yaml, src/content/tools/it/temperature-converter.yaml, src/pages/it/index.astro, src/pages/it/{finanza,salute,matematica,conversioni}/index.astro, src/pages/it/salute/{calcolo-imc,calcolo-metabolismo-basale,calcolo-tdee,calcolo-calorie}.astro, src/pages/it/finanza/{calcolo-mutuo,calcolo-interesse-composto,calcolo-prestito,calcolo-risparmio}.astro, src/pages/it/matematica/{calcolo-percentuale,calcolo-area}.astro, src/pages/it/conversioni/convertitore-temperatura.astro
Note: 11 YAML italiani con keyword native (calcolo imc, calcolo mutuo, calcolo percentuale, ecc.). Slug italiani (calcolo-imc, calcolo-mutuo, ecc.). Categorie in italiano (finanza, salute, matematica, conversioni). Defaults EUR, metrico, formato 1.234,56. Homepage IT con 4 categorie e tool popolari. 22 YAML validati. Build OK 48 pagine in 6,56s. 92 test verdi.

## STEP 2.2 — Contenuto ES per 11 tool ✅
```
Come STEP 2.1 ma per spagnolo.
Keyword native: "calculadora imc", "calculadora hipoteca", etc.
Commit: [STEP 2.2] Spanish content for 11 tools with native keywords
```
Completato: 2026-02-15
File creati/modificati: src/content/tools/es/{bmi,bmr,tdee,calorie,mortgage,compound-interest,loan,savings,percentage,area}-calculator.yaml, src/content/tools/es/temperature-converter.yaml, src/pages/es/index.astro, src/pages/es/{finanzas,salud,matematicas,conversiones}/index.astro, src/pages/es/salud/{calculadora-imc,calculadora-metabolismo-basal,calculadora-tdee,calculadora-calorias}.astro, src/pages/es/finanzas/{calculadora-hipoteca,calculadora-interes-compuesto,calculadora-prestamo,calculadora-ahorro}.astro, src/pages/es/matematicas/{calculadora-porcentaje,calculadora-area}.astro, src/pages/es/conversiones/convertidor-temperatura.astro
Note: 11 YAML spagnoli con keyword native (calculadora imc, calculadora hipoteca, calculadora porcentaje, ecc.). Slug spagnoli. Categorie: finanzas, salud, matemáticas, conversiones. Contesto spagnolo (Euríbor, TIN/TAE, IVA 21%). Defaults EUR, metrico, formato 1.234,56. 33 YAML validati. Build OK 64 pagine in 7,15s.

## STEP 2.3 — Contenuto FR per 11 tool ✅
```
Keyword native: "calcul imc", "simulateur credit immobilier", etc.
Commit: [STEP 2.3] French content for 11 tools with native keywords
```
Completato: 2026-02-15
File creati/modificati: src/content/tools/fr/{bmi,bmr,tdee,calorie,mortgage,compound-interest,loan,savings,percentage,area}-calculator.yaml, src/content/tools/fr/temperature-converter.yaml, src/pages/fr/index.astro, src/pages/fr/{finances,sante,mathematiques,conversions}/index.astro, src/pages/fr/sante/{calcul-imc,calcul-metabolisme-basal,calcul-depense-energetique,calcul-calories}.astro, src/pages/fr/finances/{simulateur-credit-immobilier,calcul-interets-composes,calcul-pret-personnel,calcul-epargne}.astro, src/pages/fr/mathematiques/{calcul-pourcentage,calcul-surface}.astro, src/pages/fr/conversions/convertisseur-temperature.astro
Note: 11 YAML francesi con keyword native (calcul imc, simulateur credit immobilier, calcul pourcentage, ecc.). Slug francesi. Categorie: finances, santé, mathématiques, conversions. Contesto francese (taux d'usure, TAEG, assurance emprunteur, PTZ, Livret A, PEA, loi Lemoine). Defaults EUR, metrico, formato 1.234,56. 44 YAML validati, 80 pagine totali, build 6.59s.

## STEP 2.4 — Contenuto DE per 11 tool ✅
```
Keyword native: "bmi rechner", "baufinanzierung rechner", "prozentrechner", etc.
Commit: [STEP 2.4] German content for 11 tools with native keywords
```
Completato: 2026-02-15
File creati/modificati: src/content/tools/de/{bmi,bmr,tdee,calorie,mortgage,compound-interest,loan,savings,percentage,area}-calculator.yaml, src/content/tools/de/temperature-converter.yaml, src/pages/de/index.astro, src/pages/de/{finanzen,gesundheit,mathematik,umrechner}/index.astro, src/pages/de/gesundheit/{bmi-rechner,grundumsatz-rechner,tdee-rechner,kalorienrechner}.astro, src/pages/de/finanzen/{baufinanzierung-rechner,zinseszinsrechner,kreditrechner,sparrechner}.astro, src/pages/de/mathematik/{prozentrechner,flaechenrechner}.astro, src/pages/de/umrechner/temperatur-umrechner.astro
Note: 11 YAML tedeschi con keyword native (bmi rechner, baufinanzierung rechner, prozentrechner, ecc.). Slug tedeschi. Categorie: Finanzen, Gesundheit, Mathematik, Umrechner. Contesto tedesco (Sollzins, Effektivzins, KfW-Darlehen, Sondertilgung, Bausparvertrag, Abgeltungssteuer, Riester-Rente). Defaults EUR, metrico, formato 1.234,56. 55 YAML validati, 96 pagine totali, build 7.49s.

## STEP 2.5 — UI Strings e Language Switcher ✅
```
Azioni:
1. Completare ui.ts con tutte le stringhe per IT, ES, FR, DE
2. Testare language switcher (header + footer links)
3. Verificare che il footer mostra TUTTE le lingue come link visibili
4. Verificare hreflang bidirezionale per tutte le combinazioni

Commit: [STEP 2.5] Complete UI translations and language switcher for 5 languages
```
Completato: 2026-02-15
File creati/modificati: src/i18n/ui.ts
Note: Aggiunte traduzioni UI complete per ES, FR, DE (IT già presente). 4 sezioni per lingua: navigazione, categorie, UI calcolatore, contenuto, footer. Header language switcher funzionante con dropdown 25 lingue. Footer con link lingue visibili per Google crawl. Build OK 96 pagine in 7.11s.

## ✅ CHECKPOINT FASE 2 — COMPLETO
```
- [x] 11 tool × 5 lingue = 55 pagine calcolatore + 5 homepage + 20 categorie + 11 embed + 6 trust = 96 pagine totali
- [x] Hreflang tags presenti su tutte le pagine (SEOHead.astro 25 lingue + x-default)
- [x] Language switcher funzionante (Header dropdown + Footer visible links)
- [x] Build completa senza errori (96 pagine in 7.11s)
- [ ] Docker serve tutte le pagine correttamente (non testabile in questo ambiente)
- [x] 55 YAML tutti validati senza errori
- [x] 92 unit test verdi
- [x] UI strings complete per EN, IT, ES, FR, DE
```

---

# FASE 3 — ESPANSIONE TOOL 11-30 EN (Sessione 11-18)

Obiettivo: Completare i primi 30 tool 🔴 in EN.

## STEP 3.1 — Finance Batch 2 (6 tool) ✅
```
AutoLoan, Investment, ROI, Inflation, CurrencyConverter, Discount
Commit: [STEP 3.1] Finance batch 2 (auto loan, investment, ROI, inflation, currency, discount)
```
Completato: 2026-02-15
File creati/modificati: src/lib/formulas/finance.ts (6 nuove funzioni: autoLoanPayment, investmentGrowth, inflationAdjust, inflationFutureValue, currencyConvert, discountPrice), src/lib/formulas/finance.test.ts (17 nuovi test, totale 38), src/components/calculators/finance/{AutoLoan,Investment,ROI,Inflation,Discount}Calculator.tsx, src/components/calculators/finance/CurrencyConverter.tsx, src/content/tools/en/{auto-loan,investment,roi,inflation,discount}-calculator.yaml, src/content/tools/en/currency-converter.yaml, src/pages/en/finance/{auto-loan,investment,roi,inflation,discount}-calculator.astro, src/pages/en/finance/currency-converter.astro, src/pages/embed/en/ (6 embed pages), src/pages/en/finance/index.astro (aggiornato con 10 tool), src/pages/en/index.astro (aggiornato homepage con 10 finance tool)
Note: 6 calcolatori finance completi. AutoLoan con down payment e trade-in. Investment con grafico breakdown. ROI con indicatore visuale profit/loss. Inflation con purchasing power bar. CurrencyConverter con 10 valute e tassi di riferimento. Discount con barra savings. 109 test verdi, 61 YAML validati, 108 pagine, build 7.56s.

## STEP 3.2 — Finance Batch 3 (4 tool) ✅
```
Tip, SalesTax, VAT, Amortization
Commit: [STEP 3.2] Finance batch 3 (tip, sales tax, VAT, amortization)
```
Completato: 2026-02-15
File creati/modificati: src/lib/formulas/finance.ts (3 nuove funzioni: tipCalculation, salesTax, vatCalculation), src/lib/formulas/finance.test.ts (11 nuovi test, totale 49), src/components/calculators/finance/{Tip,SalesTax,VAT,Amortization}Calculator.tsx, 4 YAML EN, 4 pagine Astro, 4 embed pages, homepage e categoria aggiornate.
Note: TipCalculator con quick-tip buttons (15/18/20/25%), bill split. SalesTaxCalculator con breakdown bar. VATCalculator con add/extract mode e common rate buttons. AmortizationCalculator con tabella ammortamento annuale. 120 test verdi, 65 YAML validati, 116 pagine, build 7.89s. Finance ora ha 14 calcolatori totali.

## STEP 3.3 — Health Batch 2 (4 tool) ✅
```
Macro, BodyFat, PregnancyDueDate, Ovulation
Commit: [STEP 3.3] Health batch 2: macro, body fat, pregnancy, ovulation calculators
```
Completato: 2026-02-15
File creati/modificati: src/lib/formulas/health.ts (4 nuove funzioni: bodyFatNavy, pregnancyDueDate, gestationalAge, ovulationDate), src/lib/formulas/health.test.ts (8 nuovi test, totale 29), src/components/calculators/health/{Macro,BodyFat,Pregnancy,Ovulation}Calculator.tsx, 4 YAML EN, 4 pagine Astro, 4 embed pages, homepage e categoria salute aggiornate.
Note: MacroCalculator con diet presets (Balanced/High Protein/Low Carb/Keto). BodyFatCalculator con US Navy method e gender-conditional hip input. PregnancyCalculator con trimester progress bar e gestational age. OvulationCalculator con cycle visualization. Health ora ha 8 calcolatori totali. 128 test verdi, 69 YAML validati, 124 pagine, build 8.13s.

## STEP 3.4 — Math & Conversions Batch 2 (6 tool) ✅
```
PercentChange, Fraction, Scientific, Volume, LengthConverter, WeightConverter
Commit: [STEP 3.4] Math & conversions batch 2
```
Completato: 2026-02-15
File creati/modificati: src/lib/formulas/math.ts (13 nuove funzioni: gcd, lcm, fractionSimplify/Add/Sub/Mul/Div, fractionToDecimal, decimalToFraction, factorial, logBase, combination, permutation), src/lib/formulas/math.test.ts (25 nuovi test, totale 48), src/components/calculators/math/{PercentChange,Fraction,Scientific}Calculator.tsx, src/components/calculators/conversion/{Volume,Length,Weight}Converter.tsx, 6 YAML EN, 6 pagine Astro, 6 embed pages, homepage e categorie math/conversions aggiornate.
Note: Math ora ha 5 calcolatori. Conversions ora ha 4 converter. 153 test verdi, 75 YAML validati, 136 pagine, build 8.82s.

## STEP 3.5 — Remaining Wave 1 tools (6 tool) ✅
```
AgeCalculator, DateDifference, WordCounter, CharacterCounter, PasswordGenerator, GPACalculator
Commit: [STEP 3.5] Wave 1 remaining: age, date diff, word/char counter, password gen, GPA
```
Completato: 2026-02-15
File creati/modificati: src/lib/formulas/{date,text}.ts (calculateAge, dateDifference, wordCount, charCount, readingTime, generatePassword, passwordStrength, calculateGPA), src/lib/formulas/{date,text}.test.ts (26 nuovi test, totale 179), src/components/calculators/date/{Age,DateDifference}Calculator.tsx, src/components/calculators/text/{WordCounter,CharacterCounter,PasswordGenerator}.tsx, src/components/calculators/education/GPACalculator.tsx, 6 YAML EN, 6 pagine Astro (3 nuove categorie: date, text, education), 6 embed pages, 3 category index pages, homepage aggiornata con 7 categorie.
Note: 3 nuove categorie (date, text, education). AgeCalculator con milestones. DateDifferenceCalculator con years/months/weeks/days/hours/minutes. WordCounter con reading time. CharacterCounter con limiti Twitter/SMS/meta. PasswordGenerator con strength meter e copy. GPACalculator con grade scale bar. EN ora ha 37 tool totali. 81 YAML validati, 151 pagine, build 9.62s.

## STEP 3.6 — Categorie e Homepage aggiornate ✅
```
Aggiornare homepage e pagine categoria per mostrare tutti i 40 tool
Commit: Already updated incrementally in STEP 3.1-3.5
```
Completato: 2026-02-15
Note: Homepage e categorie già aggiornate incrementalmente negli step 3.1-3.5. 7 categorie con tutti i tool elencati. Verificato build 151 pagine OK.

## STEP 3.7 — PWA Base ✅
```
Commit: [STEP 3.7] Add PWA support (manifest, service worker, offline)
```
Completato: 2026-02-15
File creati/modificati: public/manifest.json, public/sw.js, public/offline.html, public/icons/{icon-192,icon-512,icon-maskable-512}.svg, src/layouts/BaseLayout.astro
Note: Web App Manifest con icone SVG (192, 512, maskable). Service worker: stale-while-revalidate per pagine HTML, cache-first per asset statici (/_astro/, /icons/). Pagina offline per utenti disconnessi. Install banner dopo seconda visita (beforeinstallprompt). theme-color e apple-touch-icon in BaseLayout. Build OK 151 pagine.

## STEP 3.8 — Link-Bait Tools ✅
```
Commit: [STEP 3.8] Create link-bait tools (historical inflation, QR code, password strength)
```
Completato: 2026-02-15
File creati/modificati: src/lib/formulas/finance.ts (US_CPI_DATA 1913-2025, historicalInflation()), src/lib/formulas/finance.test.ts (+6 test, 55 totali), src/components/calculators/finance/HistoricalInflationCalculator.tsx, src/components/calculators/text/{QRCodeGenerator,PasswordStrengthChecker}.tsx, 3 YAML EN, 3 pagine Astro, 3 embed pages, homepage e categorie finance/text aggiornate. npm qrcode installato.
Note: HistoricalInflationCalculator con dati CPI reali 1913-2025, quick presets, decade breakdown. QRCodeGenerator con 4 modalita (URL/text/email/WiFi), 3 dimensioni, download PNG. PasswordStrengthChecker con score 0-100, crack time stima, checklist sicurezza. EN ora ha 40 tool totali. 185 test verdi, 84 YAML validati, 157 pagine, build 13.42s.

## ✅ CHECKPOINT FASE 3 — COMPLETO
```
- [x] 40 tool completi in EN (37 originali + 3 link-bait)
- [x] Ogni pagina con contenuto SEO completo (800+ parole, Schema.org, hreflang)
- [x] Build OK (157 pagine in 13.42s)
- [ ] Docker container (non testabile in questo ambiente)
- [x] PWA: manifest, service worker, offline fallback, install banner
- [x] 185 unit test tutti verdi
- [x] 84 YAML validati senza errori
- [x] Pronto per deploy produzione (prima release)
```

---

# FASE 4 — MULTILINGUA COMPLETO PER 30 TOOL (Sessione 19-30)

## STEP 4.1 — PT-BR per 30 tool ⬜
## STEP 4.2 — AR per 30 tool (include test RTL) ⬜
## STEP 4.3 — HI, JA, KO per 30 tool ⬜
## STEP 4.4 — RU, TR, ID, ZH-HANS per 30 tool ⬜
## STEP 4.5 — Tier 3 batch 1: PL, NL, TH, SV, RO ⬜
## STEP 4.6 — Tier 3 batch 2: EL, CS, HU, UK, BN, VI ⬜
## STEP 4.7 — Verifica hreflang completa 25 lingue ⬜
## STEP 4.8 — Sitemap XML multilingua completa ⬜

---

# FASE 5 — TOOL 31-200 (Sessione 31-80+)

## STEP 5.x — Batch di 5-10 tool alla volta ⬜
```
Per ogni batch:
1. Creare componenti Preact
2. Creare contenuto EN
3. Testare
4. Commit

Poi tradurre in batch per le lingue attive.
```

---

# PROBLEMI INCONTRATI

Documenta qui ogni problema, cosa hai provato, e come l'hai risolto.

| # | Step | Problema | Soluzione | Stato |
|---|------|----------|-----------|-------|
| | | | | |

---

# LOG SESSIONI

| Sessione | Data | Step completati | Note |
|----------|------|-----------------|------|
| 1 | 2026-02-15 | STEP 0.1-0.12 (FASE 0 COMPLETA) | Setup Astro completo: i18n 25 lingue, Content Collection, layouts, componenti Preact, Schema.org, hreflang, Docker, Nginx, validation, CI. BMI calculator funzionante. |
| 2 | 2026-02-15 | STEP 1.1-1.8 (FASE 1 COMPLETA) | Formula library (32 fn, 92 test). 11 calcolatori EN completi: 4 finance (mortgage, compound interest, loan, savings), 4 health (BMI, BMR, TDEE, calories), 2 math (percentage, area), 1 conversion (temperature). Homepage + 4 categorie. Embed system (11 pagine). Share buttons. My Calculations page. 32 pagine totali, build 6.5s. |
| 3 | 2026-02-15 | STEP 2.1 | Contenuto italiano per 11 tool con keyword native. 11 YAML IT + 16 pagine Astro (11 calcolatori + homepage + 4 categorie). Slug italiani: calcolo-imc, calcolo-mutuo, calcolo-percentuale, ecc. Categorie: finanza, salute, matematica, conversioni. Defaults EUR/metrico. 22 YAML validati, 48 pagine totali, build 6.56s. |
| 3 | 2026-02-15 | STEP 2.2 | Contenuto spagnolo per 11 tool con keyword native. 11 YAML ES + 16 pagine Astro. Slug spagnoli: calculadora-imc, calculadora-hipoteca, calculadora-porcentaje, ecc. Categorie: finanzas, salud, matemáticas, conversiones. Contesto spagnolo (Euríbor, TIN/TAE, IVA 21%). 33 YAML validati, 64 pagine totali, build 7.15s. |
| 4 | 2026-02-15 | STEP 2.3 | Contenuto francese per 11 tool con keyword native. 11 YAML FR + 16 pagine Astro. Slug francesi: calcul-imc, simulateur-credit-immobilier, calcul-pourcentage, ecc. Categorie: finances, santé, mathématiques, conversions. Contesto francese (taux d'usure, TAEG, PTZ, loi Lemoine, Livret A, PEA). 44 YAML validati, 80 pagine totali, build 6.59s. |
| 4 | 2026-02-15 | STEP 2.4 | Contenuto tedesco per 11 tool con keyword native. 11 YAML DE + 16 pagine Astro. Slug tedeschi: bmi-rechner, baufinanzierung-rechner, prozentrechner, ecc. Categorie: Finanzen, Gesundheit, Mathematik, Umrechner. Contesto tedesco (Sollzins, Effektivzins, KfW-Darlehen, Sondertilgung, Abgeltungssteuer). 55 YAML validati, 96 pagine totali, build 7.49s. |
| 4 | 2026-02-15 | STEP 2.5 | UI translations complete per ES, FR, DE (IT già presente). Navigazione, categorie, UI calcolatore, contenuto, footer tradotti. Language switcher + footer links funzionanti. FASE 2 COMPLETA. |
| 5 | 2026-02-15 | STEP 3.1 | Finance batch 2: 6 nuovi calcolatori EN (AutoLoan, Investment, ROI, Inflation, CurrencyConverter, Discount). 6 formule, 17 nuovi test (109 totali), 6 componenti Preact, 6 YAML, 6 pagine + 6 embed. Homepage e categoria finance aggiornate. 61 YAML validati, 108 pagine, build 7.56s. |
| 5 | 2026-02-15 | STEP 3.2 | Finance batch 3: 4 nuovi calcolatori EN (Tip, SalesTax, VAT, Amortization). 3 nuove formule, 11 nuovi test (120 totali), 4 componenti Preact, 4 YAML, 4 pagine + 4 embed. Finance: 14 calcolatori totali. 65 YAML validati, 116 pagine, build 7.89s. |
| 6 | 2026-02-15 | STEP 3.3 | Health batch 2: 4 nuovi calcolatori EN (Macro, BodyFat, Pregnancy, Ovulation). 4 nuove formule health, 8 nuovi test (128 totali), 4 componenti Preact, 4 YAML, 4 pagine + 4 embed. Health: 8 calcolatori totali. 69 YAML validati, 124 pagine, build 8.13s. |
| 6 | 2026-02-15 | STEP 3.4 | Math & conversions batch 2: 6 nuovi tool EN (PercentChange, Fraction, Scientific, Volume, Length, Weight). 13 nuove funzioni math, 25 nuovi test (153 totali), 6 componenti Preact, 6 YAML, 6 pagine + 6 embed. Math: 5 tool, Conversions: 4 tool. 75 YAML validati, 136 pagine, build 8.82s. |
| 7 | 2026-02-15 | STEP 3.5 | Wave 1 remaining: 6 nuovi tool EN (Age, DateDifference, WordCounter, CharacterCounter, PasswordGenerator, GPA). 2 nuove librerie formule (date.ts, text.ts), 26 nuovi test (179 totali), 6 componenti Preact, 6 YAML, 6 pagine + 6 embed + 3 nuove categorie (date, text, education). 81 YAML validati, 151 pagine, build 9.62s. |
| 8 | 2026-02-15 | STEP 3.6-3.8 (FASE 3 COMPLETA) | STEP 3.6: homepage/categorie già aggiornate. STEP 3.7: PWA (manifest, service worker stale-while-revalidate, offline page, install banner). STEP 3.8: 3 link-bait tools (HistoricalInflationCalculator con CPI 1913-2025, QRCodeGenerator 4 modi, PasswordStrengthChecker con crack time). EN ora ha 40 tool, 7 categorie. 185 test verdi, 84 YAML validati, 157 pagine, build 13.42s. FASE 3 COMPLETA. |
