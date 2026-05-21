package com.focusguard.monitor

import android.Manifest
import android.app.AppOpsManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.PowerManager
import android.os.Process
import android.provider.Settings
import androidx.core.content.ContextCompat

internal object MonitorPermissions {
  fun hasManifestMonitorPermissions(context: Context): Boolean {
    return hasReceiveBootCompletedPermission(context) &&
        hasForegroundServicePermission(context) &&
        hasForegroundServiceSpecialUsePermission(context)
  }

  fun canRunMonitorService(context: Context): Boolean {
    return hasManifestMonitorPermissions(context) && hasUsageStatsPermission(context)
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

  private fun hasUsageStatsPermission(context: Context): Boolean {
    val appOps = context.getSystemService(AppOpsManager::class.java) ?: return false
    val mode =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          appOps.unsafeCheckOpNoThrow(
              AppOpsManager.OPSTR_GET_USAGE_STATS,
              Process.myUid(),
              context.packageName,
          )
        } else {
          @Suppress("DEPRECATION")
          appOps.checkOpNoThrow(
              AppOpsManager.OPSTR_GET_USAGE_STATS,
              Process.myUid(),
              context.packageName,
          )
        }
    return mode == AppOpsManager.MODE_ALLOWED
  }

  fun isIgnoringBatteryOptimizations(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return true
    }

    val powerManager = context.getSystemService(Context.POWER_SERVICE) as? PowerManager ?: return false
    return powerManager.isIgnoringBatteryOptimizations(context.packageName)
  }

  fun canDrawOverlays(context: Context): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return true
    }

    return Settings.canDrawOverlays(context)
  }
}
