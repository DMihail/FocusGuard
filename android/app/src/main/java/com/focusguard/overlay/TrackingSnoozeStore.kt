package com.focusguard.overlay

import com.focusguard.storage.KeeptStorage
import com.focusguard.storage.PersistSchema
import java.util.concurrent.ConcurrentHashMap

/** Persists temporary snooze windows after the user taps "5 more minutes" on the block overlay. */
internal object TrackingSnoozeStore {
    private val mmkv get() = KeeptStorage.mmkv
    private val snoozeUntilCache = ConcurrentHashMap<String, Long>()

    fun setSnooze(packageName: String, durationMs: Long) {
        val until = System.currentTimeMillis() + durationMs
        snoozeUntilCache[packageName] = until
        mmkv.encode(key(packageName), until)
    }

    fun getRemainingMs(packageName: String): Long {
        val now = System.currentTimeMillis()
        val cachedUntil = snoozeUntilCache[packageName]

        if (cachedUntil != null) {
            if (cachedUntil > now) {
                return cachedUntil - now
            }

            snoozeUntilCache.remove(packageName)
            if (cachedUntil > 0L) {
                clearSnooze(packageName)
            }
            return 0L
        }

        val until = mmkv.decodeLong(key(packageName), 0L)
        if (until <= now) {
            if (until > 0L) {
                clearSnooze(packageName)
            }
            return 0L
        }

        snoozeUntilCache[packageName] = until
        return until - now
    }

    fun clearSnooze(packageName: String) {
        snoozeUntilCache.remove(packageName)
        mmkv.removeValueForKey(key(packageName))
    }

    private fun key(packageName: String) = "${PersistSchema.BLOCK_SNOOZE_KEY_PREFIX}$packageName"
}
