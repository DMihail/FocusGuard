/** @format */

import React, { useCallback } from 'react';
import { FlatList, type ListRenderItem, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';
import { APP_LIST_FLAT_LIST_PROPS } from '@/utils/flatListDefaults';

import { usePermissionsSync } from './hooks/usePermissionsSync';
import { permissionsStyles } from './styles';
import type { PermissionItem } from './types';

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

  const renderItem: ListRenderItem<PermissionItem> = useCallback(
    ({ item }) => <PermissionCard {...item} onGrant={() => handleGrant(item.id)} />,
    [handleGrant],
  );

  const keyExtractor = useCallback((item: PermissionItem) => item.id, []);

  return (
    <SafeAreaView style={permissionsStyles.screen} edges={['top', 'bottom']} testID={testIds.enablePermissions.screen}>
      <FlatList
        testID={testIds.enablePermissions.scroll}
        data={permissions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
