package com.focusguard.widget

import android.content.Context
import com.focusguard.AppLabelResolver
import com.focusguard.DailyUsageRepository
import com.focusguard.NextBlockResolver
import com.focusguard.TrackingConfigRepository
import com.focusguard.monitor.MonitoringStateRepository

/** Builds home-screen widget state from [NextBlockResolver] and native usage sources. */
internal object WidgetNextBlockResolver {

    sealed interface Snapshot {
        data class Countdown(
            val next: NextBlockResolver.NextBlock,
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
        val monitoringEnabled = MonitoringStateRepository.isMonitoringEnabled()

        if (trackedApps.isEmpty()) {
            return Snapshot.NoTrackedApps(monitoringEnabled)
        }

        val usageRepository = DailyUsageRepository.getInstance(context)
        val packageManager = context.packageManager
        val trackedAppList = trackedApps.toList()
        val persistedUsageByPackage =
            if (trackedAppList.isEmpty()) {
                emptyMap()
            } else {
                usageRepository.getTodayForegroundMsForPackages(trackedAppList)
            }

        val (nearest, blockedLabel) =
            NextBlockResolver.findNearestNextBlock(
                trackedAppList,
                usedMsFor = { packageName ->
                    usageOverrides?.get(packageName) ?: persistedUsageByPackage[packageName] ?: 0L
                },
                labelFor = { packageName ->
                    AppLabelResolver.resolve(packageManager, packageName)
                },
            )

        return when {
            nearest != null -> Snapshot.Countdown(nearest, monitoringEnabled)
            blockedLabel != null -> Snapshot.AllBlocked(blockedLabel, monitoringEnabled)
            else -> Snapshot.AllBlocked(appLabel = null, monitoringEnabled = monitoringEnabled)
        }
    }
}
