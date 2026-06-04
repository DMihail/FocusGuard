/** @format */

import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp } from '@/navigation/types';

export const useGoBack = (): (() => void) => {
  const navigation = useNavigation<RootNavigationProp>();

  return () => {
    navigation.goBack();
  };
};
