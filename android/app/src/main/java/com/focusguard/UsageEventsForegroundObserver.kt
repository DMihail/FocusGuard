package com.focusguard

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
 * Supplemental wake on API 35+ when the main poll loop is idle (2.5s).
 *
 * Does not poll while [TrackingEngine] is already on the active 1s interval — the main loop
 * is sufficient and shares coalesced [ForegroundEventsQuery] reads with [ForegroundAppDetector].
 */
@RequiresApi(Build.VERSION_CODES.VANILLA_ICE_CREAM)
internal class UsageEventsForegroundObserver(
    private val usageStatsManager: UsageStatsManager,
    private val onForegroundMayHaveChanged: () -> Unit,
) {

    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var observerJob: Job? = null

    private var lastNotifiedPackage: String? = null

    @Volatile
    private var supplementalPollingEnabled: Boolean = true

    /** When false, the observer sleeps without querying UsageEvents (active poll loop handles detection). */
    fun setSupplementalPollingEnabled(enabled: Boolean) {
        supplementalPollingEnabled = enabled
    }

    fun start() {
        if (observerJob != null) {
            return
        }

        observerJob =
            scope.launch {
                while (isActive) {
                    if (supplementalPollingEnabled) {
                        val resumedPackage =
                            ForegroundEventsQuery.queryLatestResumedPackage(usageStatsManager)
                        if (resumedPackage != lastNotifiedPackage) {
                            lastNotifiedPackage = resumedPackage
                            onForegroundMayHaveChanged()
                        }
                    }
                    delay(WAKE_POLL_INTERVAL_MS)
                }
            }
    }

    fun stop() {
        observerJob?.cancel()
        observerJob = null
        lastNotifiedPackage = null
        supplementalPollingEnabled = true
    }

    companion object {
        /** Matches [com.focusguard.monitor.TrackingEnginePoll.IDLE_MS]. */
        private const val WAKE_POLL_INTERVAL_MS = 2_500L

        fun createIfSupported(
            context: Context,
            onForegroundMayHaveChanged: () -> Unit,
        ): UsageEventsForegroundObserver? {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.VANILLA_ICE_CREAM) {
                return null
            }

            val usageStatsManager =
                context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            return UsageEventsForegroundObserver(usageStatsManager, onForegroundMayHaveChanged)
        }
    }
}
