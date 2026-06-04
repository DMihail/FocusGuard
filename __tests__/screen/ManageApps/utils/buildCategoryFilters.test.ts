/** @format */

import { buildCategoryFilters } from '@/screen/ManageApps/utils/buildCategoryFilters';
import { createManageApp } from '@/testing/fixtures/manageApps';

describe('buildCategoryFilters', () => {
  it('always includes All and builds filters from app category fields', () => {
    const apps = [
      createManageApp({ packageName: 'com.social', category: 'Social', categoryLabel: 'Social' }),
      createManageApp({ packageName: 'com.game', category: 'Game', categoryLabel: 'Game' }),
      createManageApp({ packageName: 'com.news', category: 'News', categoryLabel: 'News' }),
    ];

    expect(buildCategoryFilters(apps)).toEqual([
      { id: 'all', label: 'All', category: 'all' },
      { id: 'Game', label: 'Game', category: 'Game' },
      { id: 'News', label: 'News', category: 'News' },
      { id: 'Social', label: 'Social', category: 'Social' },
    ]);
  });
});
