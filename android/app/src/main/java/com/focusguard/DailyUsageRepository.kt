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
    private var cachedAtMs: Long = 0L

    companion object {
        /** Short TTL keeps monitor limits accurate while the FGS is running. */
        private const val CACHE_TTL_MS = 60_000L

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
        val nowMs = System.currentTimeMillis()

        synchronized(cacheLock) {
            cachedUsageByPackage?.let { cached ->
                if (
                    cachedDayStartMs == dayStartMs &&
                        nowMs - cachedAtMs < CACHE_TTL_MS
                ) {
                    return cached
                }
            }

            val usageByPackage =
                DailyUsageAggregator.buildUsageByPackage(
                    usageStatsManager,
                    dayStartMs,
                    nowMs,
                )
            cachedUsageByPackage = usageByPackage
            cachedDayStartMs = dayStartMs
            cachedAtMs = nowMs
            return usageByPackage
        }
    }

    fun invalidateCache() {
        synchronized(cacheLock) {
            cachedUsageByPackage = null
            cachedDayStartMs = 0L
            cachedAtMs = 0L
        }
    }
}
