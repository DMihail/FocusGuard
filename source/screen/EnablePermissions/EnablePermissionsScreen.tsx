/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { usePermissionsSync } from './hooks/usePermissionsSync';
import { createPermissionListRenderItem, permissionKeyExtractor } from './list';
import { usePermissionsStyles } from './styles';

import { PermissionsFooter, PermissionsHeader, PrivacyNotice } from './components';
import { ScreenSafeArea } from '@/components';

export const EnablePermissionsScreen = () => {
  const styles = usePermissionsStyles();
  const navigation = useRootNavigation();
  const { t } = useTranslation();
  const { permissions, canContinue, handleGrant } = usePermissionsSync();

  const handleContinue = useCallback(() => {
    if (!canContinue) {
      return;
    }
    navigation.navigate('Dashboard');
  }, [canContinue, navigation]);

  const renderItem = useMemo(() => createPermissionListRenderItem(handleGrant), [handleGrant]);

  return (
    <ScreenSafeArea
      style={styles.screen}
      testID={testIds.enablePermissions.screen}
      accessibilityLabel={t('permissions.screenLabel')}
    >
      <FlatList
        testID={testIds.enablePermissions.cards}
        data={permissions}
        renderItem={renderItem}
        keyExtractor={permissionKeyExtractor}
        ListHeaderComponent={PermissionsHeader}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel={t('permissions.requiredSection')}
        extraData={permissions}
        {...APP_LIST_FLAT_LIST_PROPS}
      />

      <View style={styles.footer}>
        <PrivacyNotice />
        <PermissionsFooter canContinue={canContinue} onContinue={handleContinue} />
      </View>
    </ScreenSafeArea>
  );
};
