/** @format */

import React, { type RefObject } from 'react';

import type { LinkingOptions, NavigationContainerRef } from '@react-navigation/native';
import { createStaticNavigation } from '@react-navigation/native';

import { linking } from './linking';
import { createRootStack } from './RootStack';
import type { RootStackParamList } from './types';

type RootStaticNavigation = React.ComponentType<{
  ref?: React.Ref<NavigationContainerRef<RootStackParamList>>;
  linking?: LinkingOptions<RootStackParamList>;
}>;

const navigationByInitialRoute = new Map<keyof RootStackParamList, RootStaticNavigation>();

const getStaticNavigation = (initialRoute: keyof RootStackParamList) => {
  let navigation = navigationByInitialRoute.get(initialRoute);

  if (!navigation) {
    navigation = createStaticNavigation(createRootStack(initialRoute)) as RootStaticNavigation;
    navigationByInitialRoute.set(initialRoute, navigation);
  }

  return navigation;
};

type RootNavigatorProps = {
  initialRoute: keyof RootStackParamList;
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>;
};

export const RootNavigator = ({ initialRoute, navigationRef }: RootNavigatorProps) => {
  const Navigation = getStaticNavigation(initialRoute);

  return <Navigation ref={navigationRef} linking={linking} />;
};
