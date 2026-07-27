package com.focusguard

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.os.Build
import androidx.annotation.RequiresApi
import com.focusguard.usage.UsageEventTypes
import com.focusguard.monitor.OpenSessionTracker

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
 * While the user stays inside one app, a short-lived sticky cache avoids
 * expensive `queryEvents` scans on every monitor poll.
 *
 * Requires the `PACKAGE_USAGE_STATS` permission (Usage Stats access).
 */
class ForegroundAppDetector(
    private val context: Context
) {

    private val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    private var stickyForeground: String? = null
    private var stickyForegroundAt = 0L
    private var statsFallbackPollCounter = 0

    /** When true, skips sticky caches and queries UsageEvents every poll (used during active blocks). */
    @Volatile
    var aggressivePolling: Boolean = false

    /** Packages with an open foreground session (split-screen, PiP, multi-window). */
    fun getOpenForegroundPackages(): Set<String> =
        OpenSessionTracker.scanOpenPackages(usageStatsManager)

    /**
     * Returns the package name of the app that most recently moved to the foreground,
     * or `null` if detection fails and no recent sticky value is available.
     */
    fun getForegroundApp(): String? = queryLatestResumedPackage(useStickyCache = !aggressivePolling)

    private fun queryLatestResumedPackage(useStickyCache: Boolean): String? {
        val now = System.currentTimeMillis()
        val cached = stickyForeground

        if (useStickyCache && cached != null && now - stickyForegroundAt <= STICKY_QUERY_SKIP_MS) {
            return cached
        }

        val detected =
            getForegroundAppFromEvents(bypassCoalesce = !useStickyCache) ?:
                getForegroundAppFromStatsThrottled(force = !useStickyCache)
        if (detected != null) {
            stickyForeground = detected
            stickyForegroundAt = now
            return detected
        }

        if (useStickyCache && cached != null && now - stickyForegroundAt <= STICKY_FOREGROUND_MS) {
            return cached
        }

        return null
    }

    private fun getForegroundAppFromEvents(bypassCoalesce: Boolean): String? {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
            return getForegroundAppFromEventsQuery(bypassCoalesce)
        }

        return getForegroundAppFromLegacyEvents()
    }

    @RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
    private fun getForegroundAppFromEventsQuery(bypassCoalesce: Boolean): String? {
        return ForegroundEventsQuery.queryLatestResumedPackage(usageStatsManager, bypassCoalesce)
    }

    private fun getForegroundAppFromLegacyEvents(): String? {
        val endTime = System.currentTimeMillis()
        val startTime = endTime - EVENTS_WINDOW_MS

        val events = usageStatsManager.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()
        var currentApp: String? = null

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            if (UsageEventTypes.isForegroundStart(event.eventType)) {
                currentApp = event.packageName
            }
        }

        return currentApp
    }

    /**
     * Fallback: queries aggregated usage stats and returns the package
     * whose `lastTimeUsed` is closest to now (within [STATS_RECENCY_MS]).
     */
    private fun getForegroundAppFromStatsThrottled(force: Boolean = false): String? {
        if (!force) {
            statsFallbackPollCounter += 1

            if (statsFallbackPollCounter % STATS_FALLBACK_EVERY_N_POLLS != 0) {
                return null
            }
        }

        return getForegroundAppFromStats()
    }

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

    companion object {
        private const val EVENTS_WINDOW_MS = 60_000L
        private const val STATS_WINDOW_MS = 60_000L
        private const val STATS_RECENCY_MS = 30_000L
        private const val STICKY_FOREGROUND_MS = 90_000L
        private const val STICKY_QUERY_SKIP_MS = 5_000L
        private const val STATS_FALLBACK_EVERY_N_POLLS = 3
    }
}
