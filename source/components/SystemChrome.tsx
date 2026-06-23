/** @format */

import React from 'react';
import { StatusBar } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

import { statusBarTranslucent } from './statusBarConfig';

/** Aligns status bar (and Android nav bar via theme) with the app background. */
export const SystemChrome = () => {
  const { colors, isDark } = useTheme();

  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={colors.background}
      translucent={statusBarTranslucent}
    />
  );
};
