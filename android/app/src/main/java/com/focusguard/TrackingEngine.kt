package com.focusguard

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
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
 * Polls [ForegroundAppDetector] every second via a coroutine and compares the result
 * against the tracked apps list from [TrackingConfigRepository].
 * When a tracked app is used for longer than [WARNING_THRESHOLD_MS] (60 seconds),
 * a push notification is shown to remind the user to take a break.
 *
 * Designed to run inside [FocusGuardMonitorService][com.focusguard.service.FocusGuardMonitorService].
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
    }

    /**
     * Checks the current foreground app every tick.
     * If the app changed — resets session tracking via [onAppChanged].
     * If the same tracked app is still open — checks whether the warning threshold is reached.
     */
    private fun monitorForegroundApp() {
        val foregroundApp = detector.getForegroundApp() ?: return

        if (foregroundApp != currentApp) {
            onAppChanged(foregroundApp)
            return
        }

        if (warningShown) return

        val elapsed = System.currentTimeMillis() - currentSessionStart
        if (elapsed >= WARNING_THRESHOLD_MS && isTrackedApp(foregroundApp)) {
            showWarningNotification(foregroundApp)
            warningShown = true
        }
    }

    /**
     * Called when the foreground app changes.
     * Resets session start time and the warning flag.
     */
    private fun onAppChanged(packageName: String) {
        currentApp = packageName
        currentSessionStart = System.currentTimeMillis()
        warningShown = false

        Log.d(TAG, "Foreground app: $packageName")

        if (isTrackedApp(packageName)) {
            Log.d(TAG, "Tracked app opened: $packageName")
        }
    }

    private fun isTrackedApp(packageName: String): Boolean =
        configRepository.getTrackedApps().contains(packageName)

    /**
     * Creates the high-priority notification channel for usage warnings.
     * No-op below API 26.
     */
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

    /** Shows a push notification warning that the user has been using [packageName] too long. */
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

        Log.d(TAG, "Warning notification shown for $packageName ($appName)")
    }

    /** Resolves a human-readable app label from [packageName], falling back to the package name itself. */
    private fun getAppLabel(packageName: String): String =
        try {
            val appInfo = context.packageManager.getApplicationInfo(packageName, 0)
            context.packageManager.getApplicationLabel(appInfo).toString()
        } catch (_: PackageManager.NameNotFoundException) {
            packageName
        }

    companion object {
        private const val TAG = "TrackingEngine"
        private const val POLL_INTERVAL_MS = 1000L
        private const val WARNING_THRESHOLD_MS = 60_000L
        private const val WARNING_CHANNEL_ID = "focusguard_warnings"
        private const val WARNING_NOTIFICATION_ID = 2001
    }
}
