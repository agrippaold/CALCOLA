# CALCHUB — STEP TRACKER
## Sistema di Checkpoint per Sviluppo Resumabile

**ISTRUZIONI:** Questo file è il tuo "salvataggio". Aggiorna lo stato di ogni step
quando lo completi. Se la sessione si interrompe, la prossima sessione leggerà
questo file per sapere da dove ripartire.

**Stato:** ⬜ Da fare | 🔄 In corso | ✅ Completato | ⚠️ Problema

---

## STATO ATTUALE

**Ultimo step completato:** STEP 0.5b
**Prossimo step da eseguire:** STEP 0.6
**Branch attivo:** claude/start-step-0.1-OD4hw
**Build status:** OK (npm run build passa senza errori)

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

## STEP 0.6 — Componenti Contenuto Statici ⬜
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
Completato:
File creati/modificati:
Note:

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
Completato:
File creati/modificati:
Note:

## STEP 0.8 — Schema.org Generators ⬜
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
Completato:
File creati/modificati:
Note:

## STEP 0.9 — Hreflang e SEO ⬜
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
Completato:
File creati/modificati:
Note:

## STEP 0.10 — Routing Dinamico ⬜
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
Completato:
File creati/modificati:
Note:

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
Completato:
File creati/modificati:
Note:

## STEP 0.12 — Validazione e Script ⬜
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
Completato:
File creati/modificati:
Note:

## ✅ CHECKPOINT FASE 0
```
Al completamento di tutti gli step 0.x:
- [ ] npm run build completa senza errori
- [ ] docker compose up mostra sito funzionante
- [ ] Almeno 1 pagina calcolatore (BMI EN) renderizza completamente
- [ ] Schema.org valido su quella pagina
- [ ] Hreflang tags presenti
- [ ] Lighthouse Performance ≥ 95
- [ ] Repository pushato su GitHub con tutti i commit
```

---

# FASE 1 — PRIMI 10 CALCOLATORI (Sessione 3-6)

Obiettivo: 10 calcolatori funzionanti in EN con contenuto SEO completo.
Questi sono i tool ad altissima priorità 🔴.

## STEP 1.1 — Formula Library ⬜
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
Completato:
File creati/modificati:
Note:

## STEP 1.2 — Calcolatore BMI (tool pilota) ⬜
```
Questo è il PRIMO calcolatore completo. Usalo come modello per tutti gli altri.

Azioni:
1. Creare src/components/calculators/health/BMICalculator.tsx
   - Input: peso, altezza, sistema (metric/imperial)
   - Output: BMI, categoria (sottopeso/normale/sovrappeso/obeso)
   - Barra visuale colorata del risultato
   - Real-time (no bottone calcola)
2. Creare src/content/tools/en/bmi-calculator.yaml — contenuto COMPLETO:
   - title, metaDescription, h1, slug
   - primaryKeyword: "bmi calculator"
   - intro (100+ parole)
   - howItWorks (200+ parole con formula BMI e citazione WHO)
   - 6 FAQ con risposte 50+ parole
   - 3 esempi pratici
   - relatedTools
3. Verificare che la pagina completa renderizzi su /en/health/bmi-calculator/

Verifica:
- Calcolatore funziona con input validi e invalidi
- Tutti i 4 Schema.org presenti e validi
- Word count totale ≥ 800
- Lighthouse 100/100
Commit: [STEP 1.2] BMI Calculator — complete with SEO content
```
Completato:
File creati/modificati:
Note:

## STEP 1.3 — Calcolatori Finance Batch 1 (4 tool) ⬜
```
Azioni — per OGNUNO dei 4 tool:
1. Creare componente Preact
2. Creare file YAML contenuto EN completo
3. Testare calcoli
4. Verificare rendering pagina

Tool:
- MortgageCalculator → /en/finance/mortgage-calculator/
- CompoundInterestCalculator → /en/finance/compound-interest-calculator/
- LoanCalculator → /en/finance/loan-calculator/
- SavingsCalculator → /en/finance/savings-calculator/

Verifica: 4 pagine complete, build OK, Schema valido su tutte
Commit: [STEP 1.3] Finance calculators batch 1 (mortgage, compound interest, loan, savings)
```
Completato:
File creati/modificati:
Note:

## STEP 1.4 — Calcolatori Health Batch 1 (3 tool) ⬜
```
Tool:
- BMRCalculator → /en/health/bmr-calculator/
- TDEECalculator → /en/health/tdee-calculator/
- CalorieCalculator → /en/health/calorie-calculator/

Verifica: 3 pagine complete + BMI = 4 health tool funzionanti
Commit: [STEP 1.4] Health calculators batch 1 (BMR, TDEE, calories)
```
Completato:
File creati/modificati:
Note:

