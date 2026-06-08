/** @format */

import React from 'react';
import { Platform, StatusBar } from 'react-native';

import { colors } from '@/theme';

/** Aligns status bar (and Android nav bar via theme) with the app background. */
export const SystemChrome = () => (
  <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent={Platform.OS === 'android'} />
);
