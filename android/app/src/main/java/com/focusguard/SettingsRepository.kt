package com.focusguard

import com.focusguard.storage.PersistSchema
import com.focusguard.storage.ZustandPersistReader
import com.tencent.mmkv.MMKV

/** Reads user settings persisted by JS [settingsStore]. */
class SettingsRepository {

    private val mmkv: MMKV? =
        MMKV.mmkvWithID(PersistSchema.MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

    fun areNotificationsEnabled(): Boolean {
        val raw = mmkv?.decodeString(PersistSchema.SETTINGS_STORAGE_KEY) ?: return true

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
