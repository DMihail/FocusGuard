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

/**
 * Utility for checking and requesting the Usage Stats (`PACKAGE_USAGE_STATS`) permission.
 *
 * Uses a two-stage detection strategy:
 * 1. [AppOpsManager] check — the standard AOSP path.
 * 2. Trial [UsageStatsManager.queryUsageStats] — workaround for MIUI devices that
 *    report `MODE_DEFAULT` via AppOps even when access is actually granted.
 */
internal object UsageAccess {

  /**
   * @return `true` if the app can read usage statistics,
   * accounting for both standard AOSP and MIUI-specific quirks.
   */
  fun hasAccess(context: Context): Boolean {
    if (isAllowedByAppOps(context)) {
      return true
    }

    return canQueryUsageStats(context)
  }

  /**
   * Opens the most appropriate system settings screen for granting Usage Stats access.
   *
   * No-op if access is already granted. Tries the following intents in order,
   * falling back to the next one on [ActivityNotFoundException]:
   * 1. `ACTION_USAGE_ACCESS_SETTINGS` with package URI (deep-links to this app's toggle).
   * 2. `ACTION_USAGE_ACCESS_SETTINGS` without URI (general list).
   * 3. MIUI `PermissionsEditorActivity`.
   * 4. MIUI `AppPermissionsEditorActivity`.
   * 5. `ACTION_APPLICATION_DETAILS_SETTINGS` (last resort — app info page).
   */
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

  /**
   * Checks the `GET_USAGE_STATS` app-op via [AppOpsManager].
   * @return `true` only if the mode is explicitly [AppOpsManager.MODE_ALLOWED].
   */
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

  /**
   * Fallback check for MIUI: attempts a real query over the last 60 seconds.
   * MIUI sometimes reports `MODE_DEFAULT` via AppOps even when access is granted,
   * so a successful query confirms actual availability.
   *
   * @return `true` if the query returns a non-null result without throwing [SecurityException].
   */
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
