const fs = require('fs');
const path = require('path');

const SOURCE_ROOT = path.join(__dirname, '../../source');
const TIMER_PATTERN = /\b(setTimeout|setInterval)\s*\(/;

const collectSourceFiles = (directory) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(fullPath);
    }

    if (!/\.(ts|tsx)$/.test(entry.name)) {
      return [];
    }

    return [fullPath];
  });
};

describe('architecture / production timers', () => {
  it('does not use setTimeout or setInterval under source/', () => {
    const offenders = collectSourceFiles(SOURCE_ROOT).filter((filePath) => {
      const contents = fs.readFileSync(filePath, 'utf8');
      return TIMER_PATTERN.test(contents);
    });

    expect(offenders).toEqual([]);
  });
});
