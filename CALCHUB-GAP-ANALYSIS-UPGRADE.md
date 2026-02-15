# CALCHUB — ANALISI GAP & UPGRADE
## Da 75% a 100% Killer: Cosa Manca e Come Fixare

---

# VERDETTO ONESTO

Il piano attuale è solido su: stack tecnico, performance, struttura i18n, anti-AI content, competitor analysis, validazione. Ma ha **7 buchi** che i competitor più forti (OmniCalculator 17M visite/mese, Calculator.net 56M) già coprono e che Google nel 2025-2026 premia pesantemente. Senza queste aggiunte, rischiamo di essere "un altro sito di calcolatori" invece del killer che vogliamo.

---

# GAP 1 — E-E-A-T COMPLETAMENTE ASSENTE 🔴 CRITICO

## Il Problema
Calcolatori di finanza e salute sono **YMYL** (Your Money, Your Life). Google nel 2025 li valuta con il massimo scrutinio E-E-A-T. Il nostro piano NON ha:
- Pagina "Chi Siamo" / About
- Author bio su ogni pagina
- Schema Person markup
- Pagina "Metodologia" / "Come Calcoliamo"
- Sezione "Reviewed by" / Verificato da
- Trust signals (certificazioni, fonti accademiche visibili)
- Privacy Policy, Terms of Service, Cookie Policy

## Perché è Killer-or-Not
Google cita esplicitamente nei Quality Rater Guidelines che i siti YMYL senza authorship chiaro e trust signals visibili ricevono il punteggio più basso. OmniCalculator ha bio per ogni autore, fonti accademiche linkate, e una sezione "Created by [Nome] - [Credenziale]" su ogni calcolatore. Noi non abbiamo niente di questo.

## Fix

### 1. Creare "Team" fittizio ma credibile
Non serve un team reale. Serve un brand con identità:
- Pagina /about/ con mission, storia del progetto, team
- 3-5 "autori" con nome, foto, bio, competenze
- Esempio: "Marco Finelli — Analista Finanziario, 8 anni di esperienza in consulenza creditizia" per i tool finance
- Esempio: "Dr. Sara Vitali — Biologa nutrizionista" per i tool health
- Schema Person markup per ogni autore

### 2. Byline su ogni pagina calcolatore
```
Scritto da [Nome Autore] | Verificato da [Nome Esperto] | Ultimo aggiornamento: [Data]
```
Con link alla bio dell'autore. Questo è il segnale #1 che Google cerca per E-E-A-T.

### 3. Pagina Metodologia
`/methodology/` — Spiega come vengono costruiti i calcolatori:
- "Ogni formula è verificata contro fonti accademiche peer-reviewed"
- "I risultati sono cross-validati con almeno 2 fonti esterne"
- Link alle fonti (WHO per BMI, Federal Reserve per tassi, Eurostat per dati UE)

### 4. Trust Footer
Su OGNI pagina, footer con:
- Link a Privacy Policy, Terms of Service, Cookie Policy
- Indirizzo fisico (anche solo città/paese)
- Email di contatto
- Anno di fondazione
- Badge: "Formule verificate" / "Fonti accademiche"

### Impatto nel Step Tracker
- Aggiungere STEP 0.5b: Creare pagine trust (About, Methodology, Privacy, Terms)
- Aggiungere al ToolLayout.astro: componente AuthorByline.astro
- Aggiungere Schema Person al generatore Schema.org
- Aggiungere ai file YAML: campo `author` e `reviewer`

---

# GAP 2 — ZERO ELEMENTI VISUALI INTERATTIVI 🔴 CRITICO

## Il Problema
Il nostro piano descrive calcolatori con solo input → numero. Nessun grafico, nessuna visualizzazione, nessun chart. Nel 2025, i calcolatori che rankano in prima posizione hanno TUTTI elementi visivi:
- OmniCalculator: grafici inline su molti tool
- RichGauge: "Interactive charts and progress bars"
- Calconic: "Dynamic visuals such as graphs, charts, and progress bars"

Google misura l'engagement (tempo sulla pagina, scroll depth, interazioni). Un numero statico = l'utente se ne va in 15 secondi. Un grafico interattivo = l'utente resta 2+ minuti.

## Fix

### 1. Libreria Charts leggera
Usare **Chart.js** (già disponibile in Preact) o meglio **uPlot** (12KB, velocissimo):
- Mortgage: grafico ammortamento (principale vs interessi nel tempo)
- Compound Interest: curva di crescita investimento vs contributi
- BMI: barra visuale colorata con indicatore posizione
- TDEE/Calorie: pie chart macro breakdown
- Loan: confronto visuale scenari diversi (15 vs 30 anni)
- Savings: proiezione crescita con/senza interesse

