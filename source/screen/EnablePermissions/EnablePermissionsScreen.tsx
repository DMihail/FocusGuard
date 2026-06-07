/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { usePrefetchNativeCatalogs } from '@/hooks/usePrefetchNativeCatalogs';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { usePermissionsSync } from './hooks/usePermissionsSync';
import { createPermissionListRenderItem, permissionKeyExtractor } from './list';
import { permissionsStyles } from './styles';

import { PermissionsFooter, PermissionsHeader, PrivacyNotice } from './components';
import { ScreenSafeArea } from '@/components';

export const EnablePermissionsScreen = () => {
  const navigation = useRootNavigation();
  const { permissions, canContinue, handleGrant, syncStatuses } = usePermissionsSync();

  usePrefetchNativeCatalogs();

  useFocusEffect(
    useCallback(() => {
      syncStatuses();
    }, [syncStatuses]),
  );

  const handleContinue = useCallback(() => {
    if (!canContinue) {
      return;
    }
    navigation.navigate('Dashboard');
  }, [canContinue, navigation]);

  const renderItem = useMemo(() => createPermissionListRenderItem(handleGrant), [handleGrant]);

  return (
    <ScreenSafeArea style={permissionsStyles.screen} testID={testIds.enablePermissions.screen}>
      <FlatList
        testID={testIds.enablePermissions.scroll}
        data={permissions}
        renderItem={renderItem}
        keyExtractor={permissionKeyExtractor}
        ListHeaderComponent={PermissionsHeader}
        contentContainerStyle={permissionsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Required permissions"
        extraData={permissions}
        {...APP_LIST_FLAT_LIST_PROPS}
      />

      <View style={permissionsStyles.footer}>
        <PrivacyNotice />
        <PermissionsFooter canContinue={canContinue} onContinue={handleContinue} />
      </View>
    </ScreenSafeArea>
  );
};
