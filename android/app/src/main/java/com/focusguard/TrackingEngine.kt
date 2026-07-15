package com.focusguard

import android.app.NotificationManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.focusguard.crashlytics.NativeErrorReporter
import com.focusguard.monitor.ForegroundPollWake
import com.focusguard.monitor.ForegroundStabilizer
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.MonitoringStateRepository
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.monitor.TrackedUsageChangeEmitter
import com.focusguard.monitor.TrackingEnginePoll
import com.focusguard.monitor.TrackingEnginePollRecovery
import com.focusguard.navigation.DeepLinks
import com.focusguard.notification.KeeptNotifications
import com.focusguard.overlay.BlockFallbackNotifier
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
    private val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
    private val mainHandler = Handler(Looper.getMainLooper())

    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var monitoringJob: Job? = null
    private val monitorMutex = Mutex()

    private val foregroundStabilizer = ForegroundStabilizer()

    /** Package currently over its hard block limit; overlay should stay until snooze or user leaves. */
    private var activeBlockPackage: String? = null

    /** One supplemental PiP nudge per active block session. */
    private var pipFallbackNotifiedFor: String? = null

    private var trackedApps: Set<String> = emptySet()

    private var consecutivePollFailures = 0

    /** Starts the polling loop. No-op if already running. */
    fun start() {
        if (monitoringJob != null) return

        ensureWarningChannel()
        consecutivePollFailures = 0

        monitoringJob = scope.launch {
            while (isActive) {
                try {
                    monitorMutex.withLock {
                        monitorForegroundApp()
                    }
                    consecutivePollFailures = 0
                } catch (error: Exception) {
                    consecutivePollFailures += 1
                    handleMonitorFailure(
                        error,
                        stopService = TrackingEnginePollRecovery.shouldStopService(consecutivePollFailures),
                    )

                    if (TrackingEnginePollRecovery.shouldStopService(consecutivePollFailures)) {
                        break
                    }

                    delay(TrackingEnginePollRecovery.BACKOFF_MS)
                    continue
                }

                val intervalMs = resolvePollIntervalMs()
                ForegroundPollWake.delayUntilNextPoll(usageStatsManager, intervalMs)
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
            pendingForegroundSwitch = foregroundStabilizer.hasPendingSwitch(),
        )

    /** Cancels the polling coroutine and dismisses any active block overlay. */
    fun stop() {
        monitoringJob?.cancel()
        monitoringJob = null
        consecutivePollFailures = 0
        val blockedPackage = activeBlockPackage
        foregroundStabilizer.reset()
        activeBlockPackage = null
        pipFallbackNotifiedFor = null
        liveUsageEstimator.clearSession()
        runOnMainThread {
            BlockOverlayManager.dismiss(context)
            if (blockedPackage != null) {
                BlockFallbackNotifier.dismiss(context, blockedPackage)
            }
        }
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
        detector.aggressivePolling = activeBlockPackage != null

        val openSessions = detector.getOpenForegroundPackages()
        val trackedOpenSessions = openSessions.filter { packageName -> isTrackedApp(packageName) }.toSet()

        val previousStable = foregroundStabilizer.stableForeground
        val foregroundApp = foregroundStabilizer.resolve(detector.getForegroundApp())
        val enteredNewForeground = foregroundApp != null && foregroundApp != previousStable

        val packagesToEvaluate = linkedSetOf<String>()
        packagesToEvaluate.addAll(trackedOpenSessions)
        if (foregroundApp != null && isTrackedApp(foregroundApp)) {
            packagesToEvaluate.add(foregroundApp)
        }

        for (packageName in packagesToEvaluate) {
            ensureLiveSession(packageName)
            val usedTodayMs = liveUsageEstimator.getEffectiveUsageMs(packageName)
            evaluateTrackedApp(packageName, usedTodayMs)
        }

        if (
            activeBlockPackage != null &&
            activeBlockPackage !in openSessions &&
            activeBlockPackage != foregroundApp
        ) {
            clearActiveBlock()
        }

        maybeShowPipFallbackNotification(openSessions)

        when {
            foregroundApp != null && isTrackedApp(foregroundApp) -> {
                if (enteredNewForeground) {
                    if (
                        activeBlockPackage != null &&
                        activeBlockPackage != foregroundApp &&
                        activeBlockPackage !in openSessions
                    ) {
                        clearActiveBlock()
                    }
                    invalidateUsageOnForegroundSwitch(previousStable, foregroundApp, openSessions)
                }
            }

            foregroundApp != null && !isTrackedApp(foregroundApp) -> {
                handleUntrackedForeground(previousStable, openSessions)
            }

            foregroundApp == null && trackedOpenSessions.isEmpty() && activeBlockPackage == null -> {
                liveUsageEstimator.clearSession()
            }
        }

        val widgetPackage =
            foregroundApp?.takeIf { packageName -> isTrackedApp(packageName) }
                ?: trackedOpenSessions.firstOrNull()
                ?: activeBlockPackage?.takeIf { packageName -> isTrackedApp(packageName) }

        if (widgetPackage != null) {
            publishWidgetUpdate(widgetPackage to liveUsageEstimator.getEffectiveUsageMs(widgetPackage))
        } else {
            publishWidgetUpdate()
        }

        publishTrackedUsageChanged(
            enteredNewForeground && foregroundApp?.let(::isTrackedApp) == true,
        )
    }

    private fun handleUntrackedForeground(
        previousStable: String?,
        openSessions: Set<String>,
    ) {
        if (previousStable != null && isTrackedApp(previousStable) && previousStable !in openSessions) {
            usageRepository.invalidatePackages(setOf(previousStable))
        }

        if (activeBlockPackage != null && activeBlockPackage !in openSessions) {
            clearActiveBlock()
        }

        if (openSessions.none { packageName -> isTrackedApp(packageName) }) {
            liveUsageEstimator.clearSession()
        }
    }

    private fun invalidateUsageOnForegroundSwitch(
        previousStable: String?,
        foregroundApp: String,
        openSessions: Set<String>,
    ) {
        val packagesToRefresh = linkedSetOf(foregroundApp)

        if (
            previousStable != null &&
            isTrackedApp(previousStable) &&
            previousStable != foregroundApp &&
            previousStable !in openSessions
        ) {
            packagesToRefresh.add(previousStable)
        }

        usageRepository.invalidatePackages(packagesToRefresh)
    }

    private fun ensureLiveSession(packageName: String) {
        if (!liveUsageEstimator.isSessionActiveFor(packageName)) {
            liveUsageEstimator.onTrackedAppForeground(packageName)
        }
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

    private fun handleMonitorFailure(error: Exception, stopService: Boolean) {
        logDebug("Monitor loop failed: ${error.message}")
        NativeErrorReporter.recordNonFatal(error, "TrackingEngine.monitorForegroundApp")

        if (!stopService) {
            return
        }

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

            if (shown) {
                BlockOverlayManager.sendUserHome(context)
                BlockFallbackNotifier.dismiss(context, packageName)
            } else if (canPostBlockNotifications()) {
                logDebug("Block overlay not visible for $packageName — showing notification fallback")
                BlockFallbackNotifier.showPrimaryFallback(
                    context,
                    packageName,
                    getAppLabel(packageName),
                    limits.strictMode,
                )
            } else {
                logDebug("Block overlay not visible for $packageName — will retry on next poll")
            }
        }
    }

    private fun clearActiveBlock() {
        val blockedPackage = activeBlockPackage
        activeBlockPackage = null
        pipFallbackNotifiedFor = null
        runOnMainThread { BlockOverlayManager.dismiss(context) }
        if (blockedPackage != null) {
            BlockFallbackNotifier.dismiss(context, blockedPackage)
        }
    }

    private fun maybeShowPipFallbackNotification(openSessions: Set<String>) {
        val blockedPackage = activeBlockPackage ?: return
        if (blockedPackage !in openSessions) return
        if (!BlockOverlayManager.isShowing()) return
        if (pipFallbackNotifiedFor == blockedPackage) return
        if (!canPostBlockNotifications()) return

        BlockFallbackNotifier.showSupplemental(
            context,
            blockedPackage,
            getAppLabel(blockedPackage),
        )
        pipFallbackNotifiedFor = blockedPackage
    }

    private fun canPostBlockNotifications(): Boolean =
        settingsRepository.areNotificationsEnabled() &&
            NotificationPermissions.hasPostNotificationsPermission(context)

    private fun isTrackedApp(packageName: String): Boolean = trackedApps.contains(packageName)

    private fun ensureWarningChannel() {
        KeeptNotifications.ensureWarningChannel(context, notificationManager)
        KeeptNotifications.ensureBlockChannel(context, notificationManager)
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
