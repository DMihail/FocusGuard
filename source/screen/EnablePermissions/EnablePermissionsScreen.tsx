/** @format */

import React, { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionCard, PermissionsFooter, PermissionsHeader, PrivacyNotice } from './components';
import { PERMISSIONS } from './data/permissions';
import { permissionsStyles } from './styles';
import type { PermissionStatus } from './types';
import { checkForPermission, checkForQueryAllPackagesPermission } from '../../specs';

const configureCardLayoutAnimation = () => {
  LayoutAnimation.configureNext(LayoutAnimation.create(380, 'easeInEaseOut', 'opacity'));
};

export const EnablePermissionsScreen = () => {
  const [statusById, setStatusById] = useState<Record<string, PermissionStatus>>(() =>
    Object.fromEntries(PERMISSIONS.map((item) => [item.id, item.status])),
  );

  const permissions = useMemo(
    () => PERMISSIONS.map((item) => ({ ...item, status: statusById[item.id] ?? item.status })),
    [statusById],
  );

  const canContinue = permissions.every((item) => item.status === 'granted');

  const handleGrant = useCallback((id: string) => {
    if (id === 'usage-access') {
      if (!checkForPermission()) {
        const permission = checkForQueryAllPackagesPermission();
        if (!permission) return;
      }
    }
    configureCardLayoutAnimation();
    setStatusById((current) => ({ ...current, [id]: 'granted' }));
  }, []);

  const handleContinue = useCallback(() => {
    if (!canContinue) {
      return;
    }
  }, [canContinue]);

  return (
    <SafeAreaView style={permissionsStyles.screen} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={permissionsStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <PermissionsHeader />

        <View style={permissionsStyles.cards}>
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
