package com.focusguard

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import com.focusguard.usage.UsageStatsExtensions.foregroundTimeMs
import com.focusguard.usage.UsageStatsExtensions.startOfLocalDayMs

/** Reads per-app foreground usage for the current local calendar day. */
class DailyUsageRepository(
    private val context: Context,
) {

    private val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    private var cachedStats: List<UsageStats>? = null
    private var cachedDayStartMs: Long = 0L

    /** @return foreground milliseconds for [packageName] since local midnight, or 0. */
    fun getTodayForegroundMs(packageName: String): Long {
        val stats = queryTodayStats() ?: return 0L

        return stats
            .firstOrNull { it.packageName == packageName }
            ?.foregroundTimeMs()
            ?: 0L
    }

    private fun queryTodayStats(): List<UsageStats>? {
        val dayStartMs = startOfLocalDayMs()
        cachedStats?.let { cached ->
            if (cachedDayStartMs == dayStartMs) {
                return cached
            }
        }

        val endTime = System.currentTimeMillis()
        val stats =
            usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_BEST,
                dayStartMs,
                endTime,
            ) ?: usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                dayStartMs,
                endTime,
            )

        val filtered = stats?.filter { it.packageName.isNotEmpty() }
        cachedStats = filtered
        cachedDayStartMs = dayStartMs
        return filtered
    }

    fun invalidateCache() {
        cachedStats = null
        cachedDayStartMs = 0L
    }
}
