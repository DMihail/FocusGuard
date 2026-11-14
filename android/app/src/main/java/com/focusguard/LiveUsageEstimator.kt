package com.focusguard

/**
 * Combines persisted daily usage from [DailyUsageRepository] with open foreground
 * sessions, because [android.app.usage.UsageStatsManager] often lags by several minutes.
 *
 * Supports multiple concurrent sessions (split-screen / PiP) so each open tracked package
 * accrues wall-clock independently.
 */
class LiveUsageEstimator(
    private val dailyUsageRepository: DailyUsageRepository,
) {

    private val sessionStartedAtMsByPackage = mutableMapOf<String, Long>()
    private val baselineMsByPackage = mutableMapOf<String, Long>()

    fun onTrackedAppForeground(packageName: String) {
        if (sessionStartedAtMsByPackage.containsKey(packageName)) {
            return
        }

        sessionStartedAtMsByPackage[packageName] = System.currentTimeMillis()
        val persistedMs = dailyUsageRepository.getTodayForegroundMs(packageName)
        val previousEstimate = baselineMsByPackage[packageName] ?: 0L
        baselineMsByPackage[packageName] = maxOf(previousEstimate, persistedMs)
    }

    fun isSessionActiveFor(packageName: String): Boolean =
        sessionStartedAtMsByPackage.containsKey(packageName)

    /** Starts sessions for [activePackages] and flushes any package that left the set. */
    fun syncActiveSessions(activePackages: Set<String>) {
        val inactive = sessionStartedAtMsByPackage.keys.filter { packageName -> packageName !in activePackages }
        for (packageName in inactive) {
            flushSession(packageName)
            sessionStartedAtMsByPackage.remove(packageName)
        }

        for (packageName in activePackages) {
            onTrackedAppForeground(packageName)
        }
    }

    fun clearSession() {
        flushActiveSessions()
        sessionStartedAtMsByPackage.clear()
    }

    /** Clears stale per-package baselines after a local day rollover. */
    fun clearBaselinesForNewDay() {
        flushActiveSessions()
        baselineMsByPackage.clear()
        sessionStartedAtMsByPackage.clear()
    }

    fun getEffectiveUsageMs(packageName: String): Long =
        getEffectiveUsageMsForPackages(setOf(packageName))[packageName] ?: 0L

    /** Batches one [DailyUsageRepository] read for all non-active packages. */
    fun getEffectiveUsageMsForPackages(packageNames: Set<String>): Map<String, Long> {
        if (packageNames.isEmpty()) {
            return emptyMap()
        }

        val nowMs = System.currentTimeMillis()
        val inactivePackages =
            packageNames.filter { packageName -> !sessionStartedAtMsByPackage.containsKey(packageName) }
        val persistedByPackage =
            if (inactivePackages.isEmpty()) {
                emptyMap()
            } else {
                dailyUsageRepository.getTodayForegroundMsForPackages(inactivePackages)
            }

        return packageNames.associateWith { packageName ->
            val sessionStartedAtMs = sessionStartedAtMsByPackage[packageName]
            if (sessionStartedAtMs != null && sessionStartedAtMs > 0L) {
                val baselineMs = baselineMsByPackage[packageName] ?: 0L
                val sessionMs = (nowMs - sessionStartedAtMs).coerceAtLeast(0L)
                baselineMs + sessionMs
            } else {
                val persistedMs = persistedByPackage[packageName] ?: 0L
                maxOf(persistedMs, baselineMsByPackage[packageName] ?: 0L)
            }
        }
    }

    private fun flushActiveSessions() {
        val packages = sessionStartedAtMsByPackage.keys.toList()
        for (packageName in packages) {
            flushSession(packageName)
            sessionStartedAtMsByPackage.remove(packageName)
        }
    }

    private fun flushSession(packageName: String) {
        val sessionStartedAtMs = sessionStartedAtMsByPackage[packageName] ?: return

        if (sessionStartedAtMs <= 0L) {
            return
        }

        val persistedMs = dailyUsageRepository.getTodayForegroundMs(packageName)
        val baselineMs = baselineMsByPackage[packageName] ?: persistedMs
        val sessionMs = (System.currentTimeMillis() - sessionStartedAtMs).coerceAtLeast(0L)
        baselineMsByPackage[packageName] = maxOf(baselineMs + sessionMs, persistedMs)
    }
}
