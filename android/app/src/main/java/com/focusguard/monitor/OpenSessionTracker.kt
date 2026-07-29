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
        val openSessions = mutableSetOf<String>()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            applyEvent(openSessions, event.packageName, event.eventType)
        }

        return openSessions.toSet()
    }

    internal fun openPackagesFromEvents(
        events: List<OpenSessionEvent>,
    ): Set<String> {
        val openSessions = mutableSetOf<String>()

        for (event in events) {
            applyEvent(openSessions, event.packageName, event.eventType)
        }

        return openSessions.toSet()
    }

    private fun applyEvent(
        openSessions: MutableSet<String>,
        packageName: String?,
        eventType: Int,
    ) {
        val resolvedPackage = packageName?.takeIf { it.isNotEmpty() } ?: return

        when {
            UsageEventTypes.isForegroundStart(eventType) -> {
                openSessions.add(resolvedPackage)
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
