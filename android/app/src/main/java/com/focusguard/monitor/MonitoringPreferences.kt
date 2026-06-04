package com.focusguard.monitor

import com.tencent.mmkv.MMKV
import org.json.JSONObject

/** Reads persisted monitoring toggle from the same MMKV store as [monitoringStore] (JS). */
internal object MonitoringPreferences {

    private const val MMKV_INSTANCE_ID = "focus-guard-storage"
    private const val MONITORING_STORAGE_KEY = "monitoring-storage"

    fun isMonitoringEnabled(): Boolean {
        val raw = mmkv()?.decodeString(MONITORING_STORAGE_KEY) ?: return false

        return try {
            JSONObject(raw).optJSONObject("state")?.optBoolean("isMonitoring", false) == true
        } catch (_: Exception) {
            false
        }
    }

    /** Persists the monitoring toggle in the Zustand `monitoring-storage` shape. */
    fun setMonitoringEnabled(enabled: Boolean) {
        val payload =
            JSONObject()
                .put(
                    "state",
                    JSONObject().put("isMonitoring", enabled),
                )
                .put("version", 0)
                .toString()

        mmkv()?.encode(MONITORING_STORAGE_KEY, payload)
    }

    private fun mmkv(): MMKV? = MMKV.mmkvWithID(MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)
}
