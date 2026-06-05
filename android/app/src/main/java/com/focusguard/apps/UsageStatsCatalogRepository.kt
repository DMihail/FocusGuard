package com.focusguard.apps

import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.pm.PackageManager
import com.focusguard.monitor.UsageAccess
import com.focusguard.usage.UsageStatsExtensions.foregroundTimeMs
import com.focusguard.usage.UsageStatsExtensions.startOfLocalDayMs

/** Reads per-app foreground usage for the current local day. */
internal class UsageStatsCatalogRepository(
    context: Context,
) {
    private val appContext = context.applicationContext
    private val packageManager = appContext.packageManager
    private val iconCache = AppIconCache(appContext)
    private val ownPackage = appContext.packageName

    private val usageStatsManager =
        appContext.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager

    fun getTodayUsage(): List<AppUsageInfo> {
        if (!UsageAccess.hasAccess(appContext) || usageStatsManager == null) {
            return emptyList()
        }

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

        if (stats.isNullOrEmpty()) {
            return emptyList()
        }

        return stats
            .asSequence()
            .filter { it.packageName != ownPackage && it.foregroundTimeMs() > 0 }
            .mapNotNull { usageStat ->
                try {
                    val appInfo = packageManager.getApplicationInfo(usageStat.packageName, 0)
                    AppUsageInfo(
                        packageName = usageStat.packageName,
                        appName = packageManager.getApplicationLabel(appInfo).toString(),
                        category = AppCategoryMapper.fromApplicationInfo(appInfo),
                        appImage = iconCache.getUri(usageStat.packageName),
                        totalTimeForeground = usageStat.foregroundTimeMs(),
                        lastTimeUsed = usageStat.lastTimeUsed,
                    )
                } catch (_: PackageManager.NameNotFoundException) {
                    null
                }
            }
            .sortedByDescending { it.totalTimeForeground }
            .toList()
    }
}
