/** @format */

import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRootNavigation } from '@/navigation';
import { PermissionCard, PermissionsFooter, PermissionsHeader, PrivacyNotice } from './components';
import { PERMISSIONS } from './data/permissions';
import { usePermissionsSync } from './hooks/usePermissionsSync';
import { areAllPermissionsGranted } from './utils/permissionStatus';
import { testIds } from '@/testing/testIds';
import { permissionsStyles } from './styles';

export const EnablePermissionsScreen = () => {
  const navigation = useRootNavigation();
  const { statusById, handleGrant } = usePermissionsSync();

  const permissions = useMemo(
    () => PERMISSIONS.map((item) => ({ ...item, status: statusById[item.id] ?? item.status })),
    [statusById],
  );

  const canContinue = areAllPermissionsGranted();

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
