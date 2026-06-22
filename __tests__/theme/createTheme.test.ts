/** @format */

import { createTheme } from '@/theme/createTheme';

describe('createTheme', () => {
  it('builds light and dark themes from preference and system scheme', () => {
    expect(createTheme('light', 'dark')).toMatchObject({
      colorScheme: 'light',
      isDark: false,
      colors: { background: '#FFFBFE' },
      preference: 'light',
    });

    expect(createTheme('dark', 'light')).toMatchObject({
      colorScheme: 'dark',
      isDark: true,
      colors: { background: '#1C1B1F' },
      preference: 'dark',
    });

    expect(createTheme('system', 'light').colorScheme).toBe('light');
    expect(createTheme('system', null).colorScheme).toBe('dark');
  });
});