## STEP 1.5 — Calcolatori Math + Conversions (3 tool) ⬜
```
Tool:
- PercentageCalculator → /en/math/percentage-calculator/
- AreaCalculator → /en/math/area-calculator/
- TemperatureConverter → /en/conversions/temperature-converter/

Verifica: 3 pagine complete
Commit: [STEP 1.5] Math and conversion tools (percentage, area, temperature)
```
Completato:
File creati/modificati:
Note:

## STEP 1.6 — Homepage e Categorie ⬜
```
Azioni:
1. Creare homepage EN: lista categorie + tool in evidenza + hero section
2. Creare pagine categoria EN: /en/finance/, /en/health/, /en/math/, /en/conversions/
3. Ogni categoria mostra griglia tool con titolo + breve descrizione
4. Internal linking: ogni pagina linka alle altre tramite categorie

Verifica: Navigazione completa Home → Categoria → Tool → Related Tools
Commit: [STEP 1.6] Create homepage and category pages
```
Completato:
File creati/modificati:
Note:

## STEP 1.7 — Sistema Embed (Backlink Virale) ⬜
```
Azioni:
1. Creare route /embed/[lang]/[slug].astro — calcolatore standalone (no header, no footer, no ads)
2. Creare componente EmbedCode.astro — modale con codice iframe pronto da copiare
3. Il codice embed include SEMPRE link back: <p>Calculator by <a href="https://calchub.com">CalcHub</a></p>
4. Aggiungere bottone "Embed this calculator" su ogni pagina tool
5. Styling embed: compatto, responsive, light theme

Verifica: iframe funziona su pagina HTML esterna di test
Commit: [STEP 1.7] Create embeddable calculator system with backlink
```
Completato:
File creati/modificati:
Note:

## STEP 1.8 — Engagement & Share ⬜
```
Azioni:
1. Creare ShareButtons.astro — condividi risultato (Twitter, LinkedIn, WhatsApp, Copy link)
2. Creare SmartRelatedTools.astro — correlazione contestuale (non lista statica):
   - Mutuo → "Calcola anche: Spese notarili, Confronto affitto/acquisto"
   - BMI → "Il tuo prossimo passo: TDEE, Fabbisogno calorico"
3. Creare pagina /my-calculations/ — storico calcoli salvati (localStorage)
4. Integrare SaveCalculation e ShareButtons nel CalculatorShell

Commit: [STEP 1.8] Add engagement features (share, smart related, saved calculations)
```
Completato:
File creati/modificati:
Note:

## ✅ CHECKPOINT FASE 1
```
Al completamento:
- [ ] 10 calcolatori funzionanti in EN con grafici interattivi
- [ ] Ogni pagina ha 800+ parole, 4+ Schema (incl. Person), hreflang
- [ ] Author byline su ogni pagina
- [ ] Pagine trust (About, Methodology, Privacy, Terms) live
- [ ] Embed system funzionante con backlink obbligatorio
- [ ] Homepage + 4 pagine categoria
- [ ] Navigazione interna completa + smart related tools
- [ ] Build < 30 secondi
- [ ] Docker container serve tutto correttamente
- [ ] Lighthouse Performance ≥ 95, Accessibility ≥ 90
```

---

# FASE 2 — MULTILINGUA PRIMO BATCH (Sessione 7-10)

Obiettivo: I 10 tool tradotti in IT, ES, FR, DE (4 lingue extra = 40 nuove pagine).

## STEP 2.1 — Contenuto IT per 10 tool ⬜
```
Azioni:
1. Creare src/content/tools/it/ con 10 file YAML
2. Ogni file con keyword NATIVE italiane (non tradotte da EN!)
   - "bmi calculator" → "calcolo bmi" (keyword nativa)
   - "mortgage calculator" → "calcolo mutuo" (keyword nativa)
3. Slug in italiano: "calcolo-bmi", "calcolo-mutuo", etc.
4. FAQ specifiche per mercato italiano
5. Default: EUR, sistema metrico, formato 1.234,56

Verifica: 10 pagine IT renderizzano, hreflang bidirezionale EN↔IT
Commit: [STEP 2.1] Italian content for 10 tools with native keywords
```
Completato:
File creati/modificati:
Note:

## STEP 2.2 — Contenuto ES per 10 tool ⬜
```
Come STEP 2.1 ma per spagnolo.
Keyword native: "calculadora imc", "calculadora hipoteca", etc.
Commit: [STEP 2.2] Spanish content for 10 tools with native keywords
```

## STEP 2.3 — Contenuto FR per 10 tool ⬜
```
Keyword native: "calcul imc", "simulateur credit immobilier", etc.
Commit: [STEP 2.3] French content for 10 tools with native keywords
```

