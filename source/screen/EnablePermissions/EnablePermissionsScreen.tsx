/** @format */

import React from 'react';
import { FlatList, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';
import { APP_LIST_FLAT_LIST_PROPS } from '@/utils/flatListDefaults';

import { usePermissionsSync } from './hooks/usePermissionsSync';
import { permissionsStyles } from './styles';

import { PermissionCard, PermissionsFooter, PermissionsHeader, PrivacyNotice } from './components';

export const EnablePermissionsScreen = () => {
  const navigation = useRootNavigation();
  const { permissions, canContinue, handleGrant } = usePermissionsSync();

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={permissionsStyles.screen} edges={['top', 'bottom']} testID={testIds.enablePermissions.screen}>
      <FlatList
        testID={testIds.enablePermissions.scroll}
        data={permissions}
        renderItem={({ item }) => <PermissionCard {...item} onGrant={() => handleGrant(item.id)} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={PermissionsHeader}
        contentContainerStyle={permissionsStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel="Required permissions"
        {...APP_LIST_FLAT_LIST_PROPS}
      />

      <View style={permissionsStyles.footer}>
        <PrivacyNotice />
        <PermissionsFooter canContinue={canContinue} onContinue={handleContinue} />
      </View>
    </SafeAreaView>
  );
};
