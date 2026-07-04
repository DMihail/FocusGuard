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
 * Lightweight usage-events poll on API 35+ that wakes [TrackingEngine] when the resumed app changes.
 *
 * Shares coalesced [ForegroundEventsQuery] reads with [ForegroundAppDetector] so the observer and
 * main poll loop do not both scan UsageEvents on every tick.
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
                    val resumedPackage =
                        ForegroundEventsQuery.queryLatestResumedPackage(usageStatsManager)
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

    companion object {
        private const val POLL_INTERVAL_MS = 1_500L

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
