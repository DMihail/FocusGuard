package com.focusguard

import com.focusguard.storage.KeeptMmkv
import com.focusguard.storage.PersistSchema
import com.focusguard.storage.ZustandPersistReader

/** Reads user settings persisted by JS [settingsStore]. */
object SettingsRepository {

    private val mmkv get() = KeeptMmkv.instance

    private data class CachedSettings(
        val raw: String,
        val themePreference: String,
        val notificationsEnabled: Boolean,
    )

    private val defaultSettings =
        CachedSettings(
            raw = "",
            themePreference = "system",
            notificationsEnabled = true,
        )

    private var cache: CachedSettings? = null

    fun invalidateCache() {
        cache = null
    }

    fun getThemePreference(): String = loadSettings().themePreference

    fun areNotificationsEnabled(): Boolean = loadSettings().notificationsEnabled

    private fun loadSettings(): CachedSettings {
        val raw = mmkv.decodeString(PersistSchema.SETTINGS_STORAGE_KEY) ?: return defaultSettings

        cache?.takeIf { it.raw == raw }?.let { return it }

        val parsed = parseSettings(raw)
        cache = parsed
        return parsed
    }

    private fun parseSettings(raw: String): CachedSettings {
        val fallback =
            CachedSettings(
                raw = raw,
                themePreference = "system",
                notificationsEnabled = true,
            )

        return try {
            val state =
                ZustandPersistReader.readStateIfCompatible(
                    raw,
                    PersistSchema.SETTINGS_PERSIST_VERSION,
                    PersistSchema.SETTINGS_STORAGE_KEY,
                ) ?: return fallback

            CachedSettings(
                raw = raw,
                themePreference = state.optString("themePreference", "system"),
                notificationsEnabled = state.optBoolean("notificationsEnabled", true),
            )
        } catch (_: Exception) {
            fallback
        }
    }
}
