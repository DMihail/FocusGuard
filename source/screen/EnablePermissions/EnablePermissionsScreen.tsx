/** @format */

import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { useScrollContentContainerStyle } from '@/hooks/useScrollContentContainerStyle';
import { useTranslation } from '@/i18n';
import { APP_LIST_FLAT_LIST_PROPS } from '@/list';
import { keyById as permissionKeyExtractor } from '@/list/keys';
import { useRootNavigation } from '@/navigation';
import { testIds } from '@/testing/testIds';

import { usePermissionsSync } from './hooks/usePermissionsSync';
import { createPermissionListRenderItem } from './list/renderers';
import { usePermissionsStyles } from './styles';

import { PermissionsFooter } from './components/PermissionsFooter';
import { PermissionsHeader } from './components/PermissionsHeader';
import { PrivacyNotice } from './components/PrivacyNotice';
import { ScreenSafeArea } from '@/components';

export const EnablePermissionsScreen = () => {
  const styles = usePermissionsStyles();
  const { scrollContentContainerStyle, contentInsetStyle } = useScrollContentContainerStyle(styles.scrollContent);
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
        contentContainerStyle={scrollContentContainerStyle}
        showsVerticalScrollIndicator={false}
        accessibilityRole="list"
        accessibilityLabel={t('permissions.requiredSection')}
        extraData={permissions}
        {...APP_LIST_FLAT_LIST_PROPS}
      />

      <View style={[styles.footer, contentInsetStyle]}>
        <PrivacyNotice />
        <PermissionsFooter canContinue={canContinue} onContinue={handleContinue} />
      </View>
    </ScreenSafeArea>
  );
};
