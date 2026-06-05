package com.nativeusagestats

import android.Manifest
import android.app.AppOpsManager
import android.app.Application
import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.net.Uri
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Build
import android.os.PowerManager
import android.os.Process
import android.provider.Settings
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.permissions.NotificationPermission
import com.focusguard.permissions.PermissionEventEmitter
import com.focusguard.monitor.MonitorServiceHelper
import com.focusguard.monitor.OverlayAccess
import com.focusguard.monitor.UsageAccess
import java.io.File
import java.io.FileOutputStream
import java.util.Calendar

/**
 * Aggregated usage information for a single application.
 *
 * @property packageName unique application identifier (e.g. `com.example.app`).
 * @property appName human-readable label shown to the user.
 * @property appImage `file://` URI pointing to the cached app icon, or empty string on failure.
 * @property totalTimeForeground time the app spent in the foreground during the query window, in ms.
 * @property lastTimeUsed epoch timestamp of the app's last foreground session.
 * @property category human-readable category name derived from [ApplicationInfo.category].
 */
data class AppUsageInfo(
    val packageName: String,
    val appName: String,
    val appImage: String,
    val totalTimeForeground: Long,
    val lastTimeUsed: Long,
    val category: String,
)

private const val ICON_SIZE_PX = 96
// ApplicationInfo.CATEGORY_SHOPPING (API 31+)
private const val APPLICATION_CATEGORY_SHOPPING = 9

/** Converts [AppUsageInfo] into a [WritableMap] suitable for the React Native bridge. */
private fun AppUsageInfo.toWritableMap(): WritableMap =
    Arguments.createMap().apply {
      putString("packageName", packageName)
      putString("appName", appName)
      putString("category", category)
      putString("appImage", appImage)
      putDouble("totalTimeForeground", totalTimeForeground.toDouble())
      putDouble("lastTimeUsed", lastTimeUsed.toDouble())
    }

/** Converts a list of [AppUsageInfo] into a [WritableArray] for the React Native bridge. */
private fun List<AppUsageInfo>.toWritableArray(): WritableArray =
    Arguments.createArray().apply {
      for (info in this@toWritableArray) {
        pushMap(info.toWritableMap())
      }
    }

/**
 * Returns foreground time in milliseconds.
 * Uses [UsageStats.getTotalTimeVisible] on API 29+ and falls back to the deprecated
 * [UsageStats.getTotalTimeInForeground] on older versions.
 */
private fun UsageStats.foregroundTimeMs(): Long =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      totalTimeVisible
    } else {
      @Suppress("DEPRECATION") totalTimeInForeground
    }

/**
 * Resolves a human-readable category name from [ApplicationInfo].
 * Returns `"Other"` on API < 26 where categories are unavailable.
 */
private fun getCategoryName(appInfo: ApplicationInfo): String {
  if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
    return "Other"
  }

  return getCategoryName(appInfo.category)
}

/**
 * Maps an [ApplicationInfo] category constant to a display string.
 * Handles the `CATEGORY_SHOPPING` constant introduced in API 31.
 */
private fun getCategoryName(category: Int): String =
    when (category) {
      ApplicationInfo.CATEGORY_GAME -> "Game"
      ApplicationInfo.CATEGORY_AUDIO -> "Audio"
      ApplicationInfo.CATEGORY_VIDEO -> "Video"
      ApplicationInfo.CATEGORY_IMAGE -> "Image"
      ApplicationInfo.CATEGORY_SOCIAL -> "Social"
      ApplicationInfo.CATEGORY_NEWS -> "News"
      ApplicationInfo.CATEGORY_MAPS -> "Maps"
      ApplicationInfo.CATEGORY_PRODUCTIVITY -> "Productivity"
      else ->
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
              category == APPLICATION_CATEGORY_SHOPPING) {
            "Shopping"
          } else {
            "Other"
          }
    }

