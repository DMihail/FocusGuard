package com.focusguard

import com.tencent.mmkv.MMKV
import org.json.JSONObject

/** Reads user settings persisted by JS [settingsStore]. */
class SettingsRepository {

    private val mmkv: MMKV? =
        MMKV.mmkvWithID(MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

    fun areNotificationsEnabled(): Boolean {
        val raw = mmkv?.decodeString(SETTINGS_STORAGE_KEY) ?: return true

        return try {
            val state = JSONObject(raw).optJSONObject("state") ?: return true
            state.optBoolean("notificationsEnabled", true)
        } catch (_: Exception) {
            true
        }
    }

    companion object {
        private const val MMKV_INSTANCE_ID = "focus-guard-storage"
        private const val SETTINGS_STORAGE_KEY = "settings-storage"
    }
}
