package com.focusguard.overlay

import com.focusguard.storage.KeeptMmkv
import java.util.concurrent.ConcurrentHashMap

/** Persists temporary snooze windows after the user taps "5 more minutes" on the block overlay. */
internal object TrackingSnoozeStore {
    private const val KEY_PREFIX = "block-snooze-"

    private val mmkv get() = KeeptMmkv.instance
    private val snoozeUntilCache = ConcurrentHashMap<String, Long>()

    fun setSnooze(packageName: String, durationMs: Long) {
        val until = System.currentTimeMillis() + durationMs
        snoozeUntilCache[packageName] = until
        mmkv.encode(key(packageName), until)
    }

    fun isSnoozed(packageName: String): Boolean {
        val now = System.currentTimeMillis()
        val cachedUntil = snoozeUntilCache[packageName]

        if (cachedUntil != null) {
            if (cachedUntil > now) {
                return true
            }

            snoozeUntilCache.remove(packageName)
            if (cachedUntil > 0L) {
                clearSnooze(packageName)
            }
            return false
        }

        val until = mmkv.decodeLong(key(packageName), 0L)
        if (until <= now) {
            if (until > 0L) {
                clearSnooze(packageName)
            }
            return false
        }

        snoozeUntilCache[packageName] = until
        return true
    }

    fun clearSnooze(packageName: String) {
        snoozeUntilCache.remove(packageName)
        mmkv.removeValueForKey(key(packageName))
    }

    private fun key(packageName: String) = "$KEY_PREFIX$packageName"
}
