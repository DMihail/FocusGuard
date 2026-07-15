package com.focusguard.monitor

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.os.Build

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
            isForegroundStartEvent(eventType) -> {
                openSessions[resolvedPackage] = 0L
            }
            isForegroundEndEvent(eventType) -> {
                openSessions.remove(resolvedPackage)
            }
        }
    }

    @Suppress("DEPRECATION")
    private fun isForegroundStartEvent(eventType: Int): Boolean =
        eventType == UsageEvents.Event.MOVE_TO_FOREGROUND ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
                eventType == UsageEvents.Event.ACTIVITY_RESUMED)

    @Suppress("DEPRECATION")
    private fun isForegroundEndEvent(eventType: Int): Boolean =
        eventType == UsageEvents.Event.MOVE_TO_BACKGROUND ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
                eventType == UsageEvents.Event.ACTIVITY_PAUSED)
}

internal data class OpenSessionEvent(
    val packageName: String,
    val eventType: Int,
)
