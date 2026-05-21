/** @format */

import { buildCategoryFilters } from '../../../../source/screen/ManageApps/utils/buildCategoryFilters';
import type { ManageApp } from '../../../../source/screen/ManageApps/types';
import { matchesCategoryFilter } from '../../../../source/screen/ManageApps/utils/matchesCategoryFilter';

const createApp = (overrides: Partial<ManageApp>): ManageApp => ({
  packageName: 'com.example',
  appName: 'Example',
  appImage: '',
  category: 'Game',
  categoryLabel: 'Game',
  ...overrides,
});

describe('buildCategoryFilters', () => {
  it('always includes All and builds filters from app category fields', () => {
    const apps = [
      createApp({ packageName: 'com.social', category: 'Social', categoryLabel: 'Social' }),
      createApp({ packageName: 'com.game', category: 'Game', categoryLabel: 'Game' }),
      createApp({ packageName: 'com.news', category: 'News', categoryLabel: 'News' }),
    ];

    expect(buildCategoryFilters(apps)).toEqual([
      { id: 'all', label: 'All', category: 'all' },
      { id: 'Game', label: 'Game', category: 'Game' },
      { id: 'News', label: 'News', category: 'News' },
      { id: 'Social', label: 'Social', category: 'Social' },
    ]);
  });

  it('matches apps by category and categoryLabel pair', () => {
    const app = createApp({ category: 'Video', categoryLabel: 'Video' });
    const filter = { id: 'Video', label: 'Video', category: 'Video' };

    expect(matchesCategoryFilter(app, filter)).toBe(true);
    expect(matchesCategoryFilter(app, { id: 'all', label: 'All', category: 'all' })).toBe(true);
    expect(matchesCategoryFilter(app, { id: 'Audio', label: 'Audio', category: 'Audio' })).toBe(false);
  });
});
