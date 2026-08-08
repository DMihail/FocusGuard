package com.focusguard.monitor

import com.focusguard.storage.KeeptStorage
import com.focusguard.storage.PersistSchema
import com.focusguard.storage.ZustandPersistReader

/** Reads [monitoringStore] persisted state from the shared MMKV instance. */
internal object MonitoringStateRepository {

    private val mmkv get() = KeeptStorage.mmkv

    /** @return `true` when the user last enabled Focus Mode in JS. */
    fun isMonitoringEnabled(): Boolean {
        val raw = mmkv.decodeString(PersistSchema.MONITORING_STORAGE_KEY) ?: return false

        return try {
            val state =
                ZustandPersistReader.readStateIfCompatible(
                    raw,
                    PersistSchema.MONITORING_PERSIST_VERSION,
                    PersistSchema.MONITORING_STORAGE_KEY,
                ) ?: return false
            state.optBoolean("isMonitoring", false)
        } catch (_: Exception) {
            false
        }
    }
}
