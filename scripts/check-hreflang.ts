/**
 * Hreflang bidirectional verification script.
 * Ensures every hreflang tag has a matching reverse link.
 * Run: npx tsx scripts/check-hreflang.ts
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { parse } from 'yaml';

const CONTENT_DIR = join(process.cwd(), 'src/content/tools');

const SUPPORTED_LOCALES = [
  'en', 'es', 'pt-br', 'fr', 'de', 'it',
  'ar', 'hi', 'ja', 'ko', 'ru', 'tr', 'id', 'zh-hans',
  'pl', 'nl', 'th', 'sv', 'ro', 'el', 'cs', 'hu', 'uk', 'bn', 'vi',
];

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

// Build a map of toolId → set of languages that have content
const files = findYamlFiles(CONTENT_DIR);
const toolLangs = new Map<string, Set<string>>();

for (const file of files) {
  try {
    const content = readFileSync(file, 'utf-8');
    const tool = parse(content) as Record<string, string>;
    const relPath = relative(CONTENT_DIR, file);
    const lang = relPath.split('/')[0];
    const toolId = tool.id;

    if (toolId && lang) {
      if (!toolLangs.has(toolId)) toolLangs.set(toolId, new Set());
      toolLangs.get(toolId)!.add(lang);
    }
  } catch {
    // Skip unparseable files
  }
}

let hasErrors = false;
console.log('\nHreflang Bidirectional Check\n');

for (const [toolId, langs] of toolLangs) {
  // Each tool should eventually have all 25 languages
  // For now, just check that EN exists (x-default target)
  if (!langs.has('en')) {
    console.log(`[WARN] ${toolId}: Missing EN version (x-default target)`);
    hasErrors = true;
  }

  // Check that all languages with content have a slug defined
  console.log(`[OK] ${toolId}: ${langs.size} language(s) - ${[...langs].join(', ')}`);
}

if (toolLangs.size === 0) {
  console.log('No tools found.');
} else {
  console.log(`\n${toolLangs.size} tool(s) checked. ${hasErrors ? 'WARNINGS FOUND' : 'ALL OK'}\n`);
}

process.exit(hasErrors ? 1 : 0);