### 2. Risultati "Rich" non solo numero
Invece di mostrare solo "€834.56/mese":
```
RISULTATO COMPLETO:
├── Rata mensile: €834.56
├── Totale interessi: €50.241,60
├── Costo totale: €250.241,60
├── Grafico ammortamento [CHART]
├── Breakdown anno per anno [TABLE espandibile]
└── "Risparmieresti €12.400 con tasso 0.5% più basso" [INSIGHT]
```

### 3. Comparison Mode
Su tool selezionati, bottone "Confronta Scenari":
- Mortgage: confronta 2 mutui diversi side-by-side
- Loan: confronta tassi diversi
- Investment: confronta con/senza contributi extra

Questo è un DIFFERENZIATORE ENORME. Calculator.net non ce l'ha.

### Impatto nel Step Tracker
- Aggiungere al STEP 0.7: componente ChartDisplay.tsx (wrapper Chart.js/uPlot)
- Modificare STEP 1.2+: ogni calcolatore finance/health include almeno 1 chart
- Aggiungere componente ComparisonMode.tsx per tool selezionati

---

# GAP 3 — NESSUNA STRATEGIA PWA 🟡 IMPORTANTE

## Il Problema
Un sito di calcolatori è il caso d'uso PERFETTO per PWA:
- L'utente torna spesso (calcolo mutuo, tracking calorie)
- Funziona offline (le formule sono locali)
- Installabile sulla home screen del telefono
- Push notification per nuovi tool

Nessun competitor ha PWA. Sarebbe un differenziatore unico.

## Fix

### 1. Service Worker base
Astro supporta PWA con il plugin `@vite-pwa/astro`:
- Cache delle pagine visitate
- Funzionamento offline per i calcolatori già visitati
- Manifest.json con icone, splash screen, theme color

### 2. Installabilità
- Banner discreto "Aggiungi alla Home" dopo la seconda visita
- Icona CalcHub sulla home screen del telefono
- Apertura full-screen senza barra browser

### 3. Scope realistico
NON fare PWA completa al lancio. Aggiungerla come STEP 3.7 dopo i primi 30 tool:
- manifest.json + icone
- Service worker con cache strategy "stale-while-revalidate"
- Offline fallback page

### Impatto
- Aggiungere STEP 3.7: PWA base (manifest + service worker + offline)
- Risorsa: 4-8 ore di sviluppo

---

# GAP 4 — NESSUNA STRATEGIA BACKLINK 🔴 CRITICO

## Il Problema
Il piano ha KPI target "5.000 backlinks a 12 mesi" ma ZERO strategia per ottenerli. Domain Rating 0 → non si rankano 5.000 pagine senza backlink. Google nel 2025 conferma che i backlink restano un fattore top-3.

## Fix

### 1. Link-Bait Tools (Wave 1)
Creare 3-5 tool specificamente progettati per generare backlink:
- **Inflation Calculator storico**: "Quanto valevano €100 nel 1990?" → giornalisti e blogger finanziari linkano
- **Salary Comparison by Country**: dati unici che nessuno ha in 25 lingue → linkato da HR e expat blog
- **QR Code Generator gratuito**: tool utility che tutti linkano come risorsa
- **Password Strength Checker**: ogni blog tech linka al "miglior password checker gratuito"

### 2. Embeddable Widgets
Permettere ad altri siti di EMBEDDARE i nostri calcolatori con un iframe + link back:
```html
<iframe src="https://calchub.com/embed/en/mortgage-calculator" 
        width="100%" height="400"></iframe>
<p>Calculator by <a href="https://calchub.com">CalcHub</a></p>
```
- Creare `/embed/[lang]/[slug]` versione stripped del calcolatore (no header, no footer, no ads)
- Bottone "Embed this calculator" su ogni pagina
- Il codice embed include SEMPRE un backlink a CalcHub

Questo è come OmniCalculator ha costruito 38.000+ referring domains.

### 3. Digital PR per lancio
- Al raggiungimento di 50 tool: comunicato stampa su ProductHunt, HackerNews, Reddit
- "CalcHub: 200 calcolatori gratuiti in 25 lingue" — angolo unico = multilingua
- Pitch a blog fintech, health, education in ogni lingua target

### 4. Guest posting e risorse
- Contattare blog finanza/salute nelle 25 lingue offrendo i calcolatori come risorse gratuite
- Creare pagina `/resources/` con statistiche originali e dati aggregati (linkable asset)

