// Regression — no «Claude» brand leak in real /app/chat user-facing surface.
//
// Pattern mirrors Wave 2.6 HIGH-3 (Rule 4 grep regression in
// `src/app/(marketing)/page.test.tsx`). Pre-alpha audit found 3 user-facing
// strings that read «Claude» instead of the product name «Provedo». This
// test fails if any chat-component source file (excluding test files and
// SDK import paths) contains the case-sensitive token «Claude».
//
// Allowed contexts (skipped by design):
//   - `*.test.{ts,tsx}` files — fixture content like "Hello Claude" exercises
//     the rendering pipeline with arbitrary user text and is not user-facing
//     copy in the product itself.
//   - `import` statements referencing `@anthropic-ai/...` SDKs — those are
//     vendor namespace identifiers, not brand-facing copy.

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const CHAT_DIR = path.resolve(process.cwd(), 'src', 'components', 'chat');
const SCANNABLE_EXT = /\.tsx?$/;
const TEST_FILE = /\.(test|spec)\.tsx?$/;
// Token must be the literal product-name leak — case sensitive «Claude».
// We deliberately do NOT match lowercase or other casings to avoid false
// positives on identifiers we do not control (e.g. CSS class names that
// happen to contain the substring).
const LEAK_PATTERN = /\bClaude\b/;

interface Offender {
  file: string;
  line: number;
  text: string;
}

function collectFiles(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, out);
      continue;
    }
    if (!SCANNABLE_EXT.test(entry.name)) continue;
    if (TEST_FILE.test(entry.name)) continue;
    out.push(full);
  }
}

function isAllowedLine(line: string): boolean {
  // Vendor SDK imports are infrastructure, not user-facing copy.
  if (/from\s+['"]@anthropic-ai\//.test(line)) return true;
  if (/import\(\s*['"]@anthropic-ai\//.test(line)) return true;
  return false;
}

function findOffendersInFile(file: string): Offender[] {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const offenders: Offender[] = [];
  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx] ?? '';
    if (isAllowedLine(line)) continue;
    if (LEAK_PATTERN.test(line)) {
      offenders.push({ file, line: idx + 1, text: line.trim() });
    }
  }
  return offenders;
}

describe('Chat surface — no «Claude» brand leak (P1 audit fix)', () => {
  it('user-facing chat component sources never contain the token «Claude»', () => {
    const files: string[] = [];
    collectFiles(CHAT_DIR, files);
    const offenders = files.flatMap(findOffendersInFile);

    if (offenders.length > 0) {
      const summary = offenders.map((o) => `${o.file}:${o.line} → ${o.text}`).join('\n');
      throw new Error(
        `Brand-leak violation — «Claude» token found in user-facing chat source:\n${summary}`,
      );
    }
    expect(offenders).toEqual([]);
  });
});
