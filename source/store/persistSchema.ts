/** @format */

/**
 * MMKV / Zustand persist contract shared with Android (`PersistSchema.kt`).
 * Keep storage keys and version numbers in sync when persisted store shapes change.
 *
 * ## JS ↔ native data flow
 *
 * - **Turbo Module (`KeeptTurboModule`)** — permissions, usage catalogs, monitor control,
 *   and `syncTrackingConfig` for the flat tracking snapshot.
 * - **Shared MMKV (`keept-storage`)** — Zustand persist blobs plus the flat
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
 * - Daily usage totals: `ios-daily-usage-v1` (phase 3 report + monitor floors)
 * - Auth mode: `individual` (self-control only)
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

/** App Group shared between the iOS app and DeviceActivity extensions (`KeeptAppGroup.swift`). */
export const IOS_APP_GROUP_ID = 'group.com.keept.shared';

/** iOS flat snapshot for Screen Time monitoring (`IosTrackingSnapshot.swift`). */
export const IOS_TRACKING_SNAPSHOT_KEY = 'ios-tracking-snapshot-v2';

/** Bump when `IosTrackingSnapshot` JSON shape changes. */
export const IOS_TRACKING_SNAPSHOT_VERSION = 2;

/** Base64-encoded `FamilyActivitySelection` blob written by native picker (phase 1). */
export const IOS_FAMILY_ACTIVITY_SELECTION_KEY = 'ios-family-activity-selection-v1';

/** Per-token daily usage milliseconds written by KeeptReport + KeeptMonitor (`IosDailyUsageStore.swift`). */
export const IOS_DAILY_USAGE_KEY = 'ios-daily-usage-v1';

/** Native-only latch: Usage Stats was confirmed granted (`UsageAccessGrantStore.kt`). */
export const USAGE_ACCESS_GRANTED_KEY = 'usage-access-granted-v1';

/**
 * Native-only ephemeral keys (not Zustand persist). Documented here for cross-platform reference:
 * - Android `block-snooze-{packageName}` — overlay snooze (`TrackingSnoozeStore.kt`)
 * - Android `last-local-day-key-v1` — last notified local day (`LocalDayChangeNotifier.kt`)
 * - iOS App Group `last-local-day-key-v1` — last notified local day (`KeeptLocalDayChangeNotifier.swift`)
 * - Android daily warning keys — `DailyWarningStore.kt`
 * - iOS `{IOS_APP_GROUP_ID}/ios-block-snooze-{tokenId}` — `IosTrackingSnoozeStore.swift`
 * - iOS daily warning keys — `IosDailyWarningStore.swift`
 */
