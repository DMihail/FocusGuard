package com.focusguard.usage

/**
 * Tracks completed foreground sessions and still-open sessions while walking a usage event stream.
 * Used by [DailyUsageAggregator] and unit-tested without [android.app.usage.UsageStatsManager].
 *
 * Android Q+ often emits both `ACTIVITY_PAUSED` and deprecated `MOVE_TO_BACKGROUND` for the same
 * transition. Crediting a second end without an open start as an "orphan" (from day/cursor start)
 * produced multi-hour overcounts (e.g. ~16h after an app update / cold cache rebuild).
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

    /** Packages that received a start in this pass (including carried-over open sessions). */
    private val packagesWithStart =
        openSessionStartMs.keys.toMutableSet()

    /** Packages that already received an orphan end credit (at most once until the next start). */
    private val packagesWithOrphanEnd = mutableSetOf<String>()

    fun applyForegroundStart(packageName: String, timeStampMs: Long) {
        if (packageName !in packageFilter) {
            return
        }

        packagesWithStart.add(packageName)
        packagesWithOrphanEnd.remove(packageName)
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
                orphanDurationMs(packageName, timeStampMs) ?: return
            }
        completedUsageByPackage[packageName] = (completedUsageByPackage[packageName] ?: 0L) + durationMs
    }

    /**
     * Orphan ends cover sessions that began before the scan window (e.g. overnight FG closed after
     * midnight). Duplicate ends after a matched close or a prior orphan must not credit again.
     *
     * Cap guards against a lone spurious end (OEM quirk) crediting from midnight/cursor as if the
     * app had been open for many hours — dual-end overcount is handled by [packagesWithStart].
     */
    private fun orphanDurationMs(packageName: String, timeStampMs: Long): Long? {
        if (packageName in packagesWithStart || packageName in packagesWithOrphanEnd) {
            return null
        }

        packagesWithOrphanEnd.add(packageName)
        return (timeStampMs - orphanSessionStartMs).coerceIn(0L, MAX_ORPHAN_CREDIT_MS)
    }

    private companion object {
        /** ~3h ceiling for unmatched end-without-start credits. */
        private const val MAX_ORPHAN_CREDIT_MS = 3L * 60L * 60L * 1_000L
    }

    fun snapshot(): DailyUsageAggregator.EventAggregationState =
        DailyUsageAggregator.EventAggregationState(
            completedUsageByPackage.toMap(),
            openSessionStartMs.toMap(),
        )
}
