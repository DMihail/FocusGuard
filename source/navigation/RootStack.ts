/** @format */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EnablePermissionsScreen, OnboardingScreen } from '../screen';

export const RootStack = createNativeStackNavigator({
  initialRouteName: 'Onboarding',
  screens: {
    Onboarding: {
      screen: OnboardingScreen,
      options: {
        headerShown: false,
      },
    },
    EnablePermissions: {
      screen: EnablePermissionsScreen,
      options: {
        headerShown: false,
      },
    },
  },
});

export type RootStackType = typeof RootStack;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootStackType {}
}
