/** @format */

import React from 'react';
import { StatusBar } from 'react-native';

import { colors } from '@/theme';

import { statusBarTranslucent } from './statusBarConfig';

/** Aligns status bar (and Android nav bar via theme) with the app background. */
export const SystemChrome = () => (
  <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent={statusBarTranslucent} />
);
