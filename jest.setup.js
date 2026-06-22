/** @format */

/* eslint-env jest */

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');

  const noop = () => undefined;
  const identity = (value) => value;

  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component) => component,
      call: noop,
    },
    useSharedValue: (initial) => ({ value: initial }),
    useAnimatedStyle: (factory) => factory(),
    useDerivedValue: (factory) => ({ value: factory() }),
    useAnimatedScrollHandler: (handlers) => handlers.onScroll ?? noop,
    withTiming: (toValue) => toValue,
    withSpring: (toValue) => toValue,
    withDelay: (_delay, animation) => animation,
    withRepeat: (animation) => animation,
    withSequence: (...animations) => animations[animations.length - 1],
    cancelAnimation: noop,
    makeMutable: (initial) => ({ value: initial }),
    interpolate: (value, input, output) => {
      if (input.length < 2 || output.length < 2) {
        return output[0] ?? 0;
      }

      const [inMin, inMax] = input;
      const [outMin, outMax] = output;
      const range = inMax - inMin;

      if (range === 0) {
        return outMax;
      }

      const progress = Math.min(1, Math.max(0, (value - inMin) / range));

      return outMin + (outMax - outMin) * progress;
    },
    Extrapolation: { CLAMP: 'clamp' },
    Easing: {
      linear: identity,
      ease: identity,
      in: () => identity,
      out: () => identity,
      inOut: () => identity,
      cubic: identity,
    },
    runOnJS: (fn) => fn,
    useReducedMotion: () => false,
    LinearTransition: {
      duration: () => ({
        easing: () => ({}),
      }),
    },
    FadeIn: {
      duration: () => ({
        delay: () => ({
          easing: () => ({
            withInitialValues: () => ({}),
          }),
        }),
        easing: () => ({
          withInitialValues: () => ({}),
        }),
      }),
      easing: () => ({
        withInitialValues: () => ({}),
      }),
      withInitialValues: () => ({}),
    },
    FadeOut: {
      duration: () => ({
        delay: () => ({
          easing: () => ({}),
        }),
        easing: () => ({}),
      }),
      easing: () => ({}),
    },
    FadeInDown: {
      duration: () => ({
        delay: () => ({
          easing: () => ({
            withInitialValues: () => ({}),
          }),
        }),
        easing: () => ({
          withInitialValues: () => ({}),
        }),
      }),
      easing: () => ({
        withInitialValues: () => ({}),
      }),
      withInitialValues: () => ({}),
    },
    FadeOutUp: {
      duration: () => ({
        delay: () => ({
          easing: () => ({
            withInitialValues: () => ({}),
          }),
        }),
        easing: () => ({
          withInitialValues: () => ({}),
        }),
      }),
      easing: () => ({
        withInitialValues: () => ({}),
      }),
      withInitialValues: () => ({}),
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');

  return {
    GestureHandlerRootView: View,
    GestureDetector: ({ children }) => children,
    Gesture: {
      Pan: () => ({
        minDistance: () => ({
          onBegin: () => ({
            onUpdate: () => ({}),
          }),
        }),
      }),
    },
  };
});

jest.mock('@/store/mmkv', () => {
  const { mockZustandStorage } = require('./__tests__/helpers/mockZustandMmkv');
  const { mockMmkvStorage } = require('./__tests__/helpers/mockMmkvStorage');

  return {
    zustandStorage: mockZustandStorage,
    storage: mockMmkvStorage,
  };
});

jest.mock('@/hooks/useTheme', () => {
  const { createTheme } = require('./source/theme/createTheme');

  return {
    useTheme: () => createTheme('system', 'dark'),
  };
});

const mockPermissionsChangedSubscription = { remove: jest.fn() };

jest.mock('@/specs/nativeUsageStatsClient', () => ({
  getNativeUsageStats: jest.fn(() => ({
    onPermissionsChanged: jest.fn(() => mockPermissionsChangedSubscription),
    checkForPermission: jest.fn(() => false),
    checkForSystemAlertWindowPermission: jest.fn(() => false),
    checkForNotificationsPermission: jest.fn(() => false),
    checkForIgnoreBatteryOptimizationsPermission: jest.fn(() => false),
    checkForManifestMonitorPermissions: jest.fn(() => false),
    startMonitorService: jest.fn(() => ({ started: false, reason: 'manifest_permissions_missing' })),
    stopMonitorService: jest.fn(),
    isMonitorServiceRunning: jest.fn(() => false),
    requestUsageStatsPermission: jest.fn(),
    requestSystemAlertWindowPermission: jest.fn(),
    requestNotificationsPermission: jest.fn(),
    openNotificationsSettings: jest.fn(),
    requestIgnoreBatteryOptimizationsPermission: jest.fn(),
    getPackagesUsageToday: jest.fn(async () => []),
    getInstalledApplications: jest.fn(async () => []),
    getAppDisplayName: jest.fn(() => ''),
    getAppVersion: jest.fn(() => ''),
    invalidateNativeCatalogCaches: jest.fn(),
    syncTrackingConfig: jest.fn(),
    requestScreenTimeAuthorization: jest.fn(async () => true),
    presentFamilyActivityPicker: jest.fn(async () => []),
  })),
}));
