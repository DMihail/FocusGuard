package com.focusguard

import android.app.usage.UsageStatsManager
import android.content.Context
import com.focusguard.usage.DailyUsageAggregator
import com.focusguard.usage.LocalDayChangeNotifier
import com.focusguard.usage.UsageStatsExtensions.startOfLocalDayMs

/** Reads per-app foreground usage for the current local calendar day. */
class DailyUsageRepository private constructor(
    private val appContext: Context,
) {

    private val usageStatsManager =
        appContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    private val cacheLock = Any()
    private var cachedUsageByPackage: Map<String, Long>? = null
    private var cachedDayStartMs: Long = 0L
    private var cachedAtMs: Long = 0L

    companion object {
        /** Safety net when an event-driven invalidation is missed. */
        private const val CACHE_TTL_MS = 5 * 60_000L

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

        fun invalidateCacheIfLoaded() {
            instance?.invalidateCache()
        }
    }

    /** @return foreground milliseconds for [packageName] since local midnight, or 0. */
    fun getTodayForegroundMs(packageName: String): Long =
        getTodayForegroundMsForPackages(listOf(packageName))[packageName] ?: 0L

    /** @return foreground milliseconds per package since local midnight; missing packages map to 0. */
    fun getTodayForegroundMsForPackages(packageNames: Collection<String>): Map<String, Long> {
        val packageFilter =
            packageNames.filter { packageName -> packageName.isNotEmpty() }.toSet()

        if (packageFilter.isEmpty()) {
            return emptyMap()
        }

        val usageByPackage = queryUsageForPackages(packageFilter)
        return DailyUsageAggregator.usageForPackages(usageByPackage, packageFilter)
    }

    private fun queryUsageForPackages(packageFilter: Set<String>): Map<String, Long> {
        val dayStartMs = startOfLocalDayMs()
        val nowMs = System.currentTimeMillis()

        synchronized(cacheLock) {
            val cacheStale =
                cachedUsageByPackage == null ||
                    cachedDayStartMs != dayStartMs ||
                    nowMs - cachedAtMs >= CACHE_TTL_MS

            if (cacheStale) {
                LocalDayChangeNotifier.checkAndNotify(appContext)
                cachedUsageByPackage = emptyMap()
                cachedDayStartMs = dayStartMs
            }

            val cached = cachedUsageByPackage!!
            val missing = packageFilter.filter { packageName -> packageName !in cached }.toSet()

            if (!cacheStale && missing.isEmpty()) {
                return cached
            }

            val toQuery = if (cacheStale) packageFilter else missing
            val fresh =
                DailyUsageAggregator.buildUsageByPackage(
                    usageStatsManager,
                    dayStartMs,
                    nowMs,
                    toQuery,
                )

            val merged = if (cacheStale) fresh else cached + fresh
            cachedUsageByPackage = merged
            cachedAtMs = nowMs
            return merged
        }
    }

    fun invalidateCache() {
        synchronized(cacheLock) {
            cachedUsageByPackage = null
            cachedDayStartMs = 0L
            cachedAtMs = 0L
        }
    }

    /** Drops cached totals for [packageNames] so the next read re-queries only those apps. */
    fun invalidatePackages(packageNames: Collection<String>) {
        if (packageNames.isEmpty()) {
            return
        }

        synchronized(cacheLock) {
            val cached = cachedUsageByPackage ?: return

            val next = cached.toMutableMap()
            var changed = false

            for (packageName in packageNames) {
                if (next.remove(packageName) != null) {
                    changed = true
                }
            }

            if (changed) {
                cachedUsageByPackage = next
            }
        }
    }
}
