package com.focusguard

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.focusguard.crashlytics.NativeErrorReporter
import com.focusguard.monitor.ForegroundStabilizer
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.MonitoringStateRepository
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.monitor.TrackedUsageChangeEmitter
import com.focusguard.monitor.TrackingEnginePoll
import com.focusguard.navigation.DeepLinks
import com.focusguard.notification.KeeptNotifications
import com.focusguard.overlay.BlockOverlayManager
import com.focusguard.overlay.DailyWarningStore
import com.focusguard.service.FocusGuardMonitorService
import com.focusguard.widget.WidgetUpdater
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

/**
 * Monitors tracked apps using **daily** usage from [DailyUsageRepository] and
 * [LiveUsageEstimator] for the active session.
 */
class TrackingEngine(
    private val context: Context,
) {

    private val detector = ForegroundAppDetector(context)
    private val usageRepository = DailyUsageRepository.getInstance(context)
    private val liveUsageEstimator = LiveUsageEstimator(usageRepository)
    private val settingsRepository = SettingsRepository
    private val notificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    private val mainHandler = Handler(Looper.getMainLooper())

    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var monitoringJob: Job? = null
    private val monitorMutex = Mutex()

    private val foregroundStabilizer = ForegroundStabilizer()

    /** Package currently over its hard block limit; overlay should stay until snooze or user leaves. */
    private var activeBlockPackage: String? = null

    private var trackedApps: Set<String> = emptySet()

    private var usageEventsObserver: UsageEventsForegroundObserver? = null

    /** Starts the polling loop. No-op if already running. */
    fun start() {
        if (monitoringJob != null) return

        ensureWarningChannel()

        usageEventsObserver =
            UsageEventsForegroundObserver.createIfSupported(context) {
                scope.launch {
                    try {
                        monitorMutex.withLock {
                            monitorForegroundApp()
                        }
                    } catch (error: Exception) {
                        handleMonitorFailure(error)
                    }
                }
            }?.also { observer ->
                observer.start()
            }

        monitoringJob = scope.launch {
            while (isActive) {
                try {
                    monitorMutex.withLock {
                        monitorForegroundApp()
                    }
                } catch (error: Exception) {
                    handleMonitorFailure(error)
                    break
                }
                delay(resolvePollIntervalMs())
            }
        }
    }

    /** Clears live-session baselines after a local day rollover. */
    fun onLocalDayChanged() {
        liveUsageEstimator.clearBaselinesForNewDay()
        TrackedUsageChangeEmitter.onLocalDayChanged()
    }

    private fun resolvePollIntervalMs(): Long =
        TrackingEnginePoll.resolveIntervalMs(
            activeBlockPackage = activeBlockPackage,
            stableForeground = foregroundStabilizer.stableForeground,
            trackedApps = trackedApps,
        )

    /** Cancels the polling coroutine and dismisses any active block overlay. */
    fun stop() {
        usageEventsObserver?.stop()
        usageEventsObserver = null
        monitoringJob?.cancel()
        monitoringJob = null
        foregroundStabilizer.reset()
        activeBlockPackage = null
        liveUsageEstimator.clearSession()
        runOnMainThread { BlockOverlayManager.dismiss(context) }
    }

    private fun monitorForegroundApp() {
        if (!MonitoringStateRepository.isMonitoringEnabled()) {
            context.stopService(Intent(context, FocusGuardMonitorService::class.java))
            return
        }

        if (!MonitorPermissions.canRunMonitorService(context)) {
            MonitorPermissions.invalidateCache()
            context.stopService(Intent(context, FocusGuardMonitorService::class.java))
            return
        }

        trackedApps = TrackingConfigRepository.getTrackedAppsSet()

        val previousStable = foregroundStabilizer.stableForeground
        val foregroundApp = foregroundStabilizer.resolve(detector.getForegroundApp())

        if (foregroundApp == null) {
            val blockedPackage = activeBlockPackage
            if (blockedPackage != null && isTrackedApp(blockedPackage)) {
                val usedTodayMs = liveUsageEstimator.getEffectiveUsageMs(blockedPackage)
                evaluateTrackedApp(blockedPackage, usedTodayMs)
                publishWidgetUpdate(blockedPackage to usedTodayMs)
                publishTrackedUsageChanged(urgent = false)
            } else {
                publishWidgetUpdate()
            }
            return
        }

        val enteredNewForeground = foregroundApp != previousStable

        if (!isTrackedApp(foregroundApp)) {
            if (previousStable != null && isTrackedApp(previousStable)) {
                usageRepository.invalidatePackages(setOf(previousStable))
            }
            liveUsageEstimator.clearSession()

            if (activeBlockPackage != null && foregroundApp != activeBlockPackage) {
                clearActiveBlock()
            }
            publishWidgetUpdate()
            return
        }

        if (enteredNewForeground) {
            if (activeBlockPackage != null && activeBlockPackage != foregroundApp) {
                clearActiveBlock()
            }

            val packagesToRefresh =
                buildSet {
                    if (previousStable != null && isTrackedApp(previousStable)) {
                        add(previousStable)
                    }
                    add(foregroundApp)
                }

            if (packagesToRefresh.isNotEmpty()) {
                usageRepository.invalidatePackages(packagesToRefresh)
            }

            liveUsageEstimator.onTrackedAppForeground(foregroundApp)
        }

        val usedTodayMs = liveUsageEstimator.getEffectiveUsageMs(foregroundApp)
        evaluateTrackedApp(foregroundApp, usedTodayMs)
        publishWidgetUpdate(foregroundApp to usedTodayMs)
        publishTrackedUsageChanged(enteredNewForeground)
    }

    private fun publishTrackedUsageChanged(urgent: Boolean) {
        if (trackedApps.isEmpty()) {
            return
        }

        val usageByPackage = liveUsageEstimator.getEffectiveUsageMsForPackages(trackedApps)
        TrackedUsageChangeEmitter.maybeEmit(context, usageByPackage, urgent = urgent)
    }

    private fun publishWidgetUpdate(foregroundUsageOverride: Pair<String, Long>? = null) {
        if (WidgetUpdater.shouldSkipUsagePrecomputation()) {
            return
        }

        val usageOverrides =
            if (trackedApps.isEmpty()) {
                null
            } else {
                val effectiveUsage = liveUsageEstimator.getEffectiveUsageMsForPackages(trackedApps)

                if (foregroundUsageOverride != null) {
                    effectiveUsage + mapOf(foregroundUsageOverride.first to foregroundUsageOverride.second)
                } else {
                    effectiveUsage
                }
            }
        val foregroundPackage = foregroundStabilizer.stableForeground
        val urgent =
            foregroundPackage != null &&
                isTrackedApp(foregroundPackage) &&
                usageOverrides != null
        WidgetUpdater.scheduleUpdate(context, usageOverrides, urgent = urgent)
    }

    private fun handleMonitorFailure(error: Exception) {
        logDebug("Monitor loop failed: ${error.message}")
        NativeErrorReporter.recordNonFatal(error, "TrackingEngine.monitorForegroundApp")
        monitoringJob = null
        context.stopService(Intent(context, FocusGuardMonitorService::class.java))
    }

    private fun evaluateTrackedApp(packageName: String, usedTodayMs: Long) {
        when (val blockState = NextBlockResolver.resolveAppBlockState(packageName, usedTodayMs)) {
            is NextBlockResolver.AppBlockState.SnoozeCountdown -> {
                if (activeBlockPackage == packageName) {
                    clearActiveBlock()
                }
            }

            is NextBlockResolver.AppBlockState.HardBlocked -> {
                val limits = TrackingConfigRepository.getLimitConfig(packageName)
                DailyWarningStore.markWarningShownToday(packageName)
                activeBlockPackage = packageName
                ensureBlockOverlayVisible(packageName, limits, usedTodayMs)
            }

            is NextBlockResolver.AppBlockState.UnderLimit -> {
                if (activeBlockPackage == packageName) {
                    clearActiveBlock()
                }

                val limits = TrackingConfigRepository.getLimitConfig(packageName)
                if (
                    usedTodayMs >= limits.warningThresholdMs &&
                    !DailyWarningStore.wasWarningShownToday(packageName)
                ) {
                    logDebug("Daily warning for $packageName (${usedTodayMs / 60_000}m)")
                    showWarningNotification(packageName)
                    DailyWarningStore.markWarningShownToday(packageName)
                }
            }
        }
    }

    private fun ensureBlockOverlayVisible(
        packageName: String,
        limits: TrackingConfigRepository.AppLimitConfig,
        usedTodayMs: Long,
    ) {
        runOnMainThread {
            val alreadyVisible =
                BlockOverlayManager.isShowing() &&
                    BlockOverlayManager.getShowingPackage() == packageName

            if (alreadyVisible) {
                return@runOnMainThread
            }

            logDebug(
                "Daily block for $packageName (${usedTodayMs / 60_000}m / ${limits.hardBlockThresholdMs / 60_000}m)",
            )

            val shown =
                BlockOverlayManager.show(
                    context,
                    packageName,
                    getAppLabel(packageName),
                    limits.strictMode,
                )

            if (!shown) {
                logDebug("Block overlay not visible for $packageName — will retry on next poll")
            }
        }
    }

    private fun clearActiveBlock() {
        activeBlockPackage = null
        runOnMainThread { BlockOverlayManager.dismiss(context) }
    }

    private fun isTrackedApp(packageName: String): Boolean = trackedApps.contains(packageName)

    private fun ensureWarningChannel() {
        KeeptNotifications.ensureWarningChannel(context, notificationManager)
    }

    private fun showWarningNotification(packageName: String) {
        if (!settingsRepository.areNotificationsEnabled()) {
            return
        }

        if (!NotificationPermissions.hasPostNotificationsPermission(context)) {
            logDebug("Skipping warning notification — POST_NOTIFICATIONS not granted")
            return
        }

        val appName = getAppLabel(packageName)
        val notificationId = warningNotificationId(packageName)
        val contentIntent =
            DeepLinks.activityPendingIntent(
                context,
                DeepLinks.configureIntent(context, packageName),
                notificationId,
            )

        val summary = context.getString(R.string.warning_notification_text, appName)
        val details = context.getString(R.string.warning_notification_details, appName)

        val notification =
            KeeptNotifications.warningBuilder(context)
                .setContentTitle(context.getString(R.string.warning_notification_title))
                .setContentText(summary)
                .setStyle(
                    NotificationCompat.BigTextStyle()
                        .bigText(details)
                        .setSummaryText(context.getString(R.string.app_name)),
                )
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setAutoCancel(true)
                .setContentIntent(contentIntent)
                .setDefaults(NotificationCompat.DEFAULT_ALL)
                .build()

        notificationManager.notify(notificationId, notification)
    }

    private fun warningNotificationId(packageName: String): Int =
        WARNING_NOTIFICATION_ID_BASE + (packageName.hashCode() and 0x7FFF)

    private fun getAppLabel(packageName: String): String =
        AppLabelResolver.resolve(context.packageManager, packageName)

    private fun runOnMainThread(action: () -> Unit) {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            action()
        } else {
            mainHandler.post(action)
        }
    }

    private fun logDebug(message: String) {
        if (BuildConfig.DEBUG) {
            Log.d(TAG, message)
        }
    }

    companion object {
        private const val TAG = "TrackingEngine"
        private const val WARNING_NOTIFICATION_ID_BASE = 2001
    }
}
