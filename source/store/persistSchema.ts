/** @format */

/**
 * MMKV / Zustand persist contract shared with Android (`PersistSchema.kt`).
 * Keep storage keys and version numbers in sync when persisted store shapes change.
 */
export const MMKV_INSTANCE_ID = 'focus-guard-storage';

export const PERSIST_STORAGE_KEYS = {
  selectedApps: 'selected-apps-storage',
  appLimits: 'app-limits-storage',
  monitoring: 'monitoring-storage',
  settings: 'settings-storage',
  onboarding: 'onboarding-storage',
} as const;

/** Bump when `selectedAppsStore` persisted `state.apps` shape changes. */
export const SELECTED_APPS_PERSIST_VERSION = 1;

/** Bump when `appLimitsStore` persisted `state.limitsByPackage` shape changes. */
export const APP_LIMITS_PERSIST_VERSION = 1;

/** Bump when `monitoringStore` persisted `state.isMonitoring` shape changes. */
export const MONITORING_PERSIST_VERSION = 1;

/** Bump when `settingsStore` persisted shape changes. */
export const SETTINGS_PERSIST_VERSION = 1;
