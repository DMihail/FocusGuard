package com.focusguard

import com.focusguard.storage.KeeptMmkv
import com.focusguard.storage.PersistSchema
import com.focusguard.storage.ZustandPersistReader

/** Reads user settings persisted by JS [settingsStore]. */
class SettingsRepository {

    private val mmkv get() = KeeptMmkv.instance

    fun areNotificationsEnabled(): Boolean {
        val raw = mmkv.decodeString(PersistSchema.SETTINGS_STORAGE_KEY) ?: return true

        return try {
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
    }
}
