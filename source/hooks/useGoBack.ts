/** @format */

import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp } from '@/navigation/types';

/**
 * Returns a stable callback that navigates back in the root stack.
 * Memoized so list headers and screen callbacks do not invalidate on every render.
 */
export const useGoBack = (): (() => void) => {
  const navigation = useNavigation<RootNavigationProp>();

  return useCallback(() => {
    navigation.goBack();
  }, [navigation]);
};
