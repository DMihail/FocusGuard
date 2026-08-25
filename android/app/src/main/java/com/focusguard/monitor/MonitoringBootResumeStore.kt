package com.focusguard.monitor

import com.focusguard.storage.KeeptStorage
import com.focusguard.storage.PersistSchema

/** Marks that focus monitoring should resume after the user opens the app (boot FGS restriction). */
internal object MonitoringBootResumeStore {
    private val mmkv get() = KeeptStorage.mmkv

    fun markPending() {
        mmkv.encode(PersistSchema.MONITOR_BOOT_RESUME_PENDING_KEY, true)
    }

    fun hasPending(): Boolean =
        mmkv.decodeBool(PersistSchema.MONITOR_BOOT_RESUME_PENDING_KEY, false)

    fun clearPending() {
        mmkv.removeValueForKey(PersistSchema.MONITOR_BOOT_RESUME_PENDING_KEY)
    }
}
