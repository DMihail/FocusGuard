package com.focusguard.widget

import android.content.Context
import android.content.pm.PackageManager
import com.focusguard.DailyUsageRepository
import com.focusguard.TrackingConfigRepository
import com.focusguard.overlay.TrackingSnoozeStore
import com.focusguard.service.FocusGuardMonitorService

/** Builds home-screen widget state from the same limits and usage sources as [com.focusguard.TrackingEngine]. */
internal object WidgetNextBlockResolver {

    data class NextBlock(
        val remainingMs: Long,
        val packageName: String,
        val appLabel: String,
    )

    sealed interface Snapshot {
        data class Countdown(
            val next: NextBlock,
            val monitoringEnabled: Boolean,
        ) : Snapshot

        data class AllBlocked(
            val appLabel: String?,
            val monitoringEnabled: Boolean,
        ) : Snapshot

        data object NoTrackedApps : Snapshot
    }

    fun resolve(
        context: Context,
        usageOverrides: Map<String, Long>? = null,
    ): Snapshot {
        val trackedApps = TrackingConfigRepository.getTrackedApps()
        if (trackedApps.isEmpty()) {
            return Snapshot.NoTrackedApps
        }

        val monitoringEnabled = FocusGuardMonitorService.isRunning
        val usageRepository = DailyUsageRepository.getInstance(context)
        val packageManager = context.packageManager

        var nearest: NextBlock? = null
        var blockedLabel: String? = null

        for (packageName in trackedApps) {
            val limits = TrackingConfigRepository.getLimitConfig(packageName)
            val usedMs = usageOverrides?.get(packageName) ?: usageRepository.getTodayForegroundMs(packageName)
            val remainingMs = limits.hardBlockThresholdMs - usedMs
            val appLabel = resolveAppLabel(packageManager, packageName)

            if (remainingMs > 0L) {
                if (nearest == null || remainingMs < nearest.remainingMs) {
                    nearest = NextBlock(remainingMs, packageName, appLabel)
                }
                continue
            }

            if (!TrackingSnoozeStore.isSnoozed(packageName) && blockedLabel == null) {
                blockedLabel = appLabel
            }
        }

        return when {
            nearest != null -> Snapshot.Countdown(nearest, monitoringEnabled)
            blockedLabel != null -> Snapshot.AllBlocked(blockedLabel, monitoringEnabled)
            else -> Snapshot.AllBlocked(appLabel = null, monitoringEnabled = monitoringEnabled)
        }
    }

    private fun resolveAppLabel(packageManager: PackageManager, packageName: String): String =
        try {
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(appInfo).toString()
        } catch (_: PackageManager.NameNotFoundException) {
            packageName
        }
}