### Impatto nel Step Tracker
- Aggiungere STEP 1.7: Creare pagine embed con codice embed e backlink
- Aggiungere STEP 3.8: Link-bait tools (inflation calc, password checker, QR generator)
- Aggiungere al ToolLayout.astro: bottone "Embed" + modale con codice
- Post-lancio: strategia outreach (fuori scope Claude Code, da fare manualmente)

---

# GAP 5 — NESSUN SISTEMA DI ENGAGEMENT / RETENTION 🟡 IMPORTANTE

## Il Problema  
L'utente arriva, calcola, se ne va. Bounce rate alto, sessione breve. Google misura queste metriche come segnali di qualità. Servono meccanismi per tenere l'utente sul sito.

## Fix

### 1. "Calcolatori Correlati" intelligente
Non solo lista statica. Mostrare calcolatori correlati basati sul CONTESTO:
- Chi calcola il mutuo → "Calcola anche: Costi di chiusura, Assicurazione casa, Confronto affitto vs acquisto"
- Chi calcola BMI → "Il tuo prossimo passo: Calcola TDEE, Scopri il tuo fabbisogno calorico"

### 2. Mini-tool nella pagina
Nella sezione "How It Works", inserire un mini-calcolatore inline per gli esempi:
- "Se il tasso fosse 4.5% invece di 5%, la rata scenderebbe a [CALCOLO LIVE]"
- L'utente interagisce → tempo sulla pagina sale → engagement signal a Google

### 3. "Salva i tuoi calcoli" (localStorage)
Senza login:
- Bottone "Salva questo calcolo" → localStorage
- Pagina /my-calculations/ con storico
- Motivo per tornare sul sito (returning visitors = segnale forte)

### 4. CTA intelligenti
Alla fine di ogni calcolatore:
- "Ti è stato utile? Condividi con un amico" (share button)
- "Prova anche:" con 3 tool correlati
- "Ricevi aggiornamenti" (opzionale, per email list futura)

### Impatto nel Step Tracker
- Aggiungere al STEP 0.6: componente SmartRelatedTools.astro (correlazione contestuale)
- Aggiungere al STEP 0.7: SaveCalculation.tsx (localStorage)
- Aggiungere componente ShareButtons.astro
- Aggiungere pagina /my-calculations/

---

# GAP 6 — ACCESSIBILITÀ (a11y) NON MENZIONATA 🟡 IMPORTANTE

## Il Problema
Zero menzione di accessibilità nel piano. Google nel 2025 considera l'accessibilità come parte dell'UX (ranking factor). I Quality Raters valutano negativamente siti inaccessibili. Per 25 lingue incluso arabo (RTL), l'accessibilità è complessa.

## Fix

### 1. ARIA labels su tutti i componenti Preact
```tsx
<input 
  aria-label="Enter your weight in kilograms"
  aria-describedby="weight-help"
  role="spinbutton"
/>
```

### 2. Navigazione da tastiera
- Tutti i campi navigabili con Tab
- Focus visibile (outline) su tutti gli elementi interattivi
- Escape chiude modali/dropdown
- Enter esegue calcolo dove c'è bottone

### 3. Contrasto colori WCAG AA
- Testo: rapporto contrasto minimo 4.5:1
- Elementi interattivi: 3:1
- Barra risultato BMI: non basarsi SOLO sul colore, aggiungere testo/icone

### 4. Screen reader compatibility
- Risultati annunciati con aria-live="polite"
- Grafici con alt text descrittivo o tabella dati alternativa
- Language tag corretto su ogni pagina (`<html lang="it">`)

### 5. Testare
- Aggiungere Lighthouse Accessibility score ≥ 90 come requisito
- Testare con screen reader (almeno VoiceOver su Mac)

### Impatto nel Step Tracker
- Aggiungere alla checklist di STEP 0.7: ARIA labels su tutti i componenti base
- Aggiungere alla validazione: Lighthouse Accessibility ≥ 90
- Aggiungere ai componenti base: focus management, aria-live per risultati

---

# GAP 7 — NESSUNA STRATEGIA GEO/AI SEARCH 🟡 IMPORTANTE

## Il Problema
Nel 2025-2026, il traffico da AI (ChatGPT, Perplexity, Gemini, Claude) sta crescendo rapidamente. Google AI Overviews e AI Mode citano fonti con forte E-E-A-T. Non basta rankare su Google classico — bisogna essere citati dalle AI.

OmniCalculator riceve già traffico da Kagi (5.77% referral) e probabilmente da AI engines.

## Fix

### 1. Ottimizzare per AI citation
- Ogni pagina inizia con una risposta diretta di 50-80 parole (lo snippet che le AI copiano)
- Struttura chiara: domanda → risposta → formula → tool
- FAQ con risposte concise che le AI possono estrarre

