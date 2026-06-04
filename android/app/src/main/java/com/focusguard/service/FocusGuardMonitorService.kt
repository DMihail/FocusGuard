package com.focusguard.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import com.focusguard.R
import com.focusguard.TrackingEngine
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.MonitoringPreferences
import com.focusguard.navigation.NotificationNavigation
import com.focusguard.receiver.MonitorNotificationDismissReceiver

/**
 * Long-running foreground service that keeps the app-monitoring process alive.
 *
 * Displays a persistent low-priority notification so the system does not kill the process.
 * On API 34+ runs as `FOREGROUND_SERVICE_TYPE_SPECIAL_USE`; on older versions uses the
 * default foreground type. Returns [START_STICKY] so the system restarts the service
 * if it is killed, and stops itself immediately if required permissions are missing.
 *
 * Started via [MonitorServiceHelper][com.focusguard.monitor.MonitorServiceHelper] and
 * auto-restarted on boot by [BootCompletedReceiver][com.focusguard.receiver.BootCompletedReceiver].
 */
class FocusGuardMonitorService : Service() {

  private var trackingEngine: TrackingEngine? = null

  /** Not a bound service — always returns `null`. */
  override fun onBind(intent: Intent?): IBinder? = null

  /** Creates the notification channel on first launch (API 26+). */
  override fun onCreate() {
    isRunning = true
    super.onCreate()
    ensureNotificationChannel()
  }

  /**
   * Promotes the service to the foreground with a persistent notification.
   *
   * If the required permissions are no longer available the service stops itself
   * and returns [START_NOT_STICKY] to prevent automatic restarts.
   * Otherwise returns [START_STICKY] so the system re-creates the service after a kill.
   */
  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (!MonitorPermissions.canRunMonitorService(this)) {
      stopSelf()
      return START_NOT_STICKY
    }

    val notification = buildNotification()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      ServiceCompat.startForeground(
          this,
          NOTIFICATION_ID,
          notification,
          ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE,
      )
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }

    if (trackingEngine == null) {
      trackingEngine = TrackingEngine(applicationContext).also { it.start() }
    }

    return START_STICKY
  }

  /** Stops the [TrackingEngine], removes the foreground notification and releases resources. */
  override fun onDestroy() {
    isRunning = false
    trackingEngine?.stop()
    trackingEngine = null
    stopForeground(STOP_FOREGROUND_REMOVE)
    super.onDestroy()
  }

  /**
   * Creates or updates the [NotificationChannel] with low importance.
   * No-op below API 26 where channels are not supported.
   */
  private fun ensureNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val channel =
        NotificationChannel(
            CHANNEL_ID,
            getString(R.string.monitor_notification_channel_name),
            NotificationManager.IMPORTANCE_LOW,
        ).apply {
          description = getString(R.string.monitor_notification_channel_description)
        }

    val manager = getSystemService(NotificationManager::class.java)
    manager?.createNotificationChannel(channel)
  }

  /** Builds the ongoing foreground notification shown while the service is active. */
  private fun buildNotification(): Notification =
      NotificationCompat.Builder(this, CHANNEL_ID)
          .setSmallIcon(R.mipmap.ic_launcher)
          .setContentTitle(getString(R.string.monitor_notification_title))
          .setContentText(getString(R.string.monitor_notification_text))
          .setOngoing(true)
          .setCategory(NotificationCompat.CATEGORY_SERVICE)
          .setContentIntent(NotificationNavigation.dashboardTapIntent(this))
          .setDeleteIntent(monitorDismissPendingIntent())
          .build()

  private fun monitorDismissPendingIntent(): PendingIntent {
    val intent =
        Intent(this, MonitorNotificationDismissReceiver::class.java).apply {
          action = MonitorNotificationDismissReceiver.ACTION_DISMISS_MONITOR
        }

    val flags =
        PendingIntent.FLAG_UPDATE_CURRENT or
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
              PendingIntent.FLAG_IMMUTABLE
            } else {
              0
            }

    return PendingIntent.getBroadcast(this, REQUEST_CODE_DISMISS_MONITOR, intent, flags)
  }

  companion object {
    private const val CHANNEL_ID = "focusguard_monitor"
    private const val NOTIFICATION_ID = 1001
    private const val REQUEST_CODE_DISMISS_MONITOR = 3003

    @Volatile
    var isRunning: Boolean = false
        private set
  }
}