/**
 * React Native Turbo Module that exposes device usage statistics and permission management to JS.
 *
 * Provides methods to:
 * - query and request runtime permissions (Usage Stats, overlay, notifications, battery);
 * - list installed launchable applications with cached icons;
 * - retrieve per-app foreground usage statistics for the last 24 hours;
 * - start the background [FocusGuardMonitorService].
 */
class NativeUsageStatsModule(reactContext: ReactApplicationContext) :
    NativeUsageStatsSpec(reactContext) {

  private val lifecycleEventListener =
      object : LifecycleEventListener {
        override fun onHostResume() {
          emitPermissionsChanged()
        }

        override fun onHostPause() = Unit

        override fun onHostDestroy() = Unit
      }

  init {
    reactApplicationContext.addLifecycleEventListener(lifecycleEventListener)
  }

  override fun invalidate() {
    reactApplicationContext.removeLifecycleEventListener(lifecycleEventListener)
    super.invalidate()
  }

  private fun emitPermissionsChanged() {
    PermissionEventEmitter.emit(reactApplicationContext.applicationContext as Application)
  }

  /** @return `true` if the app has Usage Stats access. */
  override fun checkForPermission(): Boolean = UsageAccess.hasAccess(reactApplicationContext)

  /** @return `true` if the app can draw overlays on top of other apps (API 23+). */
  override fun checkForSystemAlertWindowPermission(): Boolean =
      OverlayAccess.hasAccess(reactApplicationContext)

  /** @return `true` if the `POST_NOTIFICATIONS` permission is granted (API 33+, always `true` below). */
  override fun checkForNotificationsPermission(): Boolean = hasNotificationsPermission()

  /** @return `true` if the app is excluded from battery optimizations (API 23+). */
  override fun checkForIgnoreBatteryOptimizationsPermission(): Boolean =
      hasIgnoreBatteryOptimizationsPermission()

  /** @return `true` if all manifest-declared permissions required by the monitor service are granted. */
  override fun checkForManifestMonitorPermissions(): Boolean =
      MonitorPermissions.hasManifestMonitorPermissions(reactApplicationContext)

  /** Starts [FocusGuardMonitorService] as a foreground service if all permissions are met. */
  override fun startMonitorService() {
    MonitorServiceHelper.start(reactApplicationContext)
  }

  /** Stops [FocusGuardMonitorService], its [TrackingEngine] and removes the notification. */
  override fun stopMonitorService() {
    MonitorServiceHelper.stop(reactApplicationContext)
  }

  /** @return `true` while [FocusGuardMonitorService] is alive in the process. */
  override fun isMonitorServiceRunning(): Boolean = MonitorServiceHelper.isRunning()

  /** Opens the system Usage Stats settings screen so the user can grant access. */
  override fun requestUsageStatsPermission() {
    UsageAccess.openSettings(reactApplicationContext)
  }

  /**
   * Opens the system overlay permission screen for this app.
   * No-op if already granted or running below API 23.
   */
  override fun requestSystemAlertWindowPermission() {
    if (OverlayAccess.hasAccess(reactApplicationContext)) {
      return
    }

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return
    }

    val context = reactApplicationContext
    val intent =
        Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${context.packageName}"),
            )
            .apply {
              flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
    context.startActivity(intent)
  }

  /**
   * Requests the `POST_NOTIFICATIONS` runtime permission (API 33+).
   * Falls back to opening the system notification settings if no Activity is available.
   */
  override fun requestNotificationsPermission() {
    if (hasNotificationsPermission()) {
      return
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      val activity = reactApplicationContext.currentActivity
      if (activity != null) {
        ActivityCompat.requestPermissions(
            activity,
            arrayOf(Manifest.permission.POST_NOTIFICATIONS),
            NotificationPermission.REQUEST_CODE_POST_NOTIFICATIONS,
        )
        return
      }
    }

    openNotificationSettings()
  }

  /** Opens the system notification settings screen for this app. */
  override fun openNotificationsSettings() {
    openNotificationSettings()
  }

  /**
   * Requests the user to disable battery optimizations for this app (API 23+).
   * Tries `ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` first, then falls back
   * to the general battery optimization settings screen.
   */
  override fun requestIgnoreBatteryOptimizationsPermission() {
    if (hasIgnoreBatteryOptimizationsPermission()) {
      return
    }

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return
    }

    val context = reactApplicationContext
    val activity = context.currentActivity
    val packageUri = Uri.parse("package:${context.packageName}")
    val intents =
        listOf(
            Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply { data = packageUri },
            Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS),
        )

    for (intent in intents) {
      try {
        if (activity != null) {
          activity.startActivity(intent)
        } else {
          context.startActivity(intent.apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK })
        }
        return
      } catch (_: ActivityNotFoundException) {
        // Try the next settings screen.
      }
    }
  }

  /**
   * Returns all launchable (non-system-only) applications installed on the device.
   *
   * Each entry contains `packageName`, `appName`, `appImage` (cached icon `file://` URI),
   * and `category`. The app itself is excluded from the list.
   *
   * @return [WritableArray] of application maps, or an empty array if `QUERY_ALL_PACKAGES`
   *         permission is missing.
   */
  override fun getInstalledApplications(): WritableArray {
    if (!hasQueryAllPackagesPermission()) {
      return Arguments.createArray()
    }

    val packageManager = reactApplicationContext.packageManager
    val launcherIntent =
        Intent(Intent.ACTION_MAIN, null).apply { addCategory(Intent.CATEGORY_LAUNCHER) }
    val launchableApps =
        packageManager.queryIntentActivities(launcherIntent, PackageManager.MATCH_ALL)

    val ownPackage = reactApplicationContext.packageName
    val seenPackages = linkedSetOf<String>()
    val result = Arguments.createArray()

    for (resolveInfo in launchableApps) {
      val packageName = resolveInfo.activityInfo.packageName
      if (packageName == ownPackage || !seenPackages.add(packageName)) {
        continue
      }

      try {
        val appInfo = packageManager.getApplicationInfo(packageName, 0)
        result.pushMap(
            Arguments.createMap().apply {
              putString("packageName", packageName)
              putString("appName", packageManager.getApplicationLabel(appInfo).toString())
              putString("appImage", getAppIconUri(packageName))
              putString("category", getCategoryName(appInfo))
            },
        )
      } catch (_: PackageManager.NameNotFoundException) {
        // Skip packages that were uninstalled between query and lookup.
      }
    }

    return result
  }

  /**
   * Returns per-app foreground usage statistics for the current local calendar day,
   * sorted by total foreground time in descending order.
   *
   * Each entry contains `packageName`, `appName`, `appImage`, `category`,
   * `totalTimeForeground` (ms), and `lastTimeUsed` (epoch ms).
   *
   * @return [WritableArray] of [AppUsageInfo] maps, or an empty array if
   *         Usage Stats access is unavailable.
   */
  override fun getAppsUsageStats(): WritableArray {
    if (!UsageAccess.hasAccess(reactApplicationContext)) {
      return Arguments.createArray()
    }

    val context = reactApplicationContext
    val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
            ?: return Arguments.createArray()

    val packageManager = context.packageManager
    val endTime = System.currentTimeMillis()
    val startTime = startOfLocalDayMs()

    val stats =
        usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime,
        )

    if (stats.isNullOrEmpty()) {
      return Arguments.createArray()
    }

    val ownPackage = reactApplicationContext.packageName

    return stats
        .filter { it.packageName != ownPackage && it.foregroundTimeMs() > 0 }
        .mapNotNull { usageStat ->
          try {
            val appInfo = packageManager.getApplicationInfo(usageStat.packageName, 0)
            val appName = packageManager.getApplicationLabel(appInfo).toString()
            AppUsageInfo(
                packageName = usageStat.packageName,
                appName = appName,
                category = getCategoryName(appInfo),
                appImage = getAppIconUri(usageStat.packageName),
                totalTimeForeground = usageStat.foregroundTimeMs(),
                lastTimeUsed = usageStat.lastTimeUsed,
            )
          } catch (_: PackageManager.NameNotFoundException) {
            null
          }
        }
        .sortedByDescending { it.totalTimeForeground }
        .toWritableArray()
  }

  /** @return `true` if `QUERY_ALL_PACKAGES` is granted (always `true` below API 30). */
  private fun hasQueryAllPackagesPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
      return true
    }

    return reactApplicationContext.checkSelfPermission(Manifest.permission.QUERY_ALL_PACKAGES) ==
        PackageManager.PERMISSION_GRANTED
  }

  /** @return `true` if `POST_NOTIFICATIONS` is granted (always `true` below API 33). */
  private fun hasNotificationsPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      return true
    }

    return ContextCompat.checkSelfPermission(
        reactApplicationContext,
        Manifest.permission.POST_NOTIFICATIONS,
    ) == PackageManager.PERMISSION_GRANTED
  }

  /** @return `true` if the app is on the battery optimization whitelist (always `true` below API 23). */
  private fun hasIgnoreBatteryOptimizationsPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return true
    }

    val powerManager =
        reactApplicationContext.getSystemService(Context.POWER_SERVICE) as? PowerManager
            ?: return false
    return powerManager.isIgnoringBatteryOptimizations(reactApplicationContext.packageName)
  }

  /** Opens `ACTION_APP_NOTIFICATION_SETTINGS` for this app's package. */
  private fun openNotificationSettings() {
    val context = reactApplicationContext
    val intent =
        Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
          putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
          flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }

    context.startActivity(intent)
  }

  /**
   * Returns a `file://` URI for the given app's icon.
   *
   * Icons are cached as 96×96 PNG files under `cacheDir/app_icons/<packageName>.png`.
   * If the cached file already exists, its URI is returned immediately without
   * re-rendering the drawable.
   *
   * @return `file://` URI string, or empty string if the icon cannot be resolved.
   */
  private fun getAppIconUri(packageName: String): String {
    return try {
      val iconDir = File(reactApplicationContext.cacheDir, "app_icons")
      val iconFile = File(iconDir, "$packageName.png")
      if (iconFile.exists()) {
        return Uri.fromFile(iconFile).toString()
      }

      iconDir.mkdirs()

      val packageManager = reactApplicationContext.packageManager
      val drawable = packageManager.getApplicationIcon(packageName)
      val bitmap = drawable.toBitmap()
      val scaled =
          Bitmap.createScaledBitmap(bitmap, ICON_SIZE_PX, ICON_SIZE_PX, true).also {
            if (it !== bitmap) bitmap.recycle()
          }

      FileOutputStream(iconFile).use { stream ->
        scaled.compress(Bitmap.CompressFormat.PNG, 100, stream)
      }
      if (scaled !== bitmap) scaled.recycle()

      Uri.fromFile(iconFile).toString()
    } catch (_: Exception) {
      ""
    }
  }

  /**
   * Converts any [Drawable] to a [Bitmap].
   * If the drawable is already a [BitmapDrawable], its underlying bitmap is returned directly.
   * Otherwise a new ARGB_8888 bitmap is created and the drawable is rendered onto it.
   */
  private fun Drawable.toBitmap(): Bitmap {
    if (this is BitmapDrawable && bitmap != null) {
      return bitmap
    }

    val width = intrinsicWidth.coerceAtLeast(1)
    val height = intrinsicHeight.coerceAtLeast(1)
    return Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888).also { bmp ->
      Canvas(bmp).also { canvas ->
        setBounds(0, 0, canvas.width, canvas.height)
        draw(canvas)
      }
    }
  }

  private fun startOfLocalDayMs(): Long {
    val calendar = Calendar.getInstance()
    calendar.set(Calendar.HOUR_OF_DAY, 0)
    calendar.set(Calendar.MINUTE, 0)
    calendar.set(Calendar.SECOND, 0)
    calendar.set(Calendar.MILLISECOND, 0)
    return calendar.timeInMillis
  }

  companion object {
    const val NAME = NativeUsageStatsSpec.NAME
  }
}
