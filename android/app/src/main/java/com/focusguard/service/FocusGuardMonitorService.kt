package com.focusguard.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import com.focusguard.R
import com.focusguard.monitor.MonitorPermissions

class FocusGuardMonitorService : Service() {
  override fun onBind(intent: Intent?): IBinder? = null

  override fun onCreate() {
    super.onCreate()
    ensureNotificationChannel()
  }

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

    return START_STICKY
  }

  override fun onDestroy() {
    stopForeground(STOP_FOREGROUND_REMOVE)
    super.onDestroy()
  }

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

  private fun buildNotification(): Notification =
      NotificationCompat.Builder(this, CHANNEL_ID)
          .setSmallIcon(R.mipmap.ic_launcher)
          .setContentTitle(getString(R.string.monitor_notification_title))
          .setContentText(getString(R.string.monitor_notification_text))
          .setOngoing(true)
          .setCategory(NotificationCompat.CATEGORY_SERVICE)
          .build()

  companion object {
    private const val CHANNEL_ID = "focusguard_monitor"
    private const val NOTIFICATION_ID = 1001
  }
}
