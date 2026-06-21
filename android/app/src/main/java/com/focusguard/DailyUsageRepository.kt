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

    private val cacheLock = Any()
    private var cachedStats: List<UsageStats>? = null
    private var cachedDayStartMs: Long = 0L

    /** @return foreground milliseconds for [packageName] since local midnight, or 0. */
    fun getTodayForegroundMs(packageName: String): Long =
        getTodayForegroundMsForPackages(listOf(packageName))[packageName] ?: 0L

    /** @return foreground milliseconds per package since local midnight; missing packages map to 0. */
    fun getTodayForegroundMsForPackages(packageNames: Collection<String>): Map<String, Long> {
        val stats = queryTodayStats()
        val usageByPackage =
            stats?.associate { stat ->
                stat.packageName to stat.foregroundTimeMs()
            } ?: emptyMap()

        return packageNames.associateWith { packageName -> usageByPackage[packageName] ?: 0L }
    }

    private fun queryTodayStats(): List<UsageStats>? {
        val dayStartMs = startOfLocalDayMs()

        synchronized(cacheLock) {
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
    }

    fun invalidateCache() {
        synchronized(cacheLock) {
            cachedStats = null
            cachedDayStartMs = 0L
        }
    }
}
