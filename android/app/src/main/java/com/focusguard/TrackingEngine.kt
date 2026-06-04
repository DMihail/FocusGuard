package com.focusguard

import android.app.NotificationChannel
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
import com.focusguard.navigation.DeepLinks
import com.focusguard.overlay.BlockOverlayManager
import com.focusguard.overlay.DailyWarningStore
import com.focusguard.overlay.TrackingSnoozeStore
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
    private val usageRepository = DailyUsageRepository(context)
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
    private var blockShown = false

    /** Starts the polling loop. No-op if already running. */
    fun start() {
        if (monitoringJob != null) return

        ensureWarningChannel()

        monitoringJob = scope.launch {
            while (isActive) {
                monitorForegroundApp()
                delay(POLL_INTERVAL_MS)
            }
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
        blockShown = false
        liveUsageEstimator.clearSession()
        runOnMainThread { BlockOverlayManager.dismiss(context) }
    }

    private fun monitorForegroundApp() {
        val previousStable = stableForeground
        val foregroundApp = resolveStableForeground(detector.getForegroundApp())

        if (foregroundApp == null) {
            if (blockShown && stableForeground != null && isTrackedApp(stableForeground!!)) {
                evaluateTrackedApp(stableForeground!!)
                return
            }

            if (blockShown) {
                runOnMainThread {
                    BlockOverlayManager.dismiss(context)
                    blockShown = false
                }
            }
            return
        }

        val enteredNewForeground = foregroundApp != previousStable

        if (!isTrackedApp(foregroundApp)) {
            liveUsageEstimator.clearSession()

            if (blockShown) {
                runOnMainThread {
                    BlockOverlayManager.dismiss(context)
                    blockShown = false
                }
            }
            return
        }

        if (enteredNewForeground) {
            blockShown = false
            liveUsageEstimator.onTrackedAppForeground(foregroundApp)
        }

        evaluateTrackedApp(foregroundApp)
    }

    private fun evaluateTrackedApp(packageName: String) {
        if (TrackingSnoozeStore.isSnoozed(packageName)) {
            if (blockShown) {
                runOnMainThread {
                    BlockOverlayManager.dismiss(context)
                    blockShown = false
                }
            }
            return
        }

        val limits = configRepository.getLimitConfig(packageName)
        val usedTodayMs = liveUsageEstimator.getEffectiveUsageMs(packageName)

        if (usedTodayMs >= limits.hardBlockThresholdMs) {
            if (!blockShown) {
                logDebug(
                    "Daily block for $packageName (${usedTodayMs / 60_000}m / ${limits.hardBlockThresholdMs / 60_000}m)",
                )
                runOnMainThread { showBlockOverlay(packageName, limits) }
            }
            blockShown = true
            return
        }

        if (blockShown) {
            runOnMainThread {
                BlockOverlayManager.dismiss(context)
                blockShown = false
            }
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

    private fun showBlockOverlay(
        packageName: String,
        limits: TrackingConfigRepository.AppLimitConfig,
    ) {
        context.startActivity(
            Intent(Intent.ACTION_MAIN).apply {
                addCategory(Intent.CATEGORY_HOME)
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            },
        )

        BlockOverlayManager.show(
            context,
            packageName,
            getAppLabel(packageName),
            limits.strictMode,
        )
    }

    private fun ensureWarningChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val channel =
            NotificationChannel(
                WARNING_CHANNEL_ID,
                context.getString(R.string.warning_notification_channel_name),
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = context.getString(R.string.warning_notification_channel_description)
                enableVibration(true)
            }

        notificationManager.createNotificationChannel(channel)
    }

    private fun showWarningNotification(packageName: String) {
        if (!settingsRepository.areNotificationsEnabled()) {
            return
        }

        if (!MonitorPermissions.canPostNotifications(context)) {
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

        val notification =
            NotificationCompat.Builder(context, WARNING_CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(context.getString(R.string.warning_notification_title))
                .setContentText(context.getString(R.string.warning_notification_text, appName))
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
        private const val POLL_INTERVAL_MS = 1000L
        private const val FOREGROUND_STABLE_POLLS = 1
        private const val FOREGROUND_MISS_POLLS = 3
        private const val WARNING_CHANNEL_ID = "focusguard_warnings"
        private const val WARNING_NOTIFICATION_ID_BASE = 2001
    }
}
