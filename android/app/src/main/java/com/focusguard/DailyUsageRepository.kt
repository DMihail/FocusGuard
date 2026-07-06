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
    private var completedUsageByPackage: Map<String, Long>? = null
    private var cachedDayStartMs: Long = 0L
    private var cachedAtMs: Long = 0L
    private var eventScanEndMs: Long = 0L
    private val openSessionStarts = mutableMapOf<String, Long>()

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
            val dayChanged = cachedDayStartMs != 0L && cachedDayStartMs != dayStartMs

            if (completedUsageByPackage == null || dayChanged) {
                LocalDayChangeNotifier.checkAndNotify(appContext)
                completedUsageByPackage = null
                openSessionStarts.clear()
                eventScanEndMs = dayStartMs
                cachedDayStartMs = dayStartMs
            }

            var completed = completedUsageByPackage ?: emptyMap()

            val ttlStale = completed.isNotEmpty() && nowMs - cachedAtMs >= CACHE_TTL_MS
            if (ttlStale) {
                val refreshFilter = completed.keys + packageFilter
                val refreshed =
                    DailyUsageAggregator.appendUsageDelta(
                        usageStatsManager,
                        dayStartMs,
                        eventScanEndMs,
                        nowMs,
                        refreshFilter,
                        completed,
                        openSessionStarts,
                    )
                completed = refreshed.usageByPackage
                completedUsageByPackage = completed
                openSessionStarts.clear()
                openSessionStarts.putAll(refreshed.openSessionStartMs)
                eventScanEndMs = nowMs
                cachedAtMs = nowMs
            }

            val missing = packageFilter.filter { packageName -> packageName !in completed }.toSet()
            if (missing.isNotEmpty()) {
                val freshState =
                    DailyUsageAggregator.buildUsageWithState(
                        usageStatsManager,
                        dayStartMs,
                        nowMs,
                        missing,
                    )

                completed = completed + freshState.usageByPackage
                completedUsageByPackage = completed
                openSessionStarts.putAll(freshState.openSessionStartMs)
                eventScanEndMs = nowMs
                cachedAtMs = nowMs
            }

            return DailyUsageAggregator.projectUsageAt(completed, openSessionStarts, nowMs)
        }
    }

    fun invalidateCache() {
        synchronized(cacheLock) {
            completedUsageByPackage = null
            cachedDayStartMs = 0L
            cachedAtMs = 0L
            eventScanEndMs = 0L
            openSessionStarts.clear()
        }
    }

    /** Drops cached totals for [packageNames] so the next read re-queries only those apps. */
    fun invalidatePackages(packageNames: Collection<String>) {
        if (packageNames.isEmpty()) {
            return
        }

        synchronized(cacheLock) {
            val completed = completedUsageByPackage ?: return

            val next = completed.toMutableMap()
            var changed = false

            for (packageName in packageNames) {
                if (next.remove(packageName) != null) {
                    changed = true
                }
                if (openSessionStarts.remove(packageName) != null) {
                    changed = true
                }
            }

            if (changed) {
                completedUsageByPackage = next
            }
        }
    }
}
