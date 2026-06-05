/** @format */

import React, { memo } from 'react';
import { TextInput, View } from 'react-native';

import { SearchIcon } from '@/assets/svg/ManageApps';
import { testIds } from '@/testing/testIds';
import { colors } from '@/theme';

import { manageAppsStyles } from '../styles';

type AppSearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
};

function AppSearchFieldView({ value, onChangeText }: AppSearchFieldProps) {
  return (
    <View style={manageAppsStyles.searchField}>
      <SearchIcon />
      <TextInput
        testID={testIds.manageApps.searchInput}
        accessibilityLabel="Search apps"
        value={value}
        onChangeText={onChangeText}
        placeholder="Search apps..."
        placeholderTextColor={colors.textDisabled}
        style={manageAppsStyles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

export const AppSearchField = memo(AppSearchFieldView);
