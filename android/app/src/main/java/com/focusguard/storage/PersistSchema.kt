package com.focusguard.storage

/**
 * MMKV / Zustand persist contract shared with JS (`source/store/persistSchema.ts`).
 * Keep storage keys and version numbers in sync when persisted store shapes change.
 *
 * JS writes the flat tracking snapshot via Turbo Module [syncTrackingConfig]; native monitor
 * code reads [NATIVE_TRACKING_SNAPSHOT_KEY] first, then falls back to Zustand persist blobs.
 */
object PersistSchema {
    const val MMKV_INSTANCE_ID = "keept-storage"

    const val SELECTED_APPS_STORAGE_KEY = "selected-apps-storage"
    const val APP_LIMITS_STORAGE_KEY = "app-limits-storage"
    const val MONITORING_STORAGE_KEY = "monitoring-storage"
    const val SETTINGS_STORAGE_KEY = "settings-storage"

    const val SELECTED_APPS_PERSIST_VERSION = 1
    const val APP_LIMITS_PERSIST_VERSION = 1
    const val MONITORING_PERSIST_VERSION = 1
    const val SETTINGS_PERSIST_VERSION = 2

    const val NATIVE_TRACKING_SNAPSHOT_KEY = "native-tracking-snapshot-v1"
    const val NATIVE_TRACKING_SNAPSHOT_VERSION = 2

    /** Set by native after Usage Stats is confirmed (`UsageAccessGrantStore.kt`). */
    const val USAGE_ACCESS_GRANTED_KEY = "usage-access-granted-v1"

    /** Last local calendar day successfully notified to JS (`LocalDayChangeNotifier.kt`). */
    const val LAST_LOCAL_DAY_KEY = "last-local-day-key-v1"
}
