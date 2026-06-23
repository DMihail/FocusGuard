/** @format */

import type { TranslateFn } from '@/i18n/types';
import { buildCategoryFilters } from '@/screen/ManageApps/utils/buildCategoryFilters';
import { createManageApp } from '@/testing/fixtures/manageApps';

const t = ((key: string) => key) as TranslateFn;

describe('buildCategoryFilters', () => {
  it('always includes All and builds filters from app category fields', () => {
    const apps = [
      createManageApp({ packageName: 'com.social', category: 'Social', categoryLabel: 'Social' }),
      createManageApp({ packageName: 'com.game', category: 'Game', categoryLabel: 'Game' }),
      createManageApp({ packageName: 'com.news', category: 'News', categoryLabel: 'News' }),
    ];

    expect(buildCategoryFilters(apps, t)).toEqual([
      { id: 'all', label: 'common.all', category: 'all' },
      { id: 'Game', label: 'Game', category: 'Game' },
      { id: 'News', label: 'News', category: 'News' },
      { id: 'Social', label: 'Social', category: 'Social' },
    ]);
  });
});
