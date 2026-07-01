const { execSync } = require('child_process');

describe('architecture / production timers', () => {
  it('does not use setTimeout or setInterval under source/', () => {
    let output = '';

    try {
      output = execSync('rg "\\b(setTimeout|setInterval)\\s*\\(" source -g "*.ts" -g "*.tsx" -l', {
        cwd: process.cwd(),
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 1) {
        output = '';
      } else {
        throw error;
      }
    }

    expect(output.trim()).toBe('');
  });
});
