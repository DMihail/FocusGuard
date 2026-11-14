/** @format */

import React, { type ReactNode, useEffect } from 'react';

import { usePersistHydrated } from '@/hooks/usePersistHydrated';
import { useSystemColorScheme } from '@/hooks/useSystemColorScheme';
import { ThemeColorsContext, ThemeShellContext } from '@/hooks/useTheme';
import { syncNativeUiThemePreference } from '@/specs/keeptUiThemeClient';
import { settingsStore } from '@/store';

import { useThemeTransition } from './useThemeTransition';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const hasSettingsHydrated = usePersistHydrated(settingsStore);
  const preference = settingsStore((state) => state.themePreference);
  const effectivePreference = hasSettingsHydrated ? preference : 'system';
  const systemScheme = useSystemColorScheme();
  const { colors, shell, isTransitioning } = useThemeTransition(effectivePreference, systemScheme);

  useEffect(() => {
    if (!hasSettingsHydrated || isTransitioning) {
      return;
    }

    syncNativeUiThemePreference(preference);
  }, [hasSettingsHydrated, preference, isTransitioning]);

  return (
    <ThemeShellContext value={shell}>
      <ThemeColorsContext value={colors}>{children}</ThemeColorsContext>
    </ThemeShellContext>
  );
};
