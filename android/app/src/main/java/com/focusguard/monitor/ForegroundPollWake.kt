package com.focusguard.monitor

import android.app.usage.UsageStatsManager
import android.os.Build
import androidx.annotation.RequiresApi
import com.focusguard.ForegroundEventsQuery
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlin.coroutines.coroutineContext
import kotlin.math.min

/**
 * During idle poll intervals on API 35+, slices the wait into short checks so foreground switches
 * wake the main [com.focusguard.TrackingEngine] loop early without a second coroutine scanner.
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

        delay(intervalMs)
    }

    @RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
    private suspend fun delayWithForegroundWake(
        usageStatsManager: UsageStatsManager,
        intervalMs: Long,
    ) {
        var lastResumed =
            ForegroundEventsQuery.queryLatestResumedPackage(usageStatsManager)
        val deadlineMs = System.currentTimeMillis() + intervalMs

        while (coroutineContext.isActive && System.currentTimeMillis() < deadlineMs) {
            val remainingMs = deadlineMs - System.currentTimeMillis()
            delay(min(IDLE_SLICE_MS, remainingMs).coerceAtLeast(0L))

            val resumed =
                ForegroundEventsQuery.queryLatestResumedPackage(
                    usageStatsManager,
                    bypassCoalesce = true,
                )
            if (resumed != lastResumed) {
                return
            }
        }
    }
}
