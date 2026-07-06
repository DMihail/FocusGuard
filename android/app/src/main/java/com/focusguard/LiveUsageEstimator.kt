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

    fun onTrackedAppForeground(packageName: String) {
        if (sessionPackage == packageName) {
            return
        }

        flushActiveSession()
        sessionPackage = packageName
        sessionStartedAtMs = System.currentTimeMillis()
        val persistedMs = dailyUsageRepository.getTodayForegroundMs(packageName)
        val previousEstimate = baselineMsByPackage[packageName] ?: 0L
        baselineMsByPackage[packageName] = maxOf(previousEstimate, persistedMs)
    }

    fun clearSession() {
        flushActiveSession()
        sessionPackage = null
        sessionStartedAtMs = 0L
    }

    fun getEffectiveUsageMs(packageName: String): Long =
        getEffectiveUsageMsForPackages(setOf(packageName))[packageName] ?: 0L

    /** Batches one [DailyUsageRepository] read for all non-active packages. */
    fun getEffectiveUsageMsForPackages(packageNames: Set<String>): Map<String, Long> {
        if (packageNames.isEmpty()) {
            return emptyMap()
        }

        val activePackage = sessionPackage
        val inactivePackages = packageNames.filter { packageName -> packageName != activePackage }
        val persistedByPackage =
            if (inactivePackages.isEmpty()) {
                emptyMap()
            } else {
                dailyUsageRepository.getTodayForegroundMsForPackages(inactivePackages)
            }

        return packageNames.associateWith { packageName ->
            if (packageName == activePackage && sessionStartedAtMs > 0L) {
                val baselineMs = baselineMsByPackage[packageName] ?: 0L
                val sessionMs = (System.currentTimeMillis() - sessionStartedAtMs).coerceAtLeast(0L)
                baselineMs + sessionMs
            } else {
                val persistedMs = persistedByPackage[packageName] ?: 0L
                maxOf(persistedMs, baselineMsByPackage[packageName] ?: 0L)
            }
        }
    }

    private fun flushActiveSession() {
        val activePackage = sessionPackage ?: return

        if (sessionStartedAtMs <= 0L) {
            return
        }

        val persistedMs = dailyUsageRepository.getTodayForegroundMs(activePackage)
        val baselineMs = baselineMsByPackage[activePackage] ?: persistedMs
        val sessionMs = (System.currentTimeMillis() - sessionStartedAtMs).coerceAtLeast(0L)
        baselineMsByPackage[activePackage] = maxOf(baselineMs + sessionMs, persistedMs)
        sessionStartedAtMs = 0L
    }
}
