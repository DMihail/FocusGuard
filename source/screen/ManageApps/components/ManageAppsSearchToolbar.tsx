/** @format */

import React, { memo, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { MANAGE_APPS_SEARCH_DEBOUNCE_MS } from '../constants';
import { manageAppsStyles } from '../styles';
import { AppSearchField } from './AppSearchField';

type ManageAppsSearchToolbarProps = {
  onQueryChange: (query: string) => void;
  onQueryActiveChange: (isActive: boolean) => void;
};

/** Local query state + debounced filter updates to keep the input focused and responsive. */
function ManageAppsSearchToolbarView({ onQueryChange, onQueryActiveChange }: ManageAppsSearchToolbarProps) {
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

  const handleChange = useCallback((text: string) => {
    setQuery(text);
  }, []);

  return (
    <View style={manageAppsStyles.searchToolbar} testID={testIds.manageApps.searchField}>
      <AppSearchField value={query} onChangeText={handleChange} />
    </View>
  );
}

export const ManageAppsSearchToolbar = memo(ManageAppsSearchToolbarView);
