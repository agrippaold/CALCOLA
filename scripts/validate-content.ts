/**
 * Content validation script.
 * Checks all YAML tool files against quality requirements.
 * Run: npx tsx scripts/validate-content.ts
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { parse } from 'yaml';

const CONTENT_DIR = join(process.cwd(), 'src/content/tools');

const AI_BLACKLIST = [
  // English
  "in today's", "digital landscape", "game-changer", "cutting-edge",
  "revolutionary", "seamless", "robust", "holistic", "synergy",
  "paradigm shift", "empower", "leverage", "delve into", "crucial",
  "it's important to note", "it's worth noting", "at the end of the day",
  "let's dive in", "without further ado", "in conclusion",
  "comprehensive guide", "ultimate guide", "everything you need to know",
  // Italian
  "nel panorama odierno", "all'avanguardia", "rivoluzionario",
  "è importante notare che", "senza ulteriori indugi",
  "guida completa", "guida definitiva", "tutto quello che devi sapere",
  "in questo articolo vedremo", "in conclusione possiamo dire",
  // Structural
  "in this article", "in this guide", "let's explore",
  "as we can see", "as mentioned earlier", "as discussed above",
];

interface ValidationResult {
  file: string;
  errors: string[];
  warnings: string[];
}

function getAllText(tool: Record<string, unknown>): string {
  const parts: string[] = [];
  if (typeof tool.intro === 'string') parts.push(tool.intro);
  const hiw = tool.howItWorks as Record<string, unknown> | undefined;
  if (hiw && typeof hiw.content === 'string') parts.push(hiw.content);
  const faqs = tool.faqs as Array<Record<string, string>> | undefined;
  if (faqs) {
    for (const faq of faqs) {
      parts.push(faq.question || '');
      parts.push(faq.answer || '');
    }
  }
  const examples = tool.examples as Array<Record<string, string>> | undefined;
  if (examples) {
    for (const ex of examples) {
      parts.push(ex.scenario || '');
      parts.push(ex.explanation || '');
    }
  }
  return parts.join('\n\n');
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function validateTool(filePath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const relPath = relative(process.cwd(), filePath);

  let tool: Record<string, unknown>;
  try {
    const content = readFileSync(filePath, 'utf-8');
    tool = parse(content) as Record<string, unknown>;
  } catch (e) {
    return { file: relPath, errors: [`Failed to parse: ${e}`], warnings: [] };
  }

  // C1: Title
  const title = tool.title as string || '';
  if (title.length > 60) errors.push(`Title too long: ${title.length}/60 chars`);
  if (title.length < 30) warnings.push(`Title too short: ${title.length} chars`);

  // C2: Meta description
  const desc = tool.metaDescription as string || '';
  if (desc.length > 160) errors.push(`Meta description too long: ${desc.length}/160`);
  if (desc.length < 100) warnings.push(`Meta description short: ${desc.length} chars`);

  // C3: H1
  if (tool.h1 === title) warnings.push('H1 identical to Title');

  // C4: Intro
  const intro = tool.intro as string || '';
  const introWords = countWords(intro);
  if (introWords < 50) errors.push(`Intro too short: ${introWords} words (min 50)`);

  // C5: How It Works
  const hiw = tool.howItWorks as Record<string, unknown> | undefined;
  if (hiw) {
    const hiwContent = hiw.content as string || '';
    const hiwWords = countWords(hiwContent);
    if (hiwWords < 200) errors.push(`How It Works too short: ${hiwWords} words (min 200)`);
    if (!hiw.formula) errors.push('Formula missing');
    if (!hiw.academicSource) errors.push('Academic source missing');
  } else {
    errors.push('howItWorks section missing');
  }

  // C6: FAQ
  const faqs = tool.faqs as Array<Record<string, string>> | undefined;
  if (!faqs || faqs.length < 5) {
    errors.push(`FAQs insufficient: ${faqs?.length || 0}/5 minimum`);
  } else {
    faqs.forEach((faq, i) => {
      const answerWords = countWords(faq.answer || '');
      if (answerWords < 40) errors.push(`FAQ #${i + 1} answer too short: ${answerWords} words (min 40)`);
    });
  }

  // C7: Examples
  const examples = tool.examples as Array<unknown> | undefined;
  if (!examples || examples.length < 2) {
    errors.push(`Examples insufficient: ${examples?.length || 0}/2 minimum`);
  }

  // C8: Related tools
  const related = tool.relatedTools as string[] | undefined;
  if (!related || related.length < 3) {
    errors.push(`Related tools insufficient: ${related?.length || 0}/3 minimum`);
  }

  // C9: Total word count
  const allText = getAllText(tool);
  const totalWords = countWords(allText);
  if (totalWords < 800) errors.push(`Total word count: ${totalWords} (min 800)`);

  // AI1: Blacklist check
  const lowerText = allText.toLowerCase();
  for (const phrase of AI_BLACKLIST) {
    if (lowerText.includes(phrase.toLowerCase())) {
      errors.push(`AI-detect phrase found: "${phrase}"`);
    }
  }

  // AI2: Em dash check
  const emDashCount = (allText.match(/—/g) || []).length;
  if (emDashCount > 2) warnings.push(`Too many em dashes: ${emDashCount} (max 2)`);

  // S1: Last updated
  if (!tool.lastUpdated) errors.push('lastUpdated missing');

  return { file: relPath, errors, warnings };
}

function findYamlFiles(dir: string): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        files.push(...findYamlFiles(fullPath));
      } else if (entry.endsWith('.yaml') || entry.endsWith('.yml')) {
        files.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return files;
}

// Main
const files = findYamlFiles(CONTENT_DIR);
if (files.length === 0) {
  console.log('No YAML files found in', CONTENT_DIR);
  process.exit(0);
}

let hasErrors = false;
console.log(`\nValidating ${files.length} content file(s)...\n`);

for (const file of files) {
  const result = validateTool(file);
  const status = result.errors.length > 0 ? 'FAIL' : 'PASS';

  if (result.errors.length > 0 || result.warnings.length > 0) {
    console.log(`[${status}] ${result.file}`);
    for (const err of result.errors) {
      console.log(`  ERROR: ${err}`);
    }
    for (const warn of result.warnings) {
      console.log(`  WARN:  ${warn}`);
    }
    console.log();
  } else {
    console.log(`[${status}] ${result.file}`);
  }

  if (result.errors.length > 0) hasErrors = true;
}

console.log(`\n${files.length} file(s) checked. ${hasErrors ? 'ERRORS FOUND' : 'ALL PASSED'}\n`);
process.exit(hasErrors ? 1 : 0);
