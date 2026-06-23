/** @format */

import React from 'react';
import { Text } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useDashboardStyles } from '../styles';

export const DistractingAppsListEmpty = () => {
  const styles = useDashboardStyles();
  const { t } = useTranslation();

  return (
    <Text style={styles.emptyText} testID={testIds.dashboard.appsEmpty}>
      {t('dashboard.noAppsSelected')}
    </Text>
  );
};
