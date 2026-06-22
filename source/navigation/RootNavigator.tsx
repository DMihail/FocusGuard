/** @format */

import React, { type RefObject, useMemo } from 'react';

import type { LinkingOptions, NavigationContainerRef } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';

import { useTheme } from '@/hooks/useTheme';
import type { ColorPalette } from '@/theme/types';

import { rootLinking } from './linking';
import { createRootStack } from './RootStack';
import type { RootStackParamList } from './types';

type RootStaticNavigation = React.ComponentType<{
  ref?: React.Ref<NavigationContainerRef<RootStackParamList>>;
  linking?: LinkingOptions<RootStackParamList>;
}>;

const navigationByKey = new Map<string, RootStaticNavigation>();

const getStaticNavigation = (initialRoute: keyof RootStackParamList, colors: ColorPalette) => {
  const cacheKey = `${initialRoute}:${colors.background}`;
  let navigation = navigationByKey.get(cacheKey);

  if (!navigation) {
    navigation = createStaticNavigation(createRootStack(initialRoute, colors)) as RootStaticNavigation;
    navigationByKey.set(cacheKey, navigation);
  }

  return navigation;
};

type RootNavigatorProps = {
  initialRoute: keyof RootStackParamList;
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>;
};

export const RootNavigator = ({ initialRoute, navigationRef }: RootNavigatorProps) => {
  const { colors } = useTheme();
  const Navigation = useMemo(() => getStaticNavigation(initialRoute, colors), [colors, initialRoute]);

  return <Navigation ref={navigationRef} linking={rootLinking} />;
};
