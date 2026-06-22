/** @format */

import React from 'react';
import { Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { useManageAppsStyles } from '../styles';

type ManageAppsListEmptyProps = {
  isFiltering: boolean;
};

export const ManageAppsListEmpty = ({ isFiltering }: ManageAppsListEmptyProps) => {
  const styles = useManageAppsStyles();

  if (isFiltering) {
    return null;
  }

  return (
    <Text style={styles.emptyText} testID={testIds.manageApps.appsEmpty}>
      No apps found
    </Text>
  );
};
