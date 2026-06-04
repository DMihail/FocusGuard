package com.focusguard

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.navigation.NotificationNavigation
import com.focusguard.overlay.BlockOverlayManager
import com.focusguard.overlay.TrackingSnoozeStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * Continuously monitors the foreground app and reacts when a tracked (distracting) app is opened.
 *
 * Per-app limits are loaded from [TrackingConfigRepository]:
 * - [TrackingConfigRepository.AppLimitConfig.warningThresholdMs] → push notification
 * - [TrackingConfigRepository.AppLimitConfig.hardBlockThresholdMs] → block overlay
 */
class TrackingEngine(
    private val context: Context
) {

    private val detector = ForegroundAppDetector(context)
    private val configRepository = TrackingConfigRepository()
    private val notificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private var monitoringJob: Job? = null

    private var stableForeground: String? = null
    private var foregroundCandidate: String? = null
    private var foregroundCandidateHits = 0

    private var trackedSessionPackage: String? = null
    private var trackedSessionStart = 0L
    private var warningShown = false
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

    /** Cancels the polling coroutine and resets monitoring state. */
    fun stop() {
        monitoringJob?.cancel()
        monitoringJob = null
        clearTrackedSession(dismissOverlay = true)
        stableForeground = null
        foregroundCandidate = null
        foregroundCandidateHits = 0
        BlockOverlayManager.dismiss(context)
    }

    private fun monitorForegroundApp() {
        val foregroundApp = resolveStableForeground(detector.getForegroundApp()) ?: return

        if (!isTrackedApp(foregroundApp)) {
            clearTrackedSession(dismissOverlay = true)
            return
        }

        if (trackedSessionPackage != foregroundApp) {
            startTrackedSession(foregroundApp)
        }

        val limits = configRepository.getLimitConfig(foregroundApp)
        val elapsed = System.currentTimeMillis() - trackedSessionStart

        if (TrackingSnoozeStore.isSnoozed(foregroundApp)) {
            blockShown = false
            return
        }

        if (!blockShown && elapsed >= limits.hardBlockThresholdMs) {
            logDebug(
                "Hard block for $foregroundApp after ${elapsed / 1000}s " +
                    "(limit ${limits.hardBlockThresholdMs / 1000}s)",
            )
            showBlockOverlay(foregroundApp, limits)
            blockShown = true
            return
        }

        if (blockShown || warningShown) return

        if (elapsed >= limits.warningThresholdMs) {
            logDebug(
                "Warning for $foregroundApp after ${elapsed / 1000}s " +
                    "(limit ${limits.warningThresholdMs / 1000}s)",
            )
            showWarningNotification(foregroundApp)
            warningShown = true
        }
    }

    /**
     * Usage stats often flicker (launcher/system UI) for a single poll. Require several
     * consecutive identical readings before switching foreground, but keep the last stable
     * value when a poll returns null.
     */
    private fun resolveStableForeground(raw: String?): String? {
        if (raw != null) {
            if (raw == foregroundCandidate) {
                foregroundCandidateHits++
            } else {
                foregroundCandidate = raw
                foregroundCandidateHits = 1
            }

            if (foregroundCandidateHits >= FOREGROUND_STABLE_POLLS) {
                stableForeground = raw
            }
        }

        return stableForeground
    }

    private fun startTrackedSession(packageName: String) {
        if (blockShown) {
            BlockOverlayManager.dismiss(context)
        }

        trackedSessionPackage = packageName
        trackedSessionStart = System.currentTimeMillis()
        warningShown = false
        blockShown = false

        val limits = configRepository.getLimitConfig(packageName)
        logDebug(
            "Tracked session started for $packageName " +
                "(warning ${limits.warningThresholdMs / 60_000}m, block ${limits.hardBlockThresholdMs / 60_000}m)",
        )
    }

    private fun clearTrackedSession(dismissOverlay: Boolean) {
        if (dismissOverlay && blockShown) {
            BlockOverlayManager.dismiss(context)
        }

        trackedSessionPackage = null
        warningShown = false
        blockShown = false
    }

    private fun isTrackedApp(packageName: String): Boolean =
        configRepository.getTrackedApps().contains(packageName)

    private fun showBlockOverlay(packageName: String, limits: TrackingConfigRepository.AppLimitConfig) {
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

        val channel = NotificationChannel(
            WARNING_CHANNEL_ID,
            context.getString(R.string.warning_notification_channel_name),
            NotificationManager.IMPORTANCE_HIGH,
        ).apply {
            description = context.getString(R.string.warning_notification_channel_description)
        }

        notificationManager.createNotificationChannel(channel)
    }

    private fun showWarningNotification(packageName: String) {
        if (!NotificationPermissions.canPostNotifications(context)) {
            logDebug("Skipping warning notification — notifications disabled or not permitted")
            return
        }

        val appName = getAppLabel(packageName)

        val notification = NotificationCompat.Builder(context, WARNING_CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(context.getString(R.string.warning_notification_title))
            .setContentText(context.getString(R.string.warning_notification_text, appName))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(NotificationNavigation.configureLimitsTapIntent(context, packageName))
            .build()

        notificationManager.notify(WARNING_NOTIFICATION_ID, notification)
    }

    private fun getAppLabel(packageName: String): String =
        try {
            val appInfo = context.packageManager.getApplicationInfo(packageName, 0)
            context.packageManager.getApplicationLabel(appInfo).toString()
        } catch (_: PackageManager.NameNotFoundException) {
            packageName
        }

    private fun logDebug(message: String) {
        if (BuildConfig.DEBUG) {
            Log.d(TAG, message)
        }
    }

    companion object {
        private const val TAG = "TrackingEngine"
        private const val POLL_INTERVAL_MS = 1000L
        private const val FOREGROUND_STABLE_POLLS = 3
        private const val WARNING_CHANNEL_ID = "focusguard_warnings"
        private const val WARNING_NOTIFICATION_ID = 2001
    }
}
