/** @format */

import { useSyncExternalStore } from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';

const subscribeToSystemColorScheme = (onStoreChange: () => void): (() => void) => {
  const subscription = Appearance.addChangeListener(() => {
    onStoreChange();
  });

  return () => subscription.remove();
};

const getSystemColorScheme = (): ColorSchemeName | null | undefined => Appearance.getColorScheme();

export const useSystemColorScheme = (): ColorSchemeName | null | undefined =>
  useSyncExternalStore(subscribeToSystemColorScheme, getSystemColorScheme, getSystemColorScheme);
