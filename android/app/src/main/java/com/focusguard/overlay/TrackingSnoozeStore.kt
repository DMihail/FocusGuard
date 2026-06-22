package com.focusguard.overlay

import com.focusguard.storage.KeeptMmkv
import com.focusguard.storage.PersistSchema

/** Persists temporary snooze windows after the user taps "5 more minutes" on the block overlay. */
internal object TrackingSnoozeStore {
    private const val KEY_PREFIX = "block-snooze-"

    private val mmkv get() = KeeptMmkv.instance

    fun setSnooze(packageName: String, durationMs: Long) {
        val until = System.currentTimeMillis() + durationMs
        mmkv.encode(key(packageName), until)
    }

    fun isSnoozed(packageName: String): Boolean {
        val until = mmkv.decodeLong(key(packageName), 0L)
        if (until <= System.currentTimeMillis()) {
            clearSnooze(packageName)
            return false
        }
        return true
    }

    fun clearSnooze(packageName: String) {
        mmkv.removeValueForKey(key(packageName))
    }

    private fun key(packageName: String) = "$KEY_PREFIX$packageName"
}
