/** @format */

import React, { useDeferredValue, useEffect, useState } from 'react';
import { View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { useManageAppsStyles } from '../styles';
import { AppSearchField } from './AppSearchField';

type ManageAppsSearchToolbarProps = {
  onQueryChange: (query: string) => void;
  onQueryActiveChange: (isActive: boolean) => void;
};

export const ManageAppsSearchToolbar = ({ onQueryChange, onQueryActiveChange }: ManageAppsSearchToolbarProps) => {
  const styles = useManageAppsStyles();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    onQueryActiveChange(query.trim().length > 0);
  }, [onQueryActiveChange, query]);

  useEffect(() => {
    onQueryChange(deferredQuery);
  }, [deferredQuery, onQueryChange]);

  return (
    <View style={styles.searchToolbar} testID={testIds.manageApps.searchField}>
      <AppSearchField value={query} onChangeText={setQuery} />
    </View>
  );
};
