package com.focusguard

import com.focusguard.storage.KeeptMmkv
import com.focusguard.storage.PersistSchema
import com.focusguard.storage.ZustandPersistReader

/** Reads user settings persisted by JS [settingsStore]. */
object SettingsRepository {

    private val mmkv get() = KeeptMmkv.instance

    private var cachedRaw: String? = null
    private var cachedNotificationsEnabled: Boolean? = null

    fun invalidateCache() {
        cachedRaw = null
        cachedNotificationsEnabled = null
    }

    fun areNotificationsEnabled(): Boolean {
        val raw = mmkv.decodeString(PersistSchema.SETTINGS_STORAGE_KEY) ?: return true

        if (raw == cachedRaw && cachedNotificationsEnabled != null) {
            return cachedNotificationsEnabled!!
        }

        val enabled =
            try {
                val state =
                    ZustandPersistReader.readStateIfCompatible(
                        raw,
                        PersistSchema.SETTINGS_PERSIST_VERSION,
                        PersistSchema.SETTINGS_STORAGE_KEY,
                    ) ?: return true
                state.optBoolean("notificationsEnabled", true)
            } catch (_: Exception) {
                true
            }

        cachedRaw = raw
        cachedNotificationsEnabled = enabled
        return enabled
    }
}
