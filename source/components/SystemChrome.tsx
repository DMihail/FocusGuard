/** @format */

import React from 'react';
import { StatusBar } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

/**
 * Aligns status-bar icon style with the app theme.
 * Bar colors stay transparent (Android edge-to-edge / `SystemBarAppearance`); padding via SafeArea.
 */
export const SystemChrome = () => {
  const { isDark } = useTheme();

  return <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;
};
