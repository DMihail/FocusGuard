package com.focusguard.apps

import android.app.usage.UsageStatsManager
import android.content.Context
import com.focusguard.monitor.UsageAccess
import com.focusguard.usage.UsageStatsExtensions.foregroundTimeMs
import com.focusguard.usage.UsageStatsExtensions.startOfLocalDayMs

/** Reads per-app foreground usage for the current local day. */
internal class UsageStatsCatalogRepository(
    context: Context,
) {
    private val appContext = context.applicationContext
    private val ownPackage = appContext.packageName

    private val usageStatsManager =
        appContext.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager

    private var cachedUsage: List<AppUsageInfo>? = null
    private var cachedDayStartMs: Long = 0L

    fun getTodayUsage(): List<AppUsageInfo> {
        if (!UsageAccess.hasAccess(appContext) || usageStatsManager == null) {
            return emptyList()
        }

        val dayStartMs = startOfLocalDayMs()
        cachedUsage?.let { cached ->
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

        if (stats.isNullOrEmpty()) {
            cachedUsage = emptyList()
            cachedDayStartMs = dayStartMs
            return emptyList()
        }

        val result =
            stats
                .asSequence()
                .filter { it.packageName != ownPackage && it.foregroundTimeMs() > 0 }
                .map { usageStat ->
                    AppUsageInfo(
                        packageName = usageStat.packageName,
                        appName = usageStat.packageName,
                        category = "",
                        appImage = "",
                        totalTimeForeground = usageStat.foregroundTimeMs(),
                        lastTimeUsed = usageStat.lastTimeUsed,
                    )
                }
                .sortedByDescending { it.totalTimeForeground }
                .toList()

        cachedUsage = result
        cachedDayStartMs = dayStartMs
        return result
    }

    fun invalidateCache() {
        cachedUsage = null
        cachedDayStartMs = 0L
    }
}
