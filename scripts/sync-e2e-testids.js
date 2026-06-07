#!/usr/bin/env node
/**
 * Regenerates e2e/testIds.js from source/testing/testIds.ts structure.
 * Run after changing testIds.ts: node scripts/sync-e2e-testids.js
 *
 * For dynamic IDs (functions), the e2e file keeps hand-written helpers —
 * this script validates that static keys still align.
 */

const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, '../source/testing/testIds.ts');
const jsPath = path.join(__dirname, '../e2e/testIds.js');

const source = fs.readFileSync(tsPath, 'utf8');
const staticIds = [...source.matchAll(/:\s*'([a-z0-9-]+)'/g)].map((match) => match[1]);
const jsSource = fs.readFileSync(jsPath, 'utf8');
const jsIds = [...jsSource.matchAll(/:\s*'([a-z0-9-]+)'/g)].map((match) => match[1]);

const missingInJs = staticIds.filter((id) => !jsIds.includes(id));

if (missingInJs.length > 0) {
  console.warn('Static testIDs in TS but not in e2e/testIds.js:');
  missingInJs.forEach((id) => process.stderr.write(`  - ${id}\n`));
  process.exitCode = 1;
} else {
  process.stdout.write('e2e/testIds.js is in sync with static keys in source/testing/testIds.ts\n');
}
