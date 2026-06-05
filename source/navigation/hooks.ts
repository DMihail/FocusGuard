/** @format */

import { useNavigation } from '@react-navigation/native';

import type { RootNavigationProp } from './types';

/** Typed navigation object for the root stack (screens outside tabs). */
export const useRootNavigation = (): RootNavigationProp => useNavigation<RootNavigationProp>();
