package com.focusguard.overlay

import com.focusguard.storage.KeeptMmkv
import com.focusguard.storage.PersistSchema
import java.util.Calendar

/** Persists one warning notification per app per local calendar day. */
internal object DailyWarningStore {
    private const val KEY_PREFIX = "daily-warning-"

    private val mmkv get() = KeeptMmkv.instance

    fun wasWarningShownToday(packageName: String): Boolean {
        val key = keyForToday(packageName)
        return mmkv.decodeBool(key, false)
    }

    fun markWarningShownToday(packageName: String) {
        mmkv.encode(keyForToday(packageName), true)
    }

    private fun keyForToday(packageName: String): String {
        val calendar = Calendar.getInstance()
        val dayKey =
            "${calendar.get(Calendar.YEAR)}-${calendar.get(Calendar.MONTH)}-${calendar.get(Calendar.DAY_OF_MONTH)}"
        return "$KEY_PREFIX$dayKey-$packageName"
    }
}
