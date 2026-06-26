/** @format */

import ReactTestRenderer from 'react-test-renderer';

const mockSetLimits = jest.fn();

const mockSelectedAppsState = {
  apps: [
    {
      packageName: 'com.example.app',
      appName: 'Example',
      categoryLabel: 'Social',
      appImage: null,
    },
  ],
};

const mockLimitsState = {
  limitsByAppKey: {
    'com.example.app': {
      warningMinutes: 30,
      hardBlockMinutes: 60,
      strictMode: false,
    },
  },
  setLimits: mockSetLimits,
};

jest.mock('zustand/react/shallow', () => ({
  useShallow: (selector: (state: unknown) => unknown) => selector,
}));

jest.mock('@/store', () => ({
  selectedAppsStore: (selector: (state: typeof mockSelectedAppsState) => unknown) => selector(mockSelectedAppsState),
  appLimitsStore: (selector: (state: typeof mockLimitsState) => unknown) => selector(mockLimitsState),
  trackedUsageStore: (selector: (state: { usageByPackage: Record<string, number> }) => unknown) =>
    selector({ usageByPackage: { 'com.example.app': 15 * 60 * 1000 } }),
  DEFAULT_APP_LIMITS: {
    warningMinutes: 45,
    hardBlockMinutes: 60,
    strictMode: false,
  },
  LIMIT_SLIDER_BOUNDS: {
    warning: { min: 5, max: 180 },
    hardBlock: { min: 10, max: 240 },
  },
  normalizeAppLimits: (limits: (typeof mockLimitsState.limitsByAppKey)['com.example.app']) => limits,
}));

jest.mock('@/hooks/useLocalDayChangeRefresh', () => ({
  useLocalDayChangeRefresh: jest.fn(),
}));

jest.mock('@/hooks/useRefreshWhenVisible', () => ({
  useRefreshWhenVisible: jest.fn(),
}));

import { useConfigureLimits } from '@/screen/ConfigureLimits/hooks/useConfigureLimits';

const TestHarness = ({ appKey }: { appKey: string }) => {
  const result = useConfigureLimits(appKey);
  return <>{result.app?.appName}</>;
};

describe('useConfigureLimits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resolves the selected app and exposes draft limits', () => {
    let tree: ReactTestRenderer.ReactTestRenderer | undefined;

    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<TestHarness appKey="com.example.app" />);
    });

    expect(tree?.toJSON()).toBe('Example');
  });
});
