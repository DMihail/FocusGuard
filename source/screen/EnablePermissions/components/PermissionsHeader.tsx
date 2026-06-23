/** @format */

import React from 'react';
import { Text, View } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { usePermissionsStyles } from '../styles';

export const PermissionsHeader = () => {
  const styles = usePermissionsStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.header} testID={testIds.enablePermissions.header}>
      <Text style={styles.title}>{t('permissions.headerTitle')}</Text>
      <Text style={styles.subtitle}>{t('permissions.headerSubtitle')}</Text>
    </View>
  );
};
