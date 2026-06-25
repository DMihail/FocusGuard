package com.focusguard

import android.app.usage.UsageStatsManager
import android.content.Context
import com.focusguard.usage.DailyUsageAggregator
import com.focusguard.usage.UsageStatsExtensions.startOfLocalDayMs

/** Reads per-app foreground usage for the current local calendar day. */
class DailyUsageRepository private constructor(
    context: Context,
) {

    private val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    private val cacheLock = Any()
    private var cachedUsageByPackage: Map<String, Long>? = null
    private var cachedDayStartMs: Long = 0L

    companion object {
        @Volatile
        private var instance: DailyUsageRepository? = null

        fun getInstance(context: Context): DailyUsageRepository =
            instance
                ?: synchronized(this) {
                    instance
                        ?: DailyUsageRepository(context.applicationContext).also { repository ->
                            instance = repository
                        }
                }

        fun invalidateSharedCache() {
            instance?.invalidateCache()
        }
    }

    /** @return foreground milliseconds for [packageName] since local midnight, or 0. */
    fun getTodayForegroundMs(packageName: String): Long =
        getTodayForegroundMsForPackages(listOf(packageName))[packageName] ?: 0L

    /** @return foreground milliseconds per package since local midnight; missing packages map to 0. */
    fun getTodayForegroundMsForPackages(packageNames: Collection<String>): Map<String, Long> {
        val usageByPackage = queryTodayUsageByPackage()
        return DailyUsageAggregator.usageForPackages(usageByPackage, packageNames)
    }

    private fun queryTodayUsageByPackage(): Map<String, Long> {
        val dayStartMs = startOfLocalDayMs()

        synchronized(cacheLock) {
            cachedUsageByPackage?.let { cached ->
                if (cachedDayStartMs == dayStartMs) {
                    return cached
                }
            }

            val usageByPackage =
                DailyUsageAggregator.buildUsageByPackage(
                    usageStatsManager,
                    dayStartMs,
                    System.currentTimeMillis(),
                )
            cachedUsageByPackage = usageByPackage
            cachedDayStartMs = dayStartMs
            return usageByPackage
        }
    }

    fun invalidateCache() {
        synchronized(cacheLock) {
            cachedUsageByPackage = null
            cachedDayStartMs = 0L
        }
    }
}
