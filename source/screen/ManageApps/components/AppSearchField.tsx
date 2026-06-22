/** @format */

import React, { memo } from 'react';
import { TextInput, View } from 'react-native';

import { SearchIcon } from '@/assets/svg/ManageApps';
import { useTheme } from '@/hooks/useTheme';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { createManageAppsStyles } from '../styles';

type AppSearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export const AppSearchField = memo(({ value, onChangeText }: AppSearchFieldProps) => {
  const styles = useThemedStyles(createManageAppsStyles);
  const { colors } = useTheme();

  return (
    <View style={styles.searchField}>
      <SearchIcon />
      <TextInput
        testID={testIds.manageApps.searchInput}
        accessibilityLabel="Search apps"
        value={value}
        onChangeText={onChangeText}
        placeholder="Search apps..."
        placeholderTextColor={colors.textDisabled}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
});
