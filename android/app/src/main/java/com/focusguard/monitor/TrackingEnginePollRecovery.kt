package com.focusguard.monitor

internal object TrackingEnginePollRecovery {
    const val MAX_CONSECUTIVE_FAILURES = 5
    const val BACKOFF_MS = 2_500L

    fun shouldStopService(consecutiveFailures: Int): Boolean =
        consecutiveFailures >= MAX_CONSECUTIVE_FAILURES
}
