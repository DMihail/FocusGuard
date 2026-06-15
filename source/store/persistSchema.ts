/** @format */

/**
 * MMKV / Zustand persist contract shared with Android (`PersistSchema.kt`).
 * Keep storage keys and version numbers in sync when persisted store shapes change.
 *
 * ## JS ↔ native data flow
 *
 * - **Turbo Module (`NativeUsageStats`)** — permissions, usage catalogs, monitor control,
 *   and `syncTrackingConfig` for the flat tracking snapshot.
 * - **Shared MMKV (`focus-guard-storage`)** — Zustand persist blobs plus the flat
 *   `native-tracking-snapshot-v1` key. Native monitor code reads the snapshot first,
 *   then falls back to parsing Zustand persist when the snapshot is absent.
 *
 * Prefer `syncNativeTrackingSnapshot()` (calls `syncTrackingConfig`) over writing the
 * snapshot key directly so native cache invalidation stays in sync.
 *
 * ## iOS (Screen Time)
 *
 * - App Group: `group.com.keept.shared` (`IOS_APP_GROUP_ID`)
 * - Flat snapshot: `ios-tracking-snapshot-v2` with opaque `trackedAppTokenIds`
 * - Selection blob: `ios-family-activity-selection-v1` (phase 1 picker)
 * - Auth mode: `individual` (self-control only)
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

/** Flat tracking snapshot written for native monitor reads (`NativeTrackingSnapshot.kt`). */
export const NATIVE_TRACKING_SNAPSHOT_KEY = 'native-tracking-snapshot-v1';

/** Bump when the flat native snapshot JSON shape changes. */
export const NATIVE_TRACKING_SNAPSHOT_VERSION = 1;

/** App Group shared between the iOS app and DeviceActivity extensions (`KeeptAppGroup.swift`). */
export const IOS_APP_GROUP_ID = 'group.com.keept.shared';

/** iOS flat snapshot for Screen Time monitoring (`IosTrackingSnapshot.swift`). */
export const IOS_TRACKING_SNAPSHOT_KEY = 'ios-tracking-snapshot-v2';

/** Bump when `IosTrackingSnapshot` JSON shape changes. */
export const IOS_TRACKING_SNAPSHOT_VERSION = 2;

/** Base64-encoded `FamilyActivitySelection` blob written by native picker (phase 1). */
export const IOS_FAMILY_ACTIVITY_SELECTION_KEY = 'ios-family-activity-selection-v1';
