package com.focusguard.monitor

import android.app.usage.UsageStatsManager
import android.os.Build
import androidx.annotation.RequiresApi
import com.focusguard.ForegroundEventsQuery
import com.focusguard.accessibility.ForegroundAccessibilityBridge
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlin.coroutines.coroutineContext
import kotlin.math.min

/**
 * During idle poll intervals on API 35+, slices the wait into short checks so foreground switches
 * wake the main [com.focusguard.TrackingEngine] loop early without a second coroutine scanner.
 *
 * When [com.focusguard.accessibility.FocusGuardAccessibilityService] is enabled, window-change events
 * can also wake idle waits on any API level.
 */
internal object ForegroundPollWake {
    private const val IDLE_SLICE_MS = 500L

    suspend fun delayUntilNextPoll(
        usageStatsManager: UsageStatsManager?,
        intervalMs: Long,
    ) {
        if (intervalMs != TrackingEnginePoll.IDLE_MS) {
            delay(intervalMs)
            return
        }

        if (
            usageStatsManager != null &&
            Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM
        ) {
            delayWithForegroundWake(usageStatsManager, intervalMs)
            return
        }

        if (ForegroundAccessibilityBridge.isActive()) {
            delayWithAccessibilityWake(intervalMs)
            return
        }

        delay(intervalMs)
    }

    @RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
    private suspend fun delayWithForegroundWake(
        usageStatsManager: UsageStatsManager,
        intervalMs: Long,
    ) {
        var accessibilityWake = false
        val unregisterAccessibility =
            if (ForegroundAccessibilityBridge.isActive()) {
                ForegroundAccessibilityBridge.registerWakeListener { accessibilityWake = true }
            } else {
                {}
            }

        try {
            var lastResumed =
                ForegroundEventsQuery.queryLatestResumedPackage(usageStatsManager)
            val deadlineMs = System.currentTimeMillis() + intervalMs

            while (coroutineContext.isActive && System.currentTimeMillis() < deadlineMs) {
                if (accessibilityWake) {
                    return
                }

                val remainingMs = deadlineMs - System.currentTimeMillis()
                delay(min(IDLE_SLICE_MS, remainingMs).coerceAtLeast(0L))

                if (accessibilityWake) {
                    return
                }

                val resumed =
                    ForegroundEventsQuery.queryLatestResumedPackage(
                        usageStatsManager,
                        bypassCoalesce = true,
                    )
                if (resumed != lastResumed) {
                    return
                }
            }
        } finally {
            unregisterAccessibility()
        }
    }

    private suspend fun delayWithAccessibilityWake(intervalMs: Long) {
        var wakeRequested = false
        val unregister =
            ForegroundAccessibilityBridge.registerWakeListener { wakeRequested = true }

        try {
            val deadlineMs = System.currentTimeMillis() + intervalMs

            while (coroutineContext.isActive && System.currentTimeMillis() < deadlineMs) {
                if (wakeRequested) {
                    return
                }

                val remainingMs = deadlineMs - System.currentTimeMillis()
                delay(min(IDLE_SLICE_MS, remainingMs).coerceAtLeast(0L))
            }
        } finally {
            unregister()
        }
    }
}
