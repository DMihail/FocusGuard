package com.focusguard.service

import android.app.Notification
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.ServiceCompat
import com.focusguard.R
import com.focusguard.TrackingEngine
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.navigation.DeepLinks
import com.focusguard.notification.KeeptNotifications
import com.focusguard.react.TurboModuleEventDispatchers
import com.focusguard.widget.WidgetUpdater

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
    super.onCreate()
    isRunning = true
    TurboModuleEventDispatchers.emitMonitorServiceState(isRunning = true)
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
    MonitorPermissions.invalidateCache()
    if (!MonitorPermissions.canRunMonitorService(this)) {
      if (isRunning) {
        isRunning = false
        TurboModuleEventDispatchers.emitMonitorServiceState(isRunning = false)
      }
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

    WidgetUpdater.scheduleUpdate(applicationContext, force = true)

    return START_STICKY
  }

  /** Stops the [TrackingEngine], removes the foreground notification and releases resources. */
  override fun onDestroy() {
    isRunning = false
    TurboModuleEventDispatchers.emitMonitorServiceState(isRunning = false)
    trackingEngine?.stop()
    trackingEngine = null
    WidgetUpdater.scheduleUpdate(applicationContext, force = true)
    stopForeground(STOP_FOREGROUND_REMOVE)
    super.onDestroy()
  }

  /** Creates or updates the monitor [NotificationChannel]. No-op below API 26. */
  private fun ensureNotificationChannel() {
    val manager = getSystemService(NotificationManager::class.java) ?: return
    KeeptNotifications.ensureMonitorChannel(this, manager)
  }

  /** Builds the ongoing foreground notification shown while the service is active. */
  private fun buildNotification(): Notification {
    val contentIntent =
        DeepLinks.activityPendingIntent(this, DeepLinks.dashboardIntent(this), NOTIFICATION_ID)

    return KeeptNotifications.monitorBuilder(this)
        .setContentTitle(getString(R.string.monitor_notification_title))
        .setContentText(getString(R.string.monitor_notification_text))
        .setOngoing(true)
        .setCategory(androidx.core.app.NotificationCompat.CATEGORY_SERVICE)
        .setContentIntent(contentIntent)
        .build()
  }

  companion object {
    private const val NOTIFICATION_ID = 1001

    @Volatile var isRunning: Boolean = false
      private set
  }
}
