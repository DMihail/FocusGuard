package com.focusguard.usage

/**
 * Tracks completed foreground sessions and still-open sessions while walking a usage event stream.
 * Used by [DailyUsageAggregator] and unit-tested without [android.app.usage.UsageStatsManager].
 */
internal class UsageEventSessionAccumulator(
    private val dayStartMs: Long,
    private val packageFilter: Set<String>,
    private val orphanSessionStartMs: Long,
    initialCompleted: Map<String, Long> = emptyMap(),
    initialOpenSessions: Map<String, Long> = emptyMap(),
) {

    private val completedUsageByPackage =
        initialCompleted
            .filterKeys { packageName -> packageName in packageFilter }
            .toMutableMap()
    private val openSessionStartMs =
        initialOpenSessions
            .filterKeys { packageName -> packageName in packageFilter }
            .toMutableMap()

    fun applyForegroundStart(packageName: String, timeStampMs: Long) {
        if (packageName !in packageFilter) {
            return
        }

        openSessionStartMs[packageName] = timeStampMs.coerceAtLeast(dayStartMs)
    }

    fun applyForegroundEnd(packageName: String, timeStampMs: Long) {
        if (packageName !in packageFilter) {
            return
        }

        val sessionStartMs = openSessionStartMs.remove(packageName)
        val durationMs =
            if (sessionStartMs != null) {
                (timeStampMs - sessionStartMs).coerceAtLeast(0L)
            } else {
                (timeStampMs - orphanSessionStartMs).coerceAtLeast(0L)
            }
        completedUsageByPackage[packageName] = (completedUsageByPackage[packageName] ?: 0L) + durationMs
    }

    fun snapshot(): DailyUsageAggregator.EventAggregationState =
        DailyUsageAggregator.EventAggregationState(
            completedUsageByPackage.toMap(),
            openSessionStartMs.toMap(),
        )
}
