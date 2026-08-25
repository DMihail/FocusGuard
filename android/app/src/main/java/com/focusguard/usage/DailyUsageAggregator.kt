package com.focusguard.usage

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.os.Build

import com.focusguard.usage.UsageStatsExtensions.foregroundTimeMs

/**
 * Builds per-package foreground time for the current local calendar day.
 *
 * [UsageStatsManager.queryEvents] from local midnight is the primary source so usage includes
 * sessions that happened before Keept was installed. Aggregated stats are used only as a
 * fallback when the event stream is empty (some OEM restrictions).
 *
 * Incremental reads append only `[scanFromMs, endMs]` onto a persisted cursor instead of
 * re-scanning the full day on every cache miss or TTL refresh.
 */
internal object DailyUsageAggregator {

    internal data class EventAggregationState(
        val usageByPackage: Map<String, Long>,
        val openSessionStartMs: Map<String, Long>,
    )

    fun buildUsageWithState(
        usageStatsManager: UsageStatsManager,
        dayStartMs: Long,
        endMs: Long,
        packageFilter: Set<String>,
    ): EventAggregationState {
        if (packageFilter.isEmpty()) {
            return EventAggregationState(emptyMap(), emptyMap())
        }

        val fromEvents = aggregateFromEventsWithState(usageStatsManager, dayStartMs, endMs, packageFilter)
        val fromStats = aggregateFromUsageStats(usageStatsManager, dayStartMs, endMs, packageFilter)

        if (fromEvents.usageByPackage.isEmpty() && fromEvents.openSessionStartMs.isEmpty()) {
            return EventAggregationState(fromStats, emptyMap())
        }

        return EventAggregationState(
            completedUsagePreferringEvents(
                packageFilter = packageFilter,
                eventsCompleted = fromEvents.usageByPackage,
                openSessions = fromEvents.openSessionStartMs,
                fromStats = fromStats,
            ),
            fromEvents.openSessionStartMs,
        )
    }

    /**
     * Stats fallback only for packages with **no** event evidence. Packages with an open session
     * (completed ms may still be 0) must not mix in stats — [projectUsageAt] already adds the open
     * duration and stacking both overcounts.
     */
    internal fun completedUsagePreferringEvents(
        packageFilter: Set<String>,
        eventsCompleted: Map<String, Long>,
        openSessions: Map<String, Long>,
        fromStats: Map<String, Long>,
    ): Map<String, Long> =
        packageFilter.associateWith { packageName ->
            val eventsMs = eventsCompleted[packageName] ?: 0L
            val hasEventEvidence = eventsMs > 0L || packageName in openSessions

            if (hasEventEvidence) {
                eventsMs
            } else {
                fromStats[packageName] ?: 0L
            }
        }

    /** Appends usage from `[scanFromMs, endMs]` onto [priorUsage] without re-reading the full day. */
    fun appendUsageDelta(
        usageStatsManager: UsageStatsManager,
        dayStartMs: Long,
        scanFromMs: Long,
        endMs: Long,
        packageFilter: Set<String>,
        priorUsage: Map<String, Long>,
        priorOpenSessions: Map<String, Long>,
    ): EventAggregationState {
        if (packageFilter.isEmpty() || endMs < scanFromMs) {
            return EventAggregationState(
                priorUsage.filterKeys { packageName -> packageName in packageFilter },
                priorOpenSessions.filterKeys { packageName -> packageName in packageFilter },
            )
        }

        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = packageFilter,
                initialCompleted = priorUsage,
                initialOpenSessions = priorOpenSessions,
            )

        applyEventsInRange(
            usageStatsManager = usageStatsManager,
            rangeStartMs = scanFromMs,
            rangeEndMs = endMs,
            dayStartMs = dayStartMs,
            accumulator = accumulator,
        )

        return accumulator.snapshot()
    }

    fun projectUsageAt(
        completedUsageByPackage: Map<String, Long>,
        openSessionStartMs: Map<String, Long>,
        endMs: Long,
    ): Map<String, Long> {
        if (openSessionStartMs.isEmpty()) {
            return completedUsageByPackage
        }

        val projected = completedUsageByPackage.toMutableMap()
        for ((packageName, sessionStartMs) in openSessionStartMs) {
            val openDurationMs = (endMs - sessionStartMs).coerceAtLeast(0L)
            projected[packageName] = (projected[packageName] ?: 0L) + openDurationMs
        }
        return projected
    }

    fun usageForPackages(
        usageByPackage: Map<String, Long>,
        packageNames: Collection<String>,
    ): Map<String, Long> = packageNames.associateWith { packageName -> usageByPackage[packageName] ?: 0L }

    private fun aggregateFromEventsWithState(
        usageStatsManager: UsageStatsManager,
        dayStartMs: Long,
        endMs: Long,
        packageFilter: Set<String>,
    ): EventAggregationState {
        if (endMs < dayStartMs) {
            return EventAggregationState(emptyMap(), emptyMap())
        }

        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = packageFilter,
            )

        applyEventsInRange(
            usageStatsManager = usageStatsManager,
            rangeStartMs = dayStartMs,
            rangeEndMs = endMs,
            dayStartMs = dayStartMs,
            accumulator = accumulator,
        )

        return accumulator.snapshot()
    }

    private fun applyEventsInRange(
        usageStatsManager: UsageStatsManager,
        rangeStartMs: Long,
        rangeEndMs: Long,
        dayStartMs: Long,
        accumulator: UsageEventSessionAccumulator,
    ) {
        val events = usageStatsManager.queryEvents(rangeStartMs, rangeEndMs)
        val event = UsageEvents.Event()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            val packageName = event.packageName?.takeIf { it.isNotEmpty() } ?: continue

            when {
                UsageEventTypes.isForegroundStart(event.eventType) -> {
                    accumulator.applyForegroundStart(packageName, event.timeStamp)
                }
                UsageEventTypes.isForegroundEnd(event.eventType) -> {
                    accumulator.applyForegroundEnd(packageName, event.timeStamp)
                }
            }
        }
    }

    private fun aggregateFromUsageStats(
        usageStatsManager: UsageStatsManager,
        dayStartMs: Long,
        endMs: Long,
        packageFilter: Set<String>,
    ): Map<String, Long> {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            val aggregatedStats = usageStatsManager.queryAndAggregateUsageStats(dayStartMs, endMs)
            if (aggregatedStats.isNotEmpty()) {
                return aggregatedStats
                    .filterKeys { packageName -> packageName in packageFilter }
                    .mapValues { (_, stats) -> stats.foregroundTimeMs() }
            }
        }

        val stats =
            usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                dayStartMs,
                endMs,
            ) ?: return emptyMap()

        return stats
            .asSequence()
            .filter { stat -> stat.packageName.isNotEmpty() && stat.packageName in packageFilter }
            .groupBy { it.packageName }
            .mapValues { (_, packageStats) ->
                packageStats.sumOf { stat -> stat.foregroundTimeMs() }
            }
    }
}
