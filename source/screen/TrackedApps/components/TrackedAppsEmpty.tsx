/** @format */

import React from 'react';
import { Text } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useTrackedAppsStyles } from '../styles';

export const TrackedAppsEmpty = () => {
  const styles = useTrackedAppsStyles();
  const { t } = useTranslation();

  return (
    <Text style={styles.emptyText} testID={testIds.trackedApps.empty}>
      {t('trackedApps.empty')}
    </Text>
  );
};
