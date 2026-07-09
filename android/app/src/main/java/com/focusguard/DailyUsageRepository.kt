package com.focusguard

import android.app.usage.UsageStatsManager
import android.content.Context
import com.focusguard.usage.DailyUsageAggregator
import com.focusguard.usage.LocalDayChangeNotifier
import com.focusguard.usage.UsageStatsExtensions.startOfLocalDayMs

/**
 * Reads per-app foreground usage for the current local calendar day.
 *
 * Maintains an incremental [eventScanCursorMs] so routine reads call
 * `queryEvents(cursor+1, now)` instead of re-scanning from local midnight.
 */
class DailyUsageRepository private constructor(
    private val appContext: Context,
) {

    private val usageStatsManager =
        appContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    private val cacheLock = Any()
    private var completedUsageByPackage: Map<String, Long>? = null
    private var cachedDayStartMs: Long = 0L
    private var cachedAtMs: Long = 0L
    /** Exclusive end of the last processed `queryEvents` window; values `< dayStart` mean "not bootstrapped". */
    private var eventScanCursorMs: Long = Long.MIN_VALUE
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

        /** @internal Unit-test reset. */
        internal fun resetForTests() {
            instance?.invalidateCache()
            instance = null
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
            resetStateIfDayChanged(dayStartMs)

            var completed = completedUsageByPackage ?: emptyMap()
            val activeFilter = completed.keys + openSessionStarts.keys + packageFilter

            if (activeFilter.isNotEmpty()) {
                completed = advanceEventCursor(activeFilter, dayStartMs, nowMs, completed)
            }

            val missing = packageFilter.filter { packageName -> packageName !in completed }.toSet()
            if (missing.isNotEmpty()) {
                completed = bootstrapPackages(missing, completed, dayStartMs, nowMs)
            }

            return DailyUsageAggregator.projectUsageAt(completed, openSessionStarts, nowMs)
        }
    }

    private fun resetStateIfDayChanged(dayStartMs: Long) {
        val dayChanged = cachedDayStartMs != 0L && cachedDayStartMs != dayStartMs

        if (completedUsageByPackage == null || dayChanged) {
            LocalDayChangeNotifier.checkAndNotify(appContext)
            completedUsageByPackage = null
            openSessionStarts.clear()
            eventScanCursorMs = dayStartMs - 1L
            cachedDayStartMs = dayStartMs
        }
    }

    private fun nextScanFromMs(dayStartMs: Long): Long =
        if (eventScanCursorMs < dayStartMs) {
            dayStartMs
        } else {
            eventScanCursorMs + 1L
        }

    private fun advanceEventCursor(
        packageFilter: Set<String>,
        dayStartMs: Long,
        nowMs: Long,
        completed: Map<String, Long>,
    ): Map<String, Long> {
        val scanFromMs = nextScanFromMs(dayStartMs)
        val ttlStale = completed.isNotEmpty() && nowMs - cachedAtMs >= CACHE_TTL_MS

        if (nowMs < scanFromMs && !ttlStale) {
            return completed
        }

        val refreshed =
            DailyUsageAggregator.appendUsageDelta(
                usageStatsManager,
                dayStartMs,
                scanFromMs,
                nowMs,
                packageFilter,
                completed,
                openSessionStarts,
            )

        completedUsageByPackage = refreshed.usageByPackage
        openSessionStarts.clear()
        openSessionStarts.putAll(refreshed.openSessionStartMs)
        eventScanCursorMs = nowMs
        cachedAtMs = nowMs
        return refreshed.usageByPackage
    }

    private fun bootstrapPackages(
        missing: Set<String>,
        completed: Map<String, Long>,
        dayStartMs: Long,
        nowMs: Long,
    ): Map<String, Long> {
        val fromEvents =
            DailyUsageAggregator.appendUsageDelta(
                usageStatsManager,
                dayStartMs,
                dayStartMs,
                nowMs,
                missing,
                emptyMap(),
                emptyMap(),
            )

        val bootstrapped =
            if (fromEvents.usageByPackage.isEmpty() && fromEvents.openSessionStartMs.isEmpty()) {
                DailyUsageAggregator.buildUsageWithState(
                    usageStatsManager,
                    dayStartMs,
                    nowMs,
                    missing,
                )
            } else {
                fromEvents
            }

        val merged = completed + bootstrapped.usageByPackage
        completedUsageByPackage = merged
        openSessionStarts.putAll(bootstrapped.openSessionStartMs)
        eventScanCursorMs = maxOf(eventScanCursorMs, nowMs)
        cachedAtMs = nowMs
        return merged
    }

    fun invalidateCache() {
        synchronized(cacheLock) {
            completedUsageByPackage = null
            cachedDayStartMs = 0L
            cachedAtMs = 0L
            eventScanCursorMs = Long.MIN_VALUE
            openSessionStarts.clear()
        }
    }

    /**
     * Advances the event cursor for [packageNames] so the next read reflects the latest
     * `queryEvents` window without dropping cached totals for other packages.
     */
    fun invalidatePackages(packageNames: Collection<String>) {
        if (packageNames.isEmpty()) {
            return
        }

        synchronized(cacheLock) {
            val dayStartMs = startOfLocalDayMs()
            val nowMs = System.currentTimeMillis()
            resetStateIfDayChanged(dayStartMs)

            val completed = completedUsageByPackage ?: return
            val refreshFilter = completed.keys + openSessionStarts.keys + packageNames
            advanceEventCursor(refreshFilter, dayStartMs, nowMs, completed)
        }
    }
}
