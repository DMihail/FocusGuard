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
 * A sticky set survives quiet periods with no new events inside [WINDOW_MS]. Sticky entries
 * clear on an end event, [clear], day rollover, or after [STICKY_RETAIN_MS] without a confirming
 * start in a later window (missed pause safety valve).
 */
internal object OpenSessionTracker {
    private const val WINDOW_MS = 60_000L
    /** Drop sticky opens that never re-confirm after this long (missed ACTIVITY_PAUSED). */
    internal const val STICKY_RETAIN_MS = 30L * 60L * 1_000L

    private val lock = Any()
    private val stickyOpenAtMs = mutableMapOf<String, Long>()

    fun clear() {
        synchronized(lock) {
            stickyOpenAtMs.clear()
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

        return mergeSticky(openInWindow, endedInWindow, nowMs)
    }

    internal fun openPackagesFromEvents(
        events: List<OpenSessionEvent>,
        nowMs: Long = System.currentTimeMillis(),
    ): Set<String> {
        val openInWindow = mutableSetOf<String>()
        val endedInWindow = mutableSetOf<String>()

        for (event in events) {
            applyEvent(openInWindow, endedInWindow, event.packageName, event.eventType)
        }

        return mergeSticky(openInWindow, endedInWindow, nowMs)
    }

    private fun mergeSticky(
        openInWindow: Set<String>,
        endedInWindow: Set<String>,
        nowMs: Long,
    ): Set<String> =
        synchronized(lock) {
            for (packageName in endedInWindow) {
                stickyOpenAtMs.remove(packageName)
            }
            for (packageName in openInWindow) {
                stickyOpenAtMs[packageName] = nowMs
            }

            val expired =
                stickyOpenAtMs
                    .filter { (packageName, confirmedAtMs) ->
                        packageName !in openInWindow && nowMs - confirmedAtMs > STICKY_RETAIN_MS
                    }
                    .keys
            for (packageName in expired) {
                stickyOpenAtMs.remove(packageName)
            }

            stickyOpenAtMs.keys.toSet()
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
