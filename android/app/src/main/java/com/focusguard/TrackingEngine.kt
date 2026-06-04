package com.focusguard

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
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

    private var currentApp: String? = null
    private var currentSessionStart = 0L
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
        BlockOverlayManager.dismiss(context)
    }

    private fun monitorForegroundApp() {
        val foregroundApp = detector.getForegroundApp() ?: return

        if (foregroundApp != currentApp) {
            onAppChanged(foregroundApp)
            return
        }

        if (!isTrackedApp(foregroundApp)) return

        val limits = configRepository.getLimitConfig(foregroundApp)
        val elapsed = System.currentTimeMillis() - currentSessionStart

        if (TrackingSnoozeStore.isSnoozed(foregroundApp)) {
            blockShown = false
            return
        }

        if (!blockShown && elapsed >= limits.hardBlockThresholdMs) {
            showBlockOverlay(foregroundApp, limits)
            blockShown = true
            return
        }

        if (blockShown || warningShown) return

        if (elapsed >= limits.warningThresholdMs) {
            showWarningNotification(foregroundApp)
            warningShown = true
        }
    }

    private fun onAppChanged(packageName: String) {
        if (blockShown) {
            BlockOverlayManager.dismiss(context)
        }

        currentApp = packageName
        currentSessionStart = System.currentTimeMillis()
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
        val appName = getAppLabel(packageName)

        val notification = NotificationCompat.Builder(context, WARNING_CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(context.getString(R.string.warning_notification_title))
            .setContentText(context.getString(R.string.warning_notification_text, appName))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
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

    companion object {
        private const val POLL_INTERVAL_MS = 1000L
        private const val WARNING_CHANNEL_ID = "focusguard_warnings"
        private const val WARNING_NOTIFICATION_ID = 2001
    }
}
