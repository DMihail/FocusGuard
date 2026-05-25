package com.focusguard

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build

/**
 * Determines which application is currently in the foreground.
 *
 * Primary strategy: [UsageStatsManager.queryEvents] looking for
 * `ACTIVITY_RESUMED` / `MOVE_TO_FOREGROUND` events.
 *
 * Fallback strategy (used when `queryEvents` returns nothing):
 * [UsageStatsManager.queryUsageStats] — picks the package with the most
 * recent `lastTimeUsed` timestamp. Less precise but works on devices/OEMs
 * that restrict event-level access from foreground services.
 *
 * Requires the `PACKAGE_USAGE_STATS` permission (Usage Stats access).
 */
class ForegroundAppDetector(
    private val context: Context
) {

    private val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    /**
     * Returns the package name of the app that most recently moved to the foreground,
     * or `null` if detection fails.
     */
    fun getForegroundApp(): String? =
        getForegroundAppFromEvents() ?: getForegroundAppFromStats()

    private fun getForegroundAppFromEvents(): String? {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - EVENTS_WINDOW_MS

        val events = usageStatsManager.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()
        var currentApp: String? = null

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (isForegroundEvent(event.eventType)) {
                currentApp = event.packageName
            }
        }

        return currentApp
    }

    /**
     * Fallback: queries aggregated usage stats and returns the package
     * whose `lastTimeUsed` is closest to now (within [STATS_RECENCY_MS]).
     */
    private fun getForegroundAppFromStats(): String? {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - STATS_WINDOW_MS

        val stats = usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_BEST, startTime, endTime
        ) ?: return null

        val ownPackage = context.packageName
        val recent = stats
            .filter { it.packageName != ownPackage && it.lastTimeUsed > 0 }
            .maxByOrNull { it.lastTimeUsed }
            ?: return null

        if (endTime - recent.lastTimeUsed > STATS_RECENCY_MS) return null

        return recent.packageName
    }

    @Suppress("DEPRECATION")
    private fun isForegroundEvent(eventType: Int): Boolean =
        eventType == UsageEvents.Event.MOVE_TO_FOREGROUND ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
                eventType == UsageEvents.Event.ACTIVITY_RESUMED)

    companion object {
        private const val EVENTS_WINDOW_MS = 120_000L
        private const val STATS_WINDOW_MS = 60_000L
        private const val STATS_RECENCY_MS = 5_000L
    }
}
