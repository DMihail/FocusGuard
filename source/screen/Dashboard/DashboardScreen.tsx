/** @format */

import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DashboardHeader, DistractingAppsSection } from './components';
import { dashboardStyles } from './styles';
import { testIds } from '@/testing/testIds';
import { getGreeting } from './utils';

export const DashboardScreen = () => {
  const greeting = useMemo(() => getGreeting(), []);

  return (
    <SafeAreaView style={dashboardStyles.screen} edges={['top', 'bottom']} testID={testIds.dashboard.screen}>
      <ScrollView
        testID={testIds.dashboard.scroll}
        contentContainerStyle={dashboardStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader greeting={greeting} />

        <DistractingAppsSection />
      </ScrollView>
    </SafeAreaView>
  );
};
