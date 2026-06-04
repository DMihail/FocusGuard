/** @format */

import React from 'react';
import { Text } from 'react-native';

import { testIds } from '@/testing/testIds';

import { manageAppsStyles } from '../styles';

type ManageAppsListEmptyProps = {
  isFiltering: boolean;
};

export const ManageAppsListEmpty = ({ isFiltering }: ManageAppsListEmptyProps) => {
  if (isFiltering) {
    return null;
  }

  return (
    <Text style={manageAppsStyles.emptyText} testID={testIds.manageApps.appsEmpty}>
      No apps found
    </Text>
  );
};
