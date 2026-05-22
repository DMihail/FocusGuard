package com.focusguard.monitor

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Process
import android.provider.Settings

internal object UsageAccess {
  fun hasAccess(context: Context): Boolean {
    if (isAllowedByAppOps(context)) {
      return true
    }

    return canQueryUsageStats(context)
  }

  fun openSettings(context: Context) {
    if (hasAccess(context)) {
      return
    }

    val packageName = context.packageName
    val packageUri = Uri.parse("package:$packageName")

    val intents =
        listOf(
            Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply { data = packageUri },
            Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS),
            Intent("miui.intent.action.APP_PERM_EDITOR").apply {
              setClassName(
                  "com.miui.securitycenter",
                  "com.miui.permcenter.permissions.PermissionsEditorActivity",
              )
              putExtra("extra_pkgname", packageName)
            },
            Intent("miui.intent.action.APP_PERM_EDITOR").apply {
              setClassName(
                  "com.miui.securitycenter",
                  "com.miui.permcenter.permissions.AppPermissionsEditorActivity",
              )
              putExtra("extra_pkgname", packageName)
            },
            Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply { data = packageUri },
        )

    for (intent in intents) {
      try {
        context.startActivity(intent.apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK })
        return
      } catch (_: ActivityNotFoundException) {
        // Try the next MIUI / AOSP settings screen.
      }
    }
  }

  private fun isAllowedByAppOps(context: Context): Boolean {
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

  /** MIUI sometimes reports MODE_DEFAULT until usage is queried. */
  private fun canQueryUsageStats(context: Context): Boolean {
    val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager ?: return false
    val endTime = System.currentTimeMillis()

    return try {
      usageStatsManager.queryUsageStats(
          UsageStatsManager.INTERVAL_DAILY,
          endTime - 60_000L,
          endTime,
      ) != null
    } catch (_: SecurityException) {
      false
    }
  }
}
