/** @format */

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import { testIds } from '@/testing/testIds';

import { MANAGE_APPS_SEARCH_DEBOUNCE_MS } from '../constants';
import { createManageAppsStyles } from '../styles';
import { AppSearchField } from './AppSearchField';

type ManageAppsSearchToolbarProps = {
  onQueryChange: (query: string) => void;
  onQueryActiveChange: (isActive: boolean) => void;
};

export const ManageAppsSearchToolbar = ({ onQueryChange, onQueryActiveChange }: ManageAppsSearchToolbarProps) => {
  const styles = useThemedStyles(createManageAppsStyles);
  const [query, setQuery] = useState('');

  useEffect(() => {
    onQueryActiveChange(query.trim().length > 0);
  }, [onQueryActiveChange, query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onQueryChange(query);
    }, MANAGE_APPS_SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [onQueryChange, query]);

  return (
    <View style={styles.searchToolbar} testID={testIds.manageApps.searchField}>
      <AppSearchField value={query} onChangeText={setQuery} />
    </View>
  );
};
