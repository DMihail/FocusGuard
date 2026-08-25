package com.focusguard.storage

/**
 * MMKV / Zustand persist contract shared with JS (`source/store/persistSchema.ts`).
 * Keep storage keys and version numbers in sync when persisted store shapes change.
 *
 * JS writes flat snapshots via Turbo Module sync methods; Android background code reads
 * those keys only (legacy Zustand blobs are migrated once if a flat key is missing).
 */
object PersistSchema {
    const val MMKV_INSTANCE_ID = "keept-storage"

    /** Legacy Zustand persist blob — migrate-only; JS still writes for UI hydration. */
    const val LEGACY_MONITORING_STORAGE_KEY = "monitoring-storage"

    /** Legacy Zustand persist blob — migrate-only; JS still writes for UI hydration. */
    const val LEGACY_SETTINGS_STORAGE_KEY = "settings-storage"

    const val LEGACY_MONITORING_PERSIST_VERSION = 1
    const val LEGACY_SETTINGS_PERSIST_VERSION = 2

    const val NATIVE_TRACKING_SNAPSHOT_KEY = "native-tracking-snapshot-v1"
    const val NATIVE_TRACKING_SNAPSHOT_VERSION = 2

    const val NATIVE_MONITORING_SNAPSHOT_KEY = "native-monitoring-snapshot-v1"
    const val NATIVE_MONITORING_SNAPSHOT_VERSION = 1

    const val NATIVE_SETTINGS_SNAPSHOT_KEY = "native-settings-snapshot-v1"
    const val NATIVE_SETTINGS_SNAPSHOT_VERSION = 1

    /** Set by native after Usage Stats is confirmed (`UsageAccessGrantStore.kt`). */
    const val USAGE_ACCESS_GRANTED_KEY = "usage-access-granted-v1"

    /** Last local calendar day successfully notified to JS (`LocalDayChangeNotifier.kt`). */
    const val LAST_LOCAL_DAY_KEY = "last-local-day-key-v1"

    /** Ephemeral: FGS resume after boot / background start block (`MonitoringBootResumeStore`). */
    const val MONITOR_BOOT_RESUME_PENDING_KEY = "monitor-boot-resume-pending"

    /** Ephemeral prefix: overlay "5 more minutes" snooze until (`TrackingSnoozeStore`). */
    const val BLOCK_SNOOZE_KEY_PREFIX = "block-snooze-"

    /** Ephemeral prefix: one warning notification per app per local day (`DailyWarningStore`). */
    const val DAILY_WARNING_KEY_PREFIX = "daily-warning-"
}
