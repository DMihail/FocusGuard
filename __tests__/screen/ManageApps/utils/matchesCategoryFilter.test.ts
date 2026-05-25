/** @format */

import { createManageApp } from '@/testing/fixtures/manageApps';
import { matchesCategoryFilter } from '@/screen/ManageApps/utils/matchesCategoryFilter';

describe('matchesCategoryFilter', () => {
  it('matches all apps for All filter', () => {
    const app = createManageApp({ category: 'Video', categoryLabel: 'Video' });

    expect(matchesCategoryFilter(app, { id: 'all', label: 'All', category: 'all' })).toBe(true);
  });

  it('matches apps by category and categoryLabel pair', () => {
    const app = createManageApp({ category: 'Video', categoryLabel: 'Video' });
    const filter = { id: 'Video', label: 'Video', category: 'Video' };

    expect(matchesCategoryFilter(app, filter)).toBe(true);
    expect(matchesCategoryFilter(app, { id: 'Audio', label: 'Audio', category: 'Audio' })).toBe(false);
  });
});
