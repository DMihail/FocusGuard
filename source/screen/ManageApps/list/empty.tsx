/** @format */

import React from 'react';
import { Text } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useManageAppsStyles } from '../styles';

type ManageAppsListEmptyProps = {
  isFiltering: boolean;
};

export const ManageAppsListEmpty = ({ isFiltering }: ManageAppsListEmptyProps) => {
  const styles = useManageAppsStyles();
  const { t } = useTranslation();

  if (isFiltering) {
    return null;
  }

  return (
    <Text style={styles.emptyText} testID={testIds.manageApps.appsEmpty}>
      {t('manageApps.noAppsFound')}
    </Text>
  );
};
