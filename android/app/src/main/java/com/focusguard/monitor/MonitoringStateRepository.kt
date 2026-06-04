package com.focusguard.monitor

import com.tencent.mmkv.MMKV
import org.json.JSONObject

/** Reads [monitoringStore] persisted state from the shared MMKV instance. */
internal object MonitoringStateRepository {

    private const val MMKV_INSTANCE_ID = "focus-guard-storage"
    private const val MONITORING_STORAGE_KEY = "monitoring-storage"

    private val mmkv: MMKV? =
        MMKV.mmkvWithID(MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

    /** @return `true` when the user last enabled Focus Mode in JS. */
    fun isMonitoringEnabled(): Boolean {
        val raw = mmkv?.decodeString(MONITORING_STORAGE_KEY) ?: return false

        return try {
            val state = JSONObject(raw).optJSONObject("state") ?: return false
            state.optBoolean("isMonitoring", false)
        } catch (_: Exception) {
            false
        }
    }
}
