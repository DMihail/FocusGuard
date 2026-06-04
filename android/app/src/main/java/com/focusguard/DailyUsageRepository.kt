package com.focusguard

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import java.util.Calendar

/** Reads per-app foreground usage for the current local calendar day. */
class DailyUsageRepository(
    private val context: Context,
) {

    private val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    /** @return foreground milliseconds for [packageName] since local midnight, or 0. */
    fun getTodayForegroundMs(packageName: String): Long {
        val stats = queryTodayStats() ?: return 0L

        return stats
            .firstOrNull { it.packageName == packageName }
            ?.foregroundTimeMs()
            ?: 0L
    }

    private fun queryTodayStats(): List<UsageStats>? {
        val endTime = System.currentTimeMillis()
        val startTime = startOfLocalDayMs()

        val stats =
            usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_BEST,
                startTime,
                endTime,
            ) ?: usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime,
            )

        return stats?.filter { it.packageName.isNotEmpty() }
    }

    private fun startOfLocalDayMs(): Long {
        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)
        return calendar.timeInMillis
    }

    private fun UsageStats.foregroundTimeMs(): Long =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            totalTimeVisible
        } else {
            @Suppress("DEPRECATION")
            totalTimeInForeground
        }
}
