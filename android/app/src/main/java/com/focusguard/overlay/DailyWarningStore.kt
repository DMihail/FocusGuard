package com.focusguard.overlay

import com.focusguard.storage.KeeptStorage
import com.focusguard.usage.getLocalDayKey
import java.util.concurrent.ConcurrentHashMap

/** Persists one warning notification per app per local calendar day. */
internal object DailyWarningStore {
    private const val KEY_PREFIX = "daily-warning-"

    private val mmkv get() = KeeptStorage.mmkv

    private val warnedTodayCache = ConcurrentHashMap.newKeySet<String>()
    private var cacheDayKey: String? = null
    private var lastPrunedDayKey: String? = null

    fun wasWarningShownToday(packageName: String): Boolean {
        ensureDayCache()

        if (warnedTodayCache.contains(packageName)) {
            return true
        }

        val shown = mmkv.decodeBool(keyForToday(packageName), false)
        if (shown) {
            warnedTodayCache.add(packageName)
        }
        return shown
    }

    fun markWarningShownToday(packageName: String) {
        ensureDayCache()
        warnedTodayCache.add(packageName)
        mmkv.encode(keyForToday(packageName), true)
    }

    /** @internal Unit-test reset. */
    internal fun resetForTests() {
        warnedTodayCache.clear()
        cacheDayKey = null
        lastPrunedDayKey = null
    }

    /** Drops MMKV keys from previous local calendar days. */
    fun pruneStaleKeys() {
        ensureDayCache()
        val dayKey = cacheDayKey!!
        if (lastPrunedDayKey == dayKey) {
            return
        }

        lastPrunedDayKey = dayKey
        val todayPrefix = "$KEY_PREFIX$dayKey-"

        mmkv.allKeys()?.forEach { key ->
            if (key.startsWith(KEY_PREFIX) && !key.startsWith(todayPrefix)) {
                mmkv.removeValueForKey(key)
            }
        }
    }

    private fun ensureDayCache() {
        val dayKey = getLocalDayKey()
        if (cacheDayKey != dayKey) {
            warnedTodayCache.clear()
            cacheDayKey = dayKey
        }
    }

    private fun keyForToday(packageName: String): String {
        ensureDayCache()
        return "$KEY_PREFIX${cacheDayKey!!}-$packageName"
    }
}
