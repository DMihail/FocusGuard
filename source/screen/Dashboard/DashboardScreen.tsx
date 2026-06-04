/** @format */

import React from 'react';
import { ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { dashboardStyles } from './styles';
import { getGreeting } from './utils';

import { DashboardHeader, DistractingAppsSection } from './components';

export const DashboardScreen = () => {
  const navigation = useRootNavigation();
  const greeting = getGreeting();

  return (
    <SafeAreaView style={dashboardStyles.screen} edges={['top', 'bottom']} testID={testIds.dashboard.screen}>
      <ScrollView
        testID={testIds.dashboard.scroll}
        contentContainerStyle={dashboardStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader greeting={greeting} onSettingsPress={() => navigation.navigate('Settings')} />

        <DistractingAppsSection />
      </ScrollView>
    </SafeAreaView>
  );
};
