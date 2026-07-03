package com.focusguard

import android.app.usage.UsageEvents
import android.app.usage.UsageEventsQuery
import android.app.usage.UsageStatsManager
import android.os.Build
import androidx.annotation.RequiresApi

/** Coalesced API 35+ foreground detection shared by the monitor poll loop and wake observer. */
internal object ForegroundEventsQuery {
    @Volatile
    private var cachedAtMs = 0L

    @Volatile
    private var cachedPackage: String? = null

    @RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
    fun queryLatestResumedPackage(usageStatsManager: UsageStatsManager): String? {
        val now = System.currentTimeMillis()
        val cached = cachedPackage

        if (cached != null && now - cachedAtMs <= COALESCE_MS) {
            return cached
        }

        val detected = queryLatestResumedPackageUncached(usageStatsManager)
        cachedPackage = detected
        cachedAtMs = now
        return detected
    }

    @RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
    private fun queryLatestResumedPackageUncached(usageStatsManager: UsageStatsManager): String? {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - EVENTS_WINDOW_MS

        val query =
            UsageEventsQuery.Builder(startTime, endTime)
                .setEventTypes(*FOREGROUND_QUERY_EVENT_TYPES)
                .build()

        val events = usageStatsManager.queryEvents(query) ?: return null
        val event = UsageEvents.Event()
        var currentApp: String? = null

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            currentApp = event.packageName
        }

        return currentApp
    }

    @Suppress("DEPRECATION")
    private val FOREGROUND_QUERY_EVENT_TYPES =
        intArrayOf(
            UsageEvents.Event.MOVE_TO_FOREGROUND,
            UsageEvents.Event.ACTIVITY_RESUMED,
        )

    private val COALESCE_MS = 500L
    private val EVENTS_WINDOW_MS = 60_000L
}
