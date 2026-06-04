/** @format */

import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { usePermissionsSync } from './hooks/usePermissionsSync';
import { permissionsStyles } from './styles';

import { PermissionCard, PermissionsFooter, PermissionsHeader, PrivacyNotice } from './components';

export const EnablePermissionsScreen = () => {
  const navigation = useRootNavigation();
  const { permissions, canContinue, handleGrant } = usePermissionsSync();

  const handleContinue = useCallback(() => {
    if (!canContinue) {
      return;
    }
    navigation.navigate('Dashboard');
  }, [canContinue, navigation]);

  return (
    <SafeAreaView style={permissionsStyles.screen} edges={['top', 'bottom']} testID={testIds.enablePermissions.screen}>
      <ScrollView
        testID={testIds.enablePermissions.scroll}
        contentContainerStyle={permissionsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PermissionsHeader />

        <View style={permissionsStyles.cards} testID={testIds.enablePermissions.cards}>
          {permissions.map((item) => (
            <PermissionCard key={item.id} {...item} onGrant={() => handleGrant(item.id)} />
          ))}
        </View>
      </ScrollView>

      <View style={permissionsStyles.footer}>
        <PrivacyNotice />
        <PermissionsFooter canContinue={canContinue} onContinue={handleContinue} />
      </View>
    </SafeAreaView>
  );
};
