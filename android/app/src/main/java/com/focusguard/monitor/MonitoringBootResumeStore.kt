package com.focusguard.monitor

import com.focusguard.storage.KeeptMmkv

/** Marks that focus monitoring should resume after the user opens the app (boot FGS restriction). */
internal object MonitoringBootResumeStore {
    private const val KEY = "monitor-boot-resume-pending"

    private val mmkv get() = KeeptMmkv.instance

    fun markPending() {
        mmkv.encode(KEY, true)
    }

    fun consumePending(): Boolean {
        val pending = mmkv.decodeBool(KEY, false)
        if (pending) {
            mmkv.removeValueForKey(KEY)
        }
        return pending
    }
}
