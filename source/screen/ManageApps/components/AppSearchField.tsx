/** @format */

import React, { memo } from 'react';
import { TextInput, View } from 'react-native';

import { SearchIcon } from '@/assets/svg/ManageApps';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useManageAppsStyles } from '../styles';

type AppSearchFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export const AppSearchField = memo(({ value, onChangeText }: AppSearchFieldProps) => {
  const styles = useManageAppsStyles();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.searchField}>
      <SearchIcon />
      <TextInput
        testID={testIds.manageApps.searchInput}
        accessibilityLabel={t('manageApps.searchA11y')}
        value={value}
        onChangeText={onChangeText}
        placeholder={t('manageApps.searchPlaceholder')}
        placeholderTextColor={colors.textDisabled}
        style={styles.searchInput}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
});
