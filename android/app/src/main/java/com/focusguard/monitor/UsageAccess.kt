package com.focusguard.monitor

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.focusguard.permissions.ActivityIntents

/**
 * Utility for checking and requesting the Usage Stats (`PACKAGE_USAGE_STATS`) permission.
 *
 * Uses a two-stage detection strategy:
 * 1. [AppOpsManager] check — the standard AOSP path.
 * 2. Trial [UsageStatsManager.queryEvents] — workaround for OEMs (e.g. MIUI) that
 *    report `MODE_DEFAULT` via AppOps even when access is actually granted.
 *
 * Unlike [UsageStatsManager.queryUsageStats], an empty event stream still means access was granted.
 */
internal object UsageAccess {

  /**
   * @return `true` if the app can read usage statistics,
   * accounting for both standard AOSP and OEM-specific quirks.
   */
  fun hasAccess(context: Context): Boolean {
    when (getUsageAppOpMode(context)) {
      AppOpsManager.MODE_ALLOWED -> return true
      AppOpsManager.MODE_DEFAULT -> return canQueryUsageEvents(context)
      null -> return canQueryUsageEvents(context)
      else -> return false
    }
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

    ActivityIntents.startFirstAvailable(context, intents)
  }

  private fun getUsageAppOpMode(context: Context): Int? {
    val appOps = context.getSystemService(AppOpsManager::class.java) ?: return null

    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
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
  }

  /**
   * Fallback check for OEM quirks: if [UsageStatsManager.queryEvents] completes without
   * [SecurityException], usage access is granted even when AppOps still reports `MODE_DEFAULT`.
   */
  private fun canQueryUsageEvents(context: Context): Boolean {
    val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager ?: return false
    val endTime = System.currentTimeMillis()

    return try {
      usageStatsManager.queryEvents(endTime - 60_000L, endTime)
      true
    } catch (_: SecurityException) {
      false
    }
  }
}
