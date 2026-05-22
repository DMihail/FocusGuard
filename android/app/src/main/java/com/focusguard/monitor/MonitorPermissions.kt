package com.focusguard.monitor

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat

internal object MonitorPermissions {
  fun hasManifestMonitorPermissions(context: Context): Boolean {
    return hasReceiveBootCompletedPermission(context) &&
        hasForegroundServicePermission(context) &&
        hasForegroundServiceSpecialUsePermission(context)
  }

  fun canRunMonitorService(context: Context): Boolean {
    return hasManifestMonitorPermissions(context) && UsageAccess.hasAccess(context)
  }

  fun hasReceiveBootCompletedPermission(context: Context): Boolean {
    return ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.RECEIVE_BOOT_COMPLETED,
    ) == PackageManager.PERMISSION_GRANTED
  }

  fun hasForegroundServicePermission(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
      return true
    }

    return ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.FOREGROUND_SERVICE,
    ) == PackageManager.PERMISSION_GRANTED
  }

  fun hasForegroundServiceSpecialUsePermission(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      return true
    }

    return ContextCompat.checkSelfPermission(
        context,
        Manifest.permission.FOREGROUND_SERVICE_SPECIAL_USE,
    ) == PackageManager.PERMISSION_GRANTED
  }
}
