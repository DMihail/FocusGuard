/** @format */

/* eslint-env jest */

jest.mock('@/crashlytics/reportError', () => ({
  reportError: jest.fn(),
}));

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
    useAnimatedReaction: (prepare, react) => {
      react(prepare(), null);
    },
    useAnimatedScrollHandler: (handlers) => handlers.onScroll ?? noop,
    withTiming: (toValue) => toValue,
    withSpring: (toValue, _config, callback) => {
      if (typeof callback === 'function') {
        callback(true);
      }

      return toValue;
    },
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
    interpolateColor: (value, _inputRange, outputRange) => {
      if (value <= 0) {
        return outputRange[0];
      }

      if (value >= 1) {
        return outputRange[1];
      }

      return outputRange[1];
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
  const theme = createTheme('system', 'dark');

  return {
    useThemeColors: () => theme.colors,
    useThemeShell: () => ({
      presets: theme.presets,
      colorScheme: theme.colorScheme,
      isDark: theme.isDark,
      preference: theme.preference,
    }),
    useTheme: () => theme,
    ThemeColorsContext: { Provider: ({ children }) => children },
    ThemeShellContext: { Provider: ({ children }) => children },
  };
});

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'en' }],
}));

jest.mock('@/i18n', () => {
  const i18n = require('i18next');
  const { initReactI18next } = require('react-i18next');
  const { enUi } = require('./source/i18n/messages/en/ui');

  i18n
    .use(initReactI18next)
    .init({
      resources: { en: { translation: enUi } },
      lng: 'en',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      compatibilityJSON: 'v4',
      react: { useSuspense: false },
    })
    .catch(() => undefined);

  const { useTranslation: useI18nextTranslation } = require('react-i18next');

  return {
    LanguageSync: ({ children }) => children,
    useTranslation: () => {
      const { t, i18n: instance } = useI18nextTranslation();

      return { language: 'en', t, i18n: instance };
    },
  };
});

const mockPermissionsChangedSubscription = { remove: jest.fn() };

jest.mock('@/specs/keeptTurboModuleClient', () => ({
  getKeeptTurboModule: jest.fn(() => ({
    onPermissionsChanged: jest.fn(() => mockPermissionsChangedSubscription),
    onLocalDayChanged: jest.fn(() => mockPermissionsChangedSubscription),
    onMonitorServiceStateChanged: jest.fn(() => mockPermissionsChangedSubscription),
    onTrackedUsageChanged: jest.fn(() => mockPermissionsChangedSubscription),
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
    invalidateNativeInstalledAppsCache: jest.fn(),
    invalidateNativeUsageCache: jest.fn(),
    syncTrackingConfig: jest.fn(),
    requestScreenTimeAuthorization: jest.fn(async () => true),
    presentFamilyActivityPicker: jest.fn(async () => []),
  })),
}));

afterEach(() => {
  const { __resetAppForegroundBusForTests } = require('./source/runtime/appForegroundBus');
  __resetAppForegroundBusForTests();
});

jest.mock('@react-native-firebase/crashlytics', () => ({
  getCrashlytics: jest.fn(() => ({})),
  setCrashlyticsCollectionEnabled: jest.fn(async () => null),
  recordError: jest.fn(async () => null),
  log: jest.fn(),
}));
