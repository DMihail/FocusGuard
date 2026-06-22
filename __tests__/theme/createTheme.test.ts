/** @format */

import { createTheme } from '@/theme/createTheme';
import { resolveColorScheme } from '@/theme/resolveColorScheme';

describe('resolveColorScheme', () => {
  it('returns explicit preference when set', () => {
    expect(resolveColorScheme('light', 'dark')).toBe('light');
    expect(resolveColorScheme('dark', 'light')).toBe('dark');
  });

  it('follows the system scheme when preference is system', () => {
    expect(resolveColorScheme('system', 'light')).toBe('light');
    expect(resolveColorScheme('system', 'dark')).toBe('dark');
    expect(resolveColorScheme('system', null)).toBe('dark');
    expect(resolveColorScheme('system', undefined)).toBe('dark');
  });
});

describe('createTheme', () => {
  it('builds light and dark themes from preference and system scheme', () => {
    const lightTheme = createTheme('light', 'dark');
    const darkTheme = createTheme('dark', 'light');

    expect(lightTheme.colorScheme).toBe('light');
    expect(lightTheme.isDark).toBe(false);
    expect(lightTheme.colors.background).toBe('#FFFBFE');

    expect(darkTheme.colorScheme).toBe('dark');
    expect(darkTheme.isDark).toBe(true);
    expect(darkTheme.colors.background).toBe('#1C1B1F');
  });
});
