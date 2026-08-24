package com.focusguard

import com.focusguard.storage.NativeSettingsSnapshot

/**
 * Reads user settings from the flat native settings snapshot
 * (`syncSettingsConfig` / [NativeSettingsSnapshot]). No Zustand persist fallback
 * (legacy blobs are migrated once inside the snapshot reader).
 */
object SettingsRepository {

    private val defaultThemePreference = "system"
    private val defaultNotificationsEnabled = true

    fun invalidateCache() {
        NativeSettingsSnapshot.invalidateCache()
    }

    fun getThemePreference(): String =
        NativeSettingsSnapshot.read()?.themePreference ?: defaultThemePreference

    fun areNotificationsEnabled(): Boolean =
        NativeSettingsSnapshot.read()?.notificationsEnabled ?: defaultNotificationsEnabled
}