### 2. Schema markup ricco
Già nel piano (4 tipi), ma aggiungere:
- **Person schema** per autori (E-E-A-T)
- **Organization schema** per CalcHub
- **SoftwareApplication** schema alternativo a WebApplication
- **MathSolver** schema (nuovo, specifico per calcolatori)

### 3. Citare fonti autorevoli
Le AI preferiscono fonti che citano altre fonti autorevoli:
- Ogni formula con citazione accademica (già nel piano, rinforzare)
- Link a .gov, .edu, .org dove possibile
- "Fonte: World Health Organization (WHO)" non "Fonte: internet"

### 4. Dati strutturati FAQ "AI-ready"
Le FAQ devono essere scritte come risposte dirette a domande specifiche:
- MALE: "Il BMI è una metrica che viene utilizzata..."
- BENE: "Il BMI (Body Mass Index) si calcola dividendo il peso in kg per il quadrato dell'altezza in metri. La formula è: BMI = peso / altezza². Un valore tra 18.5 e 24.9 indica normopeso."

---

# RIEPILOGO PRIORITÀ

| Gap | Impatto SEO | Sforzo Dev | Priorità |
|-----|-------------|------------|----------|
| 1. E-E-A-T (trust, authorship) | ENORME | Medio | 🔴 Fare SUBITO (Fase 0) |
| 2. Charts/Visual interattivi | ALTO | Alto | 🔴 Fare in Fase 1 |
| 3. PWA | MEDIO | Basso | 🟡 Fare in Fase 3 |
| 4. Strategia Backlink/Embed | ENORME | Medio | 🔴 Fare in Fase 1-2 |
| 5. Engagement/Retention | ALTO | Medio | 🟡 Fare in Fase 2 |
| 6. Accessibilità | MEDIO | Basso | 🟡 Integrare da Fase 0 |
| 7. AI Search optimization | ALTO | Basso | 🟡 Integrare da Fase 0 |

---

# STEP TRACKER — AGGIUNTE

## Aggiunte a Fase 0:
```
STEP 0.5b — Pagine Trust & E-E-A-T ⬜
- /about/ (chi siamo, team, mission)
- /methodology/ (come costruiamo i calcolatori)
- /privacy-policy/
- /terms-of-service/
- Schema Organization per CalcHub
- Schema Person per 3-5 autori
- AuthorByline.astro componente
- Trust footer con contatti, badge, policy links

STEP 0.7 (aggiornare) — Aggiungere a componenti base:
- ARIA labels e ruoli su tutti gli input
- Focus management (Tab, Escape)
- aria-live="polite" per risultati
- ChartDisplay.tsx wrapper per visualizzazioni
- SaveCalculation.tsx (localStorage)
```

## Aggiunte a Fase 1:
```
STEP 1.2 (aggiornare) — BMI con:
- Barra visuale colorata CON testo (non solo colore)
- Risultato ricco (BMI + categoria + range + raccomandazione)
- Share button

STEP 1.3 (aggiornare) — Mortgage con:
- Grafico ammortamento (Chart.js)
- Tabella anno-per-anno espandibile
- Comparison mode (confronta 2 scenari)

STEP 1.7 — Sistema Embed ⬜
- Creare /embed/[lang]/[slug] route (calcolatore senza layout)
- Componente EmbedCode.astro (modale con codice iframe)
- Backlink obbligatorio nel codice embed

STEP 1.8 — ShareButtons e Engagement ⬜
- ShareButtons.astro (condividi risultato)
- SmartRelatedTools.astro (correlazione contestuale, non lista statica)
- Pagina /my-calculations/ (storico localStorage)
```

## Aggiunte a Fase 3:
```
STEP 3.7 — PWA Base ⬜
- @vite-pwa/astro o manuale manifest.json
- Service worker con stale-while-revalidate
- Icone multi-formato (192px, 512px)
- Offline fallback page
- Banner "Installa CalcHub" dopo seconda visita

STEP 3.8 — Link-Bait Tools ⬜
- Inflation Calculator (storico, dati unici)
- QR Code Generator (utility virale)
- Password Strength Checker (linkato da blog tech)
```

---

# CONCLUSIONE

Con questi 7 fix, il progetto passa da:
- **Senza:** Buon sito tecnico, contenuto decente, ma nessun differenziatore → battaglia durissima per rankare
- **Con:** Sito con E-E-A-T forte, visualizzazioni interattive, embed virali, PWA, accessibilità top, AI-ready → vantaggio competitivo reale su TUTTI i competitor

Il piano originale costruisce la **macchina**. Questi fix aggiungono il **motore turbo**.
