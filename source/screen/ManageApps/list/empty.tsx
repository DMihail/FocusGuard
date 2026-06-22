/** @format */

import React from 'react';
import { Text } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createManageAppsStyles } from '../styles';

type ManageAppsListEmptyProps = {
  isFiltering: boolean;
};

export const ManageAppsListEmpty = ({ isFiltering }: ManageAppsListEmptyProps) => {
  const styles = useThemedStyles(createManageAppsStyles);

  if (isFiltering) {
    return null;
  }

  return (
    <Text style={styles.emptyText} testID={testIds.manageApps.appsEmpty}>
      No apps found
    </Text>
  );
};
