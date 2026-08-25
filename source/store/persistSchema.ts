/** @format */

/**
 * MMKV / Zustand persist contract shared with Android (`PersistSchema.kt`).
 * Keep storage keys and version numbers in sync when persisted store shapes change.
 *
 * ## JS ↔ native data flow
 *
 * - **Turbo Module (`KeeptTurboModule`)** — permissions, usage catalogs, monitor control,
 *   and flat snapshot sync: `syncTrackingConfig`, `syncMonitoringState`, `syncSettingsConfig`.
 * - **Shared MMKV (`keept-storage`)** — Zustand persist blobs (JS UI hydration) plus flat
 *   native keys. Android background code reads **only** the flat keys (no Zustand fallback
 *   after optional one-time migrate from legacy blobs).
 *
 * Prefer `syncNative*Snapshot()` helpers over writing snapshot keys directly so native
 * cache invalidation stays in sync.
 *
 * ## iOS (Screen Time)
 *
 * - App Group: `group.com.keept.shared`
 * - Flat snapshot: `ios-tracking-snapshot-v2` with opaque `trackedAppTokenIds`
 * - Selection blob: `ios-family-activity-selection-v1` (FamilyActivityPicker)
 * - Daily usage totals: `ios-daily-usage-v1` (DeviceActivity report + monitor floors)
 * - Auth mode: `individual` (self-control only)
 * - Monitoring/settings flat sync methods are no-ops on iOS (Screen Time does not read them).
 */
/** Shared MMKV instance for Zustand persistence and native monitor reads. */
export const MMKV_INSTANCE_ID = 'keept-storage';

export const PERSIST_STORAGE_KEYS = {
  selectedApps: 'selected-apps-storage',
  appLimits: 'app-limits-storage',
  monitoring: 'monitoring-storage',
  settings: 'settings-storage',
  onboarding: 'onboarding-storage',
  usageHistory: 'usage-history-storage',
} as const;

/** Bump when `selectedAppsStore` persisted `state.apps` shape changes. */
export const SELECTED_APPS_PERSIST_VERSION = 1;

/** Bump when `appLimitsStore` persisted `state.limitsByAppKey` shape changes. */
export const APP_LIMITS_PERSIST_VERSION = 1;

/** Bump when `monitoringStore` persisted `state.isMonitoring` shape changes. */
export const MONITORING_PERSIST_VERSION = 1;

/** Bump when `settingsStore` persisted shape changes. */
export const SETTINGS_PERSIST_VERSION = 2;

/** Bump when `usageHistoryStore` persisted shape changes. */
export const USAGE_HISTORY_PERSIST_VERSION = 1;

/** Flat tracking snapshot written for native monitor reads (`NativeTrackingSnapshot.kt`). */
export const NATIVE_TRACKING_SNAPSHOT_KEY = 'native-tracking-snapshot-v1';

/** Bump when the flat native snapshot JSON shape changes. */
export const NATIVE_TRACKING_SNAPSHOT_VERSION = 2;

/** Flat monitoring flag for Android boot / FGS resume (`NativeMonitoringSnapshot.kt`). */
export const NATIVE_MONITORING_SNAPSHOT_KEY = 'native-monitoring-snapshot-v1';

/** Bump when the flat monitoring snapshot JSON shape changes. */
export const NATIVE_MONITORING_SNAPSHOT_VERSION = 1;

/** Flat settings for Android widgets / notifications (`NativeSettingsSnapshot.kt`). */
export const NATIVE_SETTINGS_SNAPSHOT_KEY = 'native-settings-snapshot-v1';

/** Bump when the flat settings snapshot JSON shape changes. */
export const NATIVE_SETTINGS_SNAPSHOT_VERSION = 1;

/** iOS flat snapshot for Screen Time monitoring (`IosTrackingSnapshot.swift`). */
export const IOS_TRACKING_SNAPSHOT_KEY = 'ios-tracking-snapshot-v2';

/** Bump when `IosTrackingSnapshot` JSON shape changes. */
export const IOS_TRACKING_SNAPSHOT_VERSION = 2;

/**
 * Native-only ephemeral keys (not Zustand persist). Keep string literals in sync with
 * `PersistSchema.kt` / iOS App Group constants:
 * - Android `usage-access-granted-v1` — Usage Stats latch (`UsageAccessGrantStore.kt`)
 * - Android `last-local-day-key-v1` — last notified local day (`LocalDayChangeNotifier.kt`)
 * - Android `monitor-boot-resume-pending` — FGS resume after boot (`MonitoringBootResumeStore.kt`)
 * - Android `block-snooze-{packageName}` — overlay snooze (`TrackingSnoozeStore.kt`)
 * - Android `daily-warning-{dayKey}-{packageName}` — warning once/day (`DailyWarningStore.kt`)
 * - iOS App Group `last-local-day-key-v1` — last notified local day (`KeeptLocalDayChangeNotifier.swift`)
 * - iOS App Group `ios-block-snooze-{tokenId}` — `IosTrackingSnoozeStore.swift`
 * - iOS App Group `ios-daily-warning-…` — `IosDailyWarningStore.swift`
 */
