package com.focusguard.monitor

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import com.focusguard.usage.UsageEventTypes

/**
 * Derives packages with an open foreground session from UsageEvents start/end pairing.
 *
 * Unlike "last resumed" heuristics, this keeps tracked apps visible in split-screen and PiP
 * until they receive ACTIVITY_PAUSED / MOVE_TO_BACKGROUND.
 */
internal object OpenSessionTracker {
    private const val WINDOW_MS = 60_000L

    fun scanOpenPackages(
        usageStatsManager: UsageStatsManager,
        nowMs: Long = System.currentTimeMillis(),
    ): Set<String> {
        val startTime = nowMs - WINDOW_MS
        val events = usageStatsManager.queryEvents(startTime, nowMs)
        val event = UsageEvents.Event()
        val openSessions = mutableMapOf<String, Long>()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            applyEvent(openSessions, event.packageName, event.eventType)
        }

        return openSessions.keys.toSet()
    }

    internal fun openPackagesFromEvents(
        events: List<OpenSessionEvent>,
    ): Set<String> {
        val openSessions = mutableMapOf<String, Long>()

        for (event in events) {
            applyEvent(openSessions, event.packageName, event.eventType)
        }

        return openSessions.keys.toSet()
    }

    private fun applyEvent(
        openSessions: MutableMap<String, Long>,
        packageName: String?,
        eventType: Int,
    ) {
        val resolvedPackage = packageName?.takeIf { it.isNotEmpty() } ?: return

        when {
            UsageEventTypes.isForegroundStart(eventType) -> {
                openSessions[resolvedPackage] = 0L
            }
            UsageEventTypes.isForegroundEnd(eventType) -> {
                openSessions.remove(resolvedPackage)
            }
        }
    }
}

internal data class OpenSessionEvent(
    val packageName: String,
    val eventType: Int,
)
