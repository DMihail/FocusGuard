package com.focusguard.monitor

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat

/** Runtime and user-toggle checks for posting warning notifications. */
internal object NotificationPermissions {

  fun canPostNotifications(context: Context): Boolean {
    if (!hasPostNotificationsPermission(context)) {
      return false
    }

    return NotificationManagerCompat.from(context).areNotificationsEnabled()
  }

  fun hasPostNotificationsPermission(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      return true
    }

    return ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.POST_NOTIFICATIONS,
    ) == PackageManager.PERMISSION_GRANTED
  }

  fun areNotificationsEnabled(context: Context): Boolean =
      NotificationManagerCompat.from(context).areNotificationsEnabled()
}
