package com.focusguard.overlay

import com.focusguard.DailyUsageRepository
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
        DailyUsageRepository.invalidateCacheIfLoaded()
    }

    fun isSnoozed(packageName: String): Boolean = getRemainingMs(packageName) > 0L

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
        DailyUsageRepository.invalidateCacheIfLoaded()
    }

    private fun key(packageName: String) = "$KEY_PREFIX$packageName"
}
