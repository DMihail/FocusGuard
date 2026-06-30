package com.focusguard.widget

import android.content.Context
import com.focusguard.AppLabelResolver
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

        data class NoTrackedApps(
            val monitoringEnabled: Boolean,
        ) : Snapshot
    }

    fun resolve(
        context: Context,
        usageOverrides: Map<String, Long>? = null,
    ): Snapshot {
        val trackedApps = TrackingConfigRepository.getTrackedApps()
        val monitoringEnabled = FocusGuardMonitorService.isRunning

        if (trackedApps.isEmpty()) {
            return Snapshot.NoTrackedApps(monitoringEnabled)
        }

        val usageRepository = DailyUsageRepository.getInstance(context)
        val packageManager = context.packageManager

        var nearest: NextBlock? = null
        var blockedLabel: String? = null

        for (packageName in trackedApps) {
            val limits = TrackingConfigRepository.getLimitConfig(packageName)
            val usedMs = usageOverrides?.get(packageName) ?: usageRepository.getTodayForegroundMs(packageName)
            val remainingMs = limits.hardBlockThresholdMs - usedMs
            val appLabel = AppLabelResolver.resolve(packageManager, packageName)

            if (remainingMs > 0L) {
                if (nearest == null || remainingMs < nearest.remainingMs) {
                    nearest = NextBlock(remainingMs, packageName, appLabel)
                }
                continue
            }

            val snoozeRemainingMs = TrackingSnoozeStore.getRemainingMs(packageName)
            if (snoozeRemainingMs > 0L) {
                if (nearest == null || snoozeRemainingMs < nearest.remainingMs) {
                    nearest = NextBlock(snoozeRemainingMs, packageName, appLabel)
                }
                continue
            }

            if (blockedLabel == null) {
                blockedLabel = appLabel
            }
        }

        return when {
            nearest != null -> Snapshot.Countdown(nearest, monitoringEnabled)
            blockedLabel != null -> Snapshot.AllBlocked(blockedLabel, monitoringEnabled)
            else -> Snapshot.AllBlocked(appLabel = null, monitoringEnabled = monitoringEnabled)
        }
    }
}
