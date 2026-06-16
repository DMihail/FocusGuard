package com.focusguard.overlay

import com.focusguard.storage.PersistSchema
import com.tencent.mmkv.MMKV

/** Persists temporary snooze windows after the user taps "5 more minutes" on the block overlay. */
internal object TrackingSnoozeStore {
    private const val KEY_PREFIX = "block-snooze-"

    private val mmkv: MMKV? =
        MMKV.mmkvWithID(PersistSchema.MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

    fun setSnooze(packageName: String, durationMs: Long) {
        val until = System.currentTimeMillis() + durationMs
        mmkv?.encode(key(packageName), until)
    }

    fun isSnoozed(packageName: String): Boolean {
        val until = mmkv?.decodeLong(key(packageName), 0L) ?: 0L
        if (until <= System.currentTimeMillis()) {
            clearSnooze(packageName)
            return false
        }
        return true
    }

    fun clearSnooze(packageName: String) {
        mmkv?.removeValueForKey(key(packageName))
    }

    private fun key(packageName: String) = "$KEY_PREFIX$packageName"
}
