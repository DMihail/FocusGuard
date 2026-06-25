package com.focusguard.usage

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.os.Build

/**
 * Builds per-package foreground time for the current local calendar day.
 *
 * [UsageStatsManager.queryEvents] from local midnight is the primary source so usage includes
 * sessions that happened before Keept was installed. Aggregated stats are used only as a
 * fallback when the event stream is empty (some OEM restrictions).
 */
internal object DailyUsageAggregator {

    fun buildUsageByPackage(
        usageStatsManager: UsageStatsManager,
        dayStartMs: Long,
        endMs: Long,
    ): Map<String, Long> {
        val fromEvents = aggregateFromEvents(usageStatsManager, dayStartMs, endMs)
        val fromStats = aggregateFromUsageStats(usageStatsManager, dayStartMs, endMs)

        if (fromEvents.isEmpty()) {
            return fromStats
        }

        return (fromEvents.keys + fromStats.keys).associateWith { packageName ->
            val eventsMs = fromEvents[packageName] ?: 0L
            val statsMs = fromStats[packageName] ?: 0L

            if (eventsMs > 0L) eventsMs else statsMs
        }
    }

    fun usageForPackages(
        usageByPackage: Map<String, Long>,
        packageNames: Collection<String>,
    ): Map<String, Long> = packageNames.associateWith { packageName -> usageByPackage[packageName] ?: 0L }

    private fun aggregateFromEvents(
        usageStatsManager: UsageStatsManager,
        dayStartMs: Long,
        endMs: Long,
    ): Map<String, Long> {
        if (endMs <= dayStartMs) {
            return emptyMap()
        }

        val events = usageStatsManager.queryEvents(dayStartMs, endMs)
        val event = UsageEvents.Event()
        val usageByPackage = mutableMapOf<String, Long>()
        val openSessionStartMs = mutableMapOf<String, Long>()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            val packageName = event.packageName?.takeIf { it.isNotEmpty() } ?: continue

            when (event.eventType) {
                UsageEvents.Event.MOVE_TO_FOREGROUND -> {
                    openSessionStartMs[packageName] = event.timeStamp.coerceAtLeast(dayStartMs)
                }
                UsageEvents.Event.MOVE_TO_BACKGROUND -> {
                    val sessionStartMs = openSessionStartMs.remove(packageName)
                    val durationMs =
                        if (sessionStartMs != null) {
                            (event.timeStamp - sessionStartMs).coerceAtLeast(0L)
                        } else {
                            (event.timeStamp - dayStartMs).coerceAtLeast(0L)
                        }
                    usageByPackage[packageName] = (usageByPackage[packageName] ?: 0L) + durationMs
                }
            }
        }

        for ((packageName, sessionStartMs) in openSessionStartMs) {
            val durationMs = (endMs - sessionStartMs).coerceAtLeast(0L)
            usageByPackage[packageName] = (usageByPackage[packageName] ?: 0L) + durationMs
        }

        return usageByPackage
    }

    private fun aggregateFromUsageStats(
        usageStatsManager: UsageStatsManager,
        dayStartMs: Long,
        endMs: Long,
    ): Map<String, Long> {
        val aggregated =
            usageStatsManager.queryAndAggregateUsageStats(dayStartMs, endMs)
                .takeIf { it.isNotEmpty() }
                ?: run {
                    val stats =
                        usageStatsManager.queryUsageStats(
                            UsageStatsManager.INTERVAL_DAILY,
                            dayStartMs,
                            endMs,
                        ) ?: return emptyMap()

                    stats
                        .filter { it.packageName.isNotEmpty() }
                        .groupBy { it.packageName }
                        .mapValues { (_, packageStats) ->
                            packageStats.sumOf { stat -> stat.foregroundTimeMs() }
                        }
                }

        return aggregated.mapValues { (_, stats) -> stats.foregroundTimeMs() }
    }
}
