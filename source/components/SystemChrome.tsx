/** @format */

import React from 'react';
import { StatusBar } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/** Aligns status bar content style with the app theme (edge-to-edge; colors come from native). */
export const SystemChrome = () => {
  const { isDark } = useTheme();

  return <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;
};
