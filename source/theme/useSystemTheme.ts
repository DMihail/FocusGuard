/** @format */

import { useMemo } from 'react';

import { useSystemColorScheme } from '@/hooks/useSystemColorScheme';

import { createTheme } from './createTheme';
import type { Theme } from './types';

/** Theme from the device color scheme only (ignores in-app theme preference). */
export const useSystemTheme = (): Theme => {
  const systemScheme = useSystemColorScheme();

  return useMemo(() => createTheme('system', systemScheme), [systemScheme]);
};
