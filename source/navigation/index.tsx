/** @format */

import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp, RootStackParamList } from './types';

/** Typed navigation object for the root stack (screens outside tabs). */
export const useRootNavigation = (): RootNavigationProp => useNavigation<RootNavigationProp>();

export type { RootNavigationProp, RootStackParamList };
