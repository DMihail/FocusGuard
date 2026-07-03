package com.focusguard.monitor

internal object TrackingEnginePoll {
    const val ACTIVE_MS = 1_000L
    const val IDLE_MS = 2_500L

    fun resolveIntervalMs(
        activeBlockPackage: String?,
        stableForeground: String?,
        trackedApps: Set<String>,
    ): Long =
        when {
            activeBlockPackage != null -> ACTIVE_MS
            stableForeground != null && stableForeground in trackedApps -> ACTIVE_MS
            else -> IDLE_MS
        }
}
