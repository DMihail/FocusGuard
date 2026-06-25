package com.focusguard

import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.core.app.NotificationCompat
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.navigation.DeepLinks
import com.focusguard.notification.KeeptNotifications
import com.focusguard.overlay.BlockOverlayManager
import com.focusguard.overlay.DailyWarningStore
import com.focusguard.overlay.TrackingSnoozeStore
import com.focusguard.service.FocusGuardMonitorService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * Monitors tracked apps using **daily** usage from [DailyUsageRepository] and
 * [LiveUsageEstimator] for the active session.
 */
class TrackingEngine(
    private val context: Context,
) {

    private val detector = ForegroundAppDetector(context)
    private val configRepository = TrackingConfigRepository()
    private val usageRepository = DailyUsageRepository.getInstance(context)
    private val liveUsageEstimator = LiveUsageEstimator(usageRepository)
    private val settingsRepository = SettingsRepository()
    private val notificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    private val mainHandler = Handler(Looper.getMainLooper())

    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var monitoringJob: Job? = null

    private var stableForeground: String? = null
    private var foregroundCandidate: String? = null
    private var foregroundCandidateHits = 0
    private var foregroundMisses = 0

    /** Package currently over its hard block limit; overlay should stay until snooze or user leaves. */
    private var activeBlockPackage: String? = null

    /** Starts the polling loop. No-op if already running. */
    fun start() {
        if (monitoringJob != null) return

        ensureWarningChannel()
        DailyWarningStore.pruneStaleKeys()

        monitoringJob = scope.launch {
            while (isActive) {
                monitorForegroundApp()
                delay(resolvePollIntervalMs())
            }
        }
    }

    private fun resolvePollIntervalMs(): Long {
        val foregroundPackage = stableForeground

        return when {
            activeBlockPackage != null -> POLL_INTERVAL_ACTIVE_MS
            foregroundPackage != null && isTrackedApp(foregroundPackage) -> POLL_INTERVAL_ACTIVE_MS
            else -> POLL_INTERVAL_IDLE_MS
        }
    }

    /** Cancels the polling coroutine and dismisses any active block overlay. */
    fun stop() {
        monitoringJob?.cancel()
        monitoringJob = null
        stableForeground = null
        foregroundCandidate = null
        foregroundCandidateHits = 0
        foregroundMisses = 0
        activeBlockPackage = null
        liveUsageEstimator.clearSession()
        runOnMainThread { BlockOverlayManager.dismiss(context) }
    }

    private fun monitorForegroundApp() {
        if (!MonitorPermissions.canRunMonitorService(context)) {
            context.stopService(Intent(context, FocusGuardMonitorService::class.java))
            return
        }

        val previousStable = stableForeground
        val foregroundApp = resolveStableForeground(detector.getForegroundApp())

        if (foregroundApp == null) {
            val blockedPackage = activeBlockPackage
            if (blockedPackage != null && isTrackedApp(blockedPackage)) {
                evaluateTrackedApp(blockedPackage)
            }
            return
        }

        val enteredNewForeground = foregroundApp != previousStable

        if (!isTrackedApp(foregroundApp)) {
            liveUsageEstimator.clearSession()

            if (activeBlockPackage != null && foregroundApp != activeBlockPackage) {
                clearActiveBlock()
            }
            return
        }

        if (enteredNewForeground) {
            if (activeBlockPackage != null && activeBlockPackage != foregroundApp) {
                clearActiveBlock()
            }
            liveUsageEstimator.onTrackedAppForeground(foregroundApp)
        }

        evaluateTrackedApp(foregroundApp)
    }

    private fun evaluateTrackedApp(packageName: String) {
        if (TrackingSnoozeStore.isSnoozed(packageName)) {
            if (activeBlockPackage == packageName) {
                clearActiveBlock()
            }
            return
        }

        val limits = configRepository.getLimitConfig(packageName)
        val usedTodayMs = liveUsageEstimator.getEffectiveUsageMs(packageName)

        if (usedTodayMs >= limits.hardBlockThresholdMs) {
            DailyWarningStore.markWarningShownToday(packageName)
            activeBlockPackage = packageName
            ensureBlockOverlayVisible(packageName, limits)
            return
        }

        if (activeBlockPackage == packageName) {
            clearActiveBlock()
        }

        if (
            usedTodayMs >= limits.warningThresholdMs &&
                !DailyWarningStore.wasWarningShownToday(packageName)
        ) {
            logDebug("Daily warning for $packageName (${usedTodayMs / 60_000}m)")
            showWarningNotification(packageName)
            DailyWarningStore.markWarningShownToday(packageName)
        }
    }

    private fun ensureBlockOverlayVisible(
        packageName: String,
        limits: TrackingConfigRepository.AppLimitConfig,
    ) {
        runOnMainThread {
            val alreadyVisible =
                BlockOverlayManager.isShowing() &&
                    BlockOverlayManager.getShowingPackage() == packageName

            if (alreadyVisible) {
                return@runOnMainThread
            }

            logDebug(
                "Daily block for $packageName (${liveUsageEstimator.getEffectiveUsageMs(packageName) / 60_000}m / ${limits.hardBlockThresholdMs / 60_000}m)",
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

    private fun resolveStableForeground(raw: String?): String? {
        if (raw == null) {
            foregroundMisses++
            if (foregroundMisses >= FOREGROUND_MISS_POLLS) {
                stableForeground = null
                foregroundCandidate = null
                foregroundCandidateHits = 0
            }
            return stableForeground
        }

        foregroundMisses = 0

        if (raw == foregroundCandidate) {
            foregroundCandidateHits++
        } else {
            foregroundCandidate = raw
            foregroundCandidateHits = 1
        }

        if (foregroundCandidateHits >= FOREGROUND_STABLE_POLLS) {
            stableForeground = raw
        }

        return stableForeground
    }

    private fun isTrackedApp(packageName: String): Boolean =
        configRepository.getTrackedApps().contains(packageName)

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
        try {
            val appInfo = context.packageManager.getApplicationInfo(packageName, 0)
            context.packageManager.getApplicationLabel(appInfo).toString()
        } catch (_: PackageManager.NameNotFoundException) {
            packageName
        }

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
        private const val POLL_INTERVAL_ACTIVE_MS = 1_000L
        private const val POLL_INTERVAL_IDLE_MS = 2_500L
        private const val FOREGROUND_STABLE_POLLS = 1
        private const val FOREGROUND_MISS_POLLS = 3
        private const val WARNING_NOTIFICATION_ID_BASE = 2001
    }
}
