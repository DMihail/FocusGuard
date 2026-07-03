package com.focusguard.overlay

import com.focusguard.storage.KeeptMmkv
import com.focusguard.usage.getLocalDayKey
import java.util.concurrent.ConcurrentHashMap

/** Persists one warning notification per app per local calendar day. */
internal object DailyWarningStore {
    private const val KEY_PREFIX = "daily-warning-"

    private val mmkv get() = KeeptMmkv.instance

    private val warnedTodayCache = ConcurrentHashMap.newKeySet<String>()
    private var cacheDayKey: String? = null

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

    /** Drops MMKV keys from previous local calendar days. */
    fun pruneStaleKeys() {
        val todayPrefix = "$KEY_PREFIX${getLocalDayKey()}-"

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
        return "$KEY_PREFIX${getLocalDayKey()}-$packageName"
    }
}
