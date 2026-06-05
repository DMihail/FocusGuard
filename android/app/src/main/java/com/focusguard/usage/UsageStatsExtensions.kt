package com.focusguard.usage

import android.app.usage.UsageStats
import android.os.Build
import java.util.Calendar

/** Shared usage-stats helpers for repositories and the React Native bridge. */
internal object UsageStatsExtensions {

    fun startOfLocalDayMs(): Long {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }

    fun UsageStats.foregroundTimeMs(): Long =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            totalTimeVisible
        } else {
            @Suppress("DEPRECATION")
            totalTimeInForeground
        }
}
