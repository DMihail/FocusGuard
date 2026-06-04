/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { usePermissionsSync } from './hooks/usePermissionsSync';
import { createPermissionListRenderItem, permissionKeyExtractor } from './list';
import { permissionsStyles } from './styles';

import { PermissionsFooter, PermissionsHeader, PrivacyNotice } from './components';

export const EnablePermissionsScreen = () => {
  const navigation = useRootNavigation();
  const { permissions, canContinue, handleGrant } = usePermissionsSync();

  const handleContinue = useCallback(() => {
    if (!canContinue) {
      return;
    }
    navigation.navigate('Dashboard');
  }, [canContinue, navigation]);

  const renderItem = useMemo(() => createPermissionListRenderItem(handleGrant), [handleGrant]);

  return (
    <SafeAreaView style={permissionsStyles.screen} edges={['top', 'bottom']} testID={testIds.enablePermissions.screen}>
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
        extraData={canContinue}
        {...APP_LIST_FLAT_LIST_PROPS}
      />

      <View style={permissionsStyles.footer}>
        <PrivacyNotice />
        <PermissionsFooter canContinue={canContinue} onContinue={handleContinue} />
      </View>
    </SafeAreaView>
  );
};
