/** @format */

import { useNavigation } from '@react-navigation/native';

import { RootNavigationGate } from './RootNavigationGate';
import type { RootNavigationProp, RootStackParamList } from './types';

export const Navigation = RootNavigationGate;

/** Typed navigation object for the root stack (screens outside tabs). */
export const useRootNavigation = (): RootNavigationProp => useNavigation<RootNavigationProp>();

export type { RootNavigationProp, RootStackParamList };
