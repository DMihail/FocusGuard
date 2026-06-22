package com.focusguard.monitor

import android.app.AppOpsManager
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.focusguard.permissions.ActivityIntents
import com.focusguard.storage.UsageAccessGrantStore

/**
 * Utility for checking and requesting the Usage Stats (`PACKAGE_USAGE_STATS`) permission.
 *
 * Fresh installs: only AppOps MODE_ALLOWED or a confirmed grant probe counts as granted.
 * After a confirmed grant, session + MMKV latches stay true through transient AppOps flicker
 * when returning from other special-permission settings screens.
 */
internal object UsageAccess {

  private val usageProbeWindowsMs =
      longArrayOf(300_000L, 1_800_000L, 3_600_000L, 86_400_000L)

  @Volatile private var sessionGranted = false
  @Volatile private var awaitingUsageGrantFromSettings = false

  /** @return `true` when Usage Stats access is available. */
  fun hasAccess(context: Context): Boolean {
    if (hasConfirmedGrant()) {
      return true
    }

    val packageName = context.packageName
    val appOps = context.getSystemService(AppOpsManager::class.java)

    if (appOps != null && isExplicitlyDenied(appOps, packageName)) {
      clearGrantState()
      return false
    }

    if (appOps == null) {
      return false
    }

    if (isAppOpExplicitlyAllowed(appOps, packageName)) {
      return confirmGrant()
    }

    if (awaitingUsageGrantFromSettings && canObserveOtherAppsUsage(context)) {
      return confirmGrant()
    }

    return false
  }

  /**
   * Pins a confirmed Usage Stats grant before opening another permission settings screen.
   *
   * AppOps can flicker after returning from overlay/battery settings; capturing the grant while
   * it is still readable prevents the Usage Access card from dropping back to pending.
   */
  fun pinGrantBeforeOtherPermissionSettings(context: Context) {
    if (hasConfirmedGrant()) {
      return
    }

    val packageName = context.packageName
    val appOps = context.getSystemService(AppOpsManager::class.java) ?: return

    if (isExplicitlyDenied(appOps, packageName)) {
      return
    }

    if (isAppOpExplicitlyAllowed(appOps, packageName)) {
      confirmGrant()
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

    clearGrantState()
    awaitingUsageGrantFromSettings = true

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

  private fun hasConfirmedGrant(): Boolean = sessionGranted || UsageAccessGrantStore.isGranted()

  private fun confirmGrant(): Boolean {
    sessionGranted = true
    UsageAccessGrantStore.markGranted()
    awaitingUsageGrantFromSettings = false
    return true
  }

  private fun clearGrantState() {
    sessionGranted = false
    UsageAccessGrantStore.clear()
    awaitingUsageGrantFromSettings = false
  }

  private fun isExplicitlyDenied(appOps: AppOpsManager, packageName: String): Boolean {
    val strictMode = readUsageAppOpMode(appOps, packageName, useUnsafeCheck = false)
    if (strictMode == AppOpsManager.MODE_IGNORED || strictMode == AppOpsManager.MODE_ERRORED) {
      return true
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      val unsafeMode = readUsageAppOpMode(appOps, packageName, useUnsafeCheck = true)
      if (unsafeMode == AppOpsManager.MODE_IGNORED || unsafeMode == AppOpsManager.MODE_ERRORED) {
        return true
      }
    }

    return false
  }

  private fun isAppOpExplicitlyAllowed(appOps: AppOpsManager, packageName: String): Boolean {
    if (readUsageAppOpMode(appOps, packageName, useUnsafeCheck = false) ==
        AppOpsManager.MODE_ALLOWED) {
      return true
    }

    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
        readUsageAppOpMode(appOps, packageName, useUnsafeCheck = true) ==
            AppOpsManager.MODE_ALLOWED
  }

  private fun canObserveOtherAppsUsage(context: Context): Boolean {
    val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager ?: return false
    val ownPackage = context.packageName
    val endTime = System.currentTimeMillis()

    for (windowMs in usageProbeWindowsMs) {
      val startTime = endTime - windowMs

      val stats =
          usageStatsManager.queryUsageStats(
              UsageStatsManager.INTERVAL_BEST,
              startTime,
              endTime,
          )
      if (stats?.any { stat ->
            stat.packageName != ownPackage &&
                stat.packageName.isNotEmpty() &&
                (stat.lastTimeUsed > 0L || stat.totalTimeInForeground > 0L)
          } == true) {
        return true
      }

      val events = usageStatsManager.queryEvents(startTime, endTime)
      val event = UsageEvents.Event()
      while (events.hasNextEvent()) {
        events.getNextEvent(event)
        if (event.packageName != ownPackage && event.packageName.isNotEmpty()) {
          return true
        }
      }
    }

    return false
  }

  private fun readUsageAppOpMode(
      appOps: AppOpsManager,
      packageName: String,
      useUnsafeCheck: Boolean,
  ): Int =
      if (useUnsafeCheck && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        appOps.unsafeCheckOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            packageName,
        )
      } else {
        appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            Process.myUid(),
            packageName,
        )
      }
}
