package com.focusguard.monitor

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import com.focusguard.usage.UsageEventTypes

/**
 * Derives packages with an open foreground session from UsageEvents start/end pairing.
 *
 * Unlike "last resumed" heuristics, this keeps tracked apps visible in split-screen and PiP
 * until they receive ACTIVITY_PAUSED / MOVE_TO_BACKGROUND.
 *
 * A sticky set survives quiet periods with no new events inside [WINDOW_MS] (common while the
 * user stays inside one app). Sticky entries clear on an end event, [clear], or day rollover.
 */
internal object OpenSessionTracker {
    private const val WINDOW_MS = 60_000L

    private val lock = Any()
    private val stickyOpenPackages = mutableSetOf<String>()

    fun clear() {
        synchronized(lock) {
            stickyOpenPackages.clear()
        }
    }

    fun scanOpenPackages(
        usageStatsManager: UsageStatsManager,
        nowMs: Long = System.currentTimeMillis(),
    ): Set<String> {
        val startTime = nowMs - WINDOW_MS
        val events = usageStatsManager.queryEvents(startTime, nowMs)
        val event = UsageEvents.Event()
        val openInWindow = mutableSetOf<String>()
        val endedInWindow = mutableSetOf<String>()

        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            applyEvent(openInWindow, endedInWindow, event.packageName, event.eventType)
        }

        return mergeSticky(openInWindow, endedInWindow)
    }

    internal fun openPackagesFromEvents(
        events: List<OpenSessionEvent>,
    ): Set<String> {
        val openInWindow = mutableSetOf<String>()
        val endedInWindow = mutableSetOf<String>()

        for (event in events) {
            applyEvent(openInWindow, endedInWindow, event.packageName, event.eventType)
        }

        return mergeSticky(openInWindow, endedInWindow)
    }

    private fun mergeSticky(
        openInWindow: Set<String>,
        endedInWindow: Set<String>,
    ): Set<String> =
        synchronized(lock) {
            stickyOpenPackages.removeAll(endedInWindow)
            stickyOpenPackages.addAll(openInWindow)
            stickyOpenPackages.toSet()
        }

    private fun applyEvent(
        openInWindow: MutableSet<String>,
        endedInWindow: MutableSet<String>,
        packageName: String?,
        eventType: Int,
    ) {
        val resolvedPackage = packageName?.takeIf { it.isNotEmpty() } ?: return

        when {
            UsageEventTypes.isForegroundStart(eventType) -> {
                openInWindow.add(resolvedPackage)
                endedInWindow.remove(resolvedPackage)
            }
            UsageEventTypes.isForegroundEnd(eventType) -> {
                openInWindow.remove(resolvedPackage)
                endedInWindow.add(resolvedPackage)
            }
        }
    }
}

internal data class OpenSessionEvent(
    val packageName: String,
    val eventType: Int,
)