## STEP 2.4 — Contenuto DE per 10 tool ⬜
```
Keyword native: "bmi rechner", "hypothekenrechner", etc.
Commit: [STEP 2.4] German content for 10 tools with native keywords
```

## STEP 2.5 — UI Strings e Language Switcher ⬜
```
Azioni:
1. Completare ui.ts con tutte le stringhe per IT, ES, FR, DE
2. Testare language switcher (header + footer links)
3. Verificare che il footer mostra TUTTE le lingue come link visibili
4. Verificare hreflang bidirezionale per tutte le combinazioni

Commit: [STEP 2.5] Complete UI translations and language switcher for 5 languages
```

## ✅ CHECKPOINT FASE 2
```
- [ ] 10 tool × 5 lingue = 50 pagine totali
- [ ] Hreflang bidirezionale verificato per tutte le pagine
- [ ] Language switcher funzionante
- [ ] Build completa senza errori
- [ ] Docker serve tutte le pagine correttamente
```

---

# FASE 3 — ESPANSIONE TOOL 11-30 EN (Sessione 11-18)

Obiettivo: Completare i primi 30 tool 🔴 in EN.

## STEP 3.1 — Finance Batch 2 (6 tool) ⬜
```
AutoLoan, Investment, ROI, Inflation, CurrencyConverter, Discount
Commit: [STEP 3.1] Finance batch 2 (auto loan, investment, ROI, inflation, currency, discount)
```

## STEP 3.2 — Finance Batch 3 (4 tool) ⬜
```
Tip, SalesTax, VAT, Amortization
Commit: [STEP 3.2] Finance batch 3 (tip, sales tax, VAT, amortization)
```

## STEP 3.3 — Health Batch 2 (4 tool) ⬜
```
Macro, PregnancyDueDate, Ovulation, BodyFat (non presente Wave 1, sostituire con tool 🔴 health)
Verifica lista tool 🔴 in GUIDA sezione 4.3
Commit: [STEP 3.3] Health batch 2
```

## STEP 3.4 — Math & Conversions Batch 2 (6 tool) ⬜
```
PercentChange, Fraction, Scientific, Volume, LengthConverter, WeightConverter
Commit: [STEP 3.4] Math and conversions batch 2
```

## STEP 3.5 — Remaining Wave 1 tools ⬜
```
Completare tutti i tool 🔴 rimanenti dalla lista in GUIDA sezione 4.x
AgeCalc, DateDiff, DateCalc, SqFootage, Concrete, WordCounter, CharCounter, 
PasswordGen, GPA, Grade, ElectricityCost, InchesToCM, CMToInches, KGToLBS, 
LBSToKG, CelsiusToFahrenheit, FahrenheitToCelsius, TimezoneConv
Commit: [STEP 3.5] Complete all Wave 1 (red priority) tools
```

## STEP 3.6 — Categorie e Homepage aggiornate ⬜
```
Aggiornare homepage e pagine categoria per mostrare tutti i 30 tool
Commit: [STEP 3.6] Update homepage and categories for 30 tools
```

## STEP 3.7 — PWA Base ⬜
```
Azioni:
1. Installare @vite-pwa/astro o creare manualmente:
   - public/manifest.json (name, icons, theme_color, background_color, display: standalone)
   - Icone: 192x192, 512x512 PNG
2. Service worker con strategia stale-while-revalidate:
   - Cache pagine visitate per uso offline
   - Cache asset statici (CSS, JS, font)
3. Offline fallback: pagina "Sei offline — i calcolatori visitati sono ancora disponibili"
4. Banner "Installa CalcHub" discreto dopo la seconda visita (beforeinstallprompt)

Verifica: Lighthouse PWA score ≥ 80, installabile su Android Chrome
Commit: [STEP 3.7] Add PWA support (manifest, service worker, offline)
```

## STEP 3.8 — Link-Bait Tools ⬜
```
Tool progettati specificamente per generare backlink:
1. InflationCalculator — "Quanto valevano €100 nel [anno]?" con dati storici
2. QRCodeGenerator — utility gratuita, tutti linkano come risorsa
3. PasswordStrengthChecker — ogni blog tech linka al "miglior checker gratuito"
4. Ognuno con contenuto SEO completo come gli altri tool

Commit: [STEP 3.8] Create link-bait tools (inflation, QR code, password checker)
```

## ✅ CHECKPOINT FASE 3
```
- [ ] 30 tool completi in EN
- [ ] Ogni pagina con contenuto SEO completo
- [ ] Build OK, Docker OK
- [ ] Pronto per deploy produzione (prima release)
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
| 1 | 2026-02-15 | STEP 0.1-0.5b | Setup Astro + struttura + i18n + Content Collection + layouts + componenti + E-E-A-T trust |
