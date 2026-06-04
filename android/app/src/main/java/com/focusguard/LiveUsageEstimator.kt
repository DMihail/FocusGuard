package com.focusguard

/**
 * Combines persisted daily usage from [DailyUsageRepository] with the current foreground
 * session, because [android.app.usage.UsageStatsManager] often lags by several minutes.
 */
class LiveUsageEstimator(
    private val dailyUsageRepository: DailyUsageRepository,
) {

    private var sessionPackage: String? = null
    private var sessionStartedAtMs: Long = 0L
    private val baselineMsByPackage = mutableMapOf<String, Long>()

    /** Call when a tracked app becomes the stable foreground app. */
    fun onTrackedAppForeground(packageName: String) {
        if (sessionPackage == packageName) {
            return
        }

        sessionPackage = packageName
        sessionStartedAtMs = System.currentTimeMillis()
        baselineMsByPackage[packageName] = dailyUsageRepository.getTodayForegroundMs(packageName)
    }

    /** Call when the user leaves a tracked app or monitoring stops. */
    fun clearSession() {
        sessionPackage = null
        sessionStartedAtMs = 0L
    }

    /** @return estimated foreground ms for [packageName] including the active session. */
    fun getEffectiveUsageMs(packageName: String): Long {
        val persistedMs = dailyUsageRepository.getTodayForegroundMs(packageName)

        if (sessionPackage != packageName || sessionStartedAtMs <= 0L) {
            return persistedMs
        }

        val baselineMs = baselineMsByPackage[packageName] ?: persistedMs
        val sessionMs = (System.currentTimeMillis() - sessionStartedAtMs).coerceAtLeast(0L)

        return baselineMs + sessionMs
    }
}
