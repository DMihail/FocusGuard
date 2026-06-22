/** @format */

import React, { type RefObject, useMemo } from 'react';

import type { LinkingOptions, NavigationContainerRef } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';

import { rootLinking } from './linking';
import { createRootStack } from './RootStack';
import type { RootStackParamList } from './types';

type RootStaticNavigation = React.ComponentType<{
  ref?: React.Ref<NavigationContainerRef<RootStackParamList>>;
  linking?: LinkingOptions<RootStackParamList>;
}>;

const navigationByKey = new Map<string, RootStaticNavigation>();

const getStaticNavigation = (initialRoute: keyof RootStackParamList) => {
  let navigation = navigationByKey.get(initialRoute);

  if (!navigation) {
    navigation = createStaticNavigation(createRootStack(initialRoute)) as RootStaticNavigation;
    navigationByKey.set(initialRoute, navigation);
  }

  return navigation;
};

type RootNavigatorProps = {
  initialRoute: keyof RootStackParamList;
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>;
};

export const RootNavigator = ({ initialRoute, navigationRef }: RootNavigatorProps) => {
  const Navigation = useMemo(() => getStaticNavigation(initialRoute), [initialRoute]);

  return <Navigation ref={navigationRef} linking={rootLinking} />;
};
