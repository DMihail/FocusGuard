package com.focusguard

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context

/**
 * Determines which application is currently in the foreground by querying
 * [UsageStatsManager] for recent `MOVE_TO_FOREGROUND` events.
 *
 * Uses a [QUERY_WINDOW_MS] window (2 minutes) to ensure the original
 * foreground event is still captured even if the user hasn't switched apps
 * for a while. Only the **last** `MOVE_TO_FOREGROUND` event is returned.
 *
 * Requires the `PACKAGE_USAGE_STATS` permission (Usage Stats access).
 */
class ForegroundAppDetector(
    private val context: Context
) {

    /**
     * Returns the package name of the app that most recently moved to the foreground
     * within [QUERY_WINDOW_MS], or `null` if no such event exists.
     */
    fun getForegroundApp(): String? {
        val usageStatsManager =
            context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

        val endTime = System.currentTimeMillis()
        val startTime = endTime - QUERY_WINDOW_MS

        val events = usageStatsManager.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()
        var currentApp: String? = null

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                currentApp = event.packageName
            }
        }

        return currentApp
    }

    companion object {
        private const val QUERY_WINDOW_MS = 120_000L
    }
}
