package com.focusguard

import android.app.usage.UsageEvents
import android.app.usage.UsageEventsQuery
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import androidx.annotation.RequiresApi
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * Lightweight usage-events poll on API 35+ that wakes [TrackingEngine] when the resumed app changes.
 *
 * The main monitor loop stays as a fallback for usage metering and devices below API 35.
 */
@RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
internal class UsageEventsForegroundObserver(
    private val context: Context,
    private val onForegroundMayHaveChanged: () -> Unit,
) {

    private val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var observerJob: Job? = null

    private var lastNotifiedPackage: String? = null

    fun start() {
        if (observerJob != null) {
            return
        }

        observerJob =
            scope.launch {
                while (isActive) {
                    val resumedPackage = queryLatestResumedPackage()
                    if (resumedPackage != lastNotifiedPackage) {
                        lastNotifiedPackage = resumedPackage
                        onForegroundMayHaveChanged()
                    }
                    delay(POLL_INTERVAL_MS)
                }
            }
    }

    fun stop() {
        observerJob?.cancel()
        observerJob = null
        lastNotifiedPackage = null
    }

    private fun queryLatestResumedPackage(): String? {
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

    companion object {
        @Suppress("DEPRECATION")
        private val FOREGROUND_QUERY_EVENT_TYPES =
            intArrayOf(
                UsageEvents.Event.MOVE_TO_FOREGROUND,
                UsageEvents.Event.ACTIVITY_RESUMED,
            )

        private const val POLL_INTERVAL_MS = 750L
        private const val EVENTS_WINDOW_MS = 15_000L

        fun createIfSupported(
            context: Context,
            onForegroundMayHaveChanged: () -> Unit,
        ): UsageEventsForegroundObserver? {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.VANILLA_ICE_CREAM) {
                return null
            }

            return UsageEventsForegroundObserver(context, onForegroundMayHaveChanged)
        }
    }
}
