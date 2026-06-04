/** @format */

import { DEFAULT_APP_LIMITS } from '@/store/constants/appLimits';
import { buildDashboardAppRows, buildDashboardSummary } from '@/utils/usage/dashboardStats';

const app = {
  packageName: 'com.test',
  appName: 'Test',
  appImage: '',
  category: 'Social',
  categoryLabel: 'Social',
};

describe('dashboardStats', () => {
  it('computes focus score from remaining daily budget', () => {
    const rows = buildDashboardAppRows([app], {}, { [app.packageName]: 30 * 60_000 }, () => DEFAULT_APP_LIMITS);
    const summary = buildDashboardSummary(rows);

    expect(summary.focusScore).toBe(50);
    expect(summary.remainingMs).toBe(30 * 60_000);
  });

  it('marks app as over limit when usage exceeds daily cap', () => {
    const rows = buildDashboardAppRows([app], {}, { [app.packageName]: 90 * 60_000 }, () => DEFAULT_APP_LIMITS);

    expect(rows[0]?.isOverLimit).toBe(true);
    expect(rows[0]?.percentUsed).toBeGreaterThanOrEqual(100);
  });
});
