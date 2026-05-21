package com.nativeusagestats

import android.Manifest
import android.app.AppOpsManager
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
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.MonitorServiceHelper
import java.io.ByteArrayOutputStream

data class AppUsageInfo(
    val packageName: String,
    val appName: String,
    val appImage: String,
    val totalTimeForeground: Long,
    val lastTimeUsed: Long,
    val category: String,
)

private const val ICON_SIZE_PX = 96
private const val USAGE_WINDOW_MS = 24 * 60 * 60 * 1000L
// ApplicationInfo.CATEGORY_SHOPPING (API 31+)
private const val APPLICATION_CATEGORY_SHOPPING = 9

private fun AppUsageInfo.toWritableMap(): WritableMap =
    Arguments.createMap().apply {
      putString("packageName", packageName)
      putString("appName", appName)
      putString("category", category)
      putString("appImage", appImage)
      putDouble("totalTimeForeground", totalTimeForeground.toDouble())
      putDouble("lastTimeUsed", lastTimeUsed.toDouble())
    }

private fun List<AppUsageInfo>.toWritableArray(): WritableArray =
    Arguments.createArray().apply {
      for (info in this@toWritableArray) {
        pushMap(info.toWritableMap())
      }
    }

private fun UsageStats.foregroundTimeMs(): Long =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      totalTimeVisible
    } else {
      @Suppress("DEPRECATION") totalTimeInForeground
    }

private fun getCategoryName(appInfo: ApplicationInfo): String {
  if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
    return "Other"
  }

  return getCategoryName(appInfo.category)
}

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

class NativeUsageStatsModule(reactContext: ReactApplicationContext) :
    NativeUsageStatsSpec(reactContext) {

  override fun checkForPermission(): Boolean = hasUsageStatsPermission()

  override fun checkForSystemAlertWindowPermission(): Boolean = hasSystemAlertWindowPermission()

  override fun checkForNotificationsPermission(): Boolean = hasNotificationsPermission()

  override fun checkForIgnoreBatteryOptimizationsPermission(): Boolean =
      hasIgnoreBatteryOptimizationsPermission()

  override fun checkForManifestMonitorPermissions(): Boolean =
      MonitorPermissions.hasManifestMonitorPermissions(reactApplicationContext)

  override fun startMonitorService() {
    MonitorServiceHelper.start(reactApplicationContext)
  }

  override fun requestUsageStatsPermission() {
    if (hasUsageStatsPermission()) {
      return
    }
    val intent =
        Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
          flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
    reactApplicationContext.startActivity(intent)
  }

  override fun requestSystemAlertWindowPermission() {
    if (hasSystemAlertWindowPermission()) {
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
            REQUEST_CODE_POST_NOTIFICATIONS,
        )
        return
      }
    }

    openNotificationSettings()
  }

  override fun requestIgnoreBatteryOptimizationsPermission() {
    if (hasIgnoreBatteryOptimizationsPermission()) {
      return
    }

    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return
    }

    val context = reactApplicationContext
    val packageUri = Uri.parse("package:${context.packageName}")
    val intents =
        listOf(
            Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply { data = packageUri },
            Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS),
        )

    for (intent in intents) {
      try {
        context.startActivity(intent.apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK })
        return
      } catch (_: ActivityNotFoundException) {
        // Try the next settings screen.
      }
    }
  }

  override fun getInstalledApplications(): WritableArray {
    if (!hasQueryAllPackagesPermission()) {
      return Arguments.createArray()
    }

    val packageManager = reactApplicationContext.packageManager
    val launcherIntent =
        Intent(Intent.ACTION_MAIN, null).apply { addCategory(Intent.CATEGORY_LAUNCHER) }
    val launchableApps =
        packageManager.queryIntentActivities(launcherIntent, PackageManager.MATCH_ALL)

    val seenPackages = linkedSetOf<String>()
    val result = Arguments.createArray()

    for (resolveInfo in launchableApps) {
      val packageName = resolveInfo.activityInfo.packageName
      if (!seenPackages.add(packageName)) {
        continue
      }

      try {
        val appInfo = packageManager.getApplicationInfo(packageName, 0)
        result.pushMap(
            Arguments.createMap().apply {
              putString("packageName", packageName)
              putString("appName", packageManager.getApplicationLabel(appInfo).toString())
              putString("appImage", getAppIconBase64(packageName))
              putString("category", getCategoryName(appInfo))
            },
        )
      } catch (_: PackageManager.NameNotFoundException) {
        // Skip packages that were uninstalled between query and lookup.
      }
    }

    return result
  }

  override fun getAppsUsageStats(): WritableArray {
    if (!hasUsageStatsPermission()) {
      return Arguments.createArray()
    }

    val context = reactApplicationContext
    val usageStatsManager =
        context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
            ?: return Arguments.createArray()

    val packageManager = context.packageManager
    val endTime = System.currentTimeMillis()
    val startTime = endTime - USAGE_WINDOW_MS

    val stats =
        usageStatsManager.queryUsageStats(
            UsageStatsManager.INTERVAL_DAILY,
            startTime,
            endTime,
        )

    if (stats.isNullOrEmpty()) {
      return Arguments.createArray()
    }

    return stats
        .filter { it.foregroundTimeMs() > 0 }
        .mapNotNull { usageStat ->
          try {
            val appInfo = packageManager.getApplicationInfo(usageStat.packageName, 0)
            val appName = packageManager.getApplicationLabel(appInfo).toString()
            AppUsageInfo(
                packageName = usageStat.packageName,
                appName = appName,
                category = getCategoryName(appInfo),
                appImage = getAppIconBase64(usageStat.packageName),
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

  private fun hasQueryAllPackagesPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
      return true
    }

    return reactApplicationContext.checkSelfPermission(Manifest.permission.QUERY_ALL_PACKAGES) ==
        PackageManager.PERMISSION_GRANTED
  }

  private fun hasSystemAlertWindowPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return true
    }

    val context = reactApplicationContext
    if (!Settings.canDrawOverlays(context)) {
      return false
    }

    return isSystemAlertWindowOpAllowed(context)
  }

  private fun isSystemAlertWindowOpAllowed(context: Context): Boolean {
    val appOps = context.getSystemService(AppOpsManager::class.java) ?: return true
    val mode =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          appOps.unsafeCheckOpNoThrow(
              AppOpsManager.OPSTR_SYSTEM_ALERT_WINDOW,
              Process.myUid(),
              context.packageName,
          )
        } else {
          @Suppress("DEPRECATION")
          appOps.checkOpNoThrow(
              AppOpsManager.OPSTR_SYSTEM_ALERT_WINDOW,
              Process.myUid(),
              context.packageName,
          )
        }
    return mode == AppOpsManager.MODE_ALLOWED
  }

  private fun hasNotificationsPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
      return true
    }

    return ContextCompat.checkSelfPermission(
        reactApplicationContext,
        Manifest.permission.POST_NOTIFICATIONS,
    ) == PackageManager.PERMISSION_GRANTED
  }

  private fun hasIgnoreBatteryOptimizationsPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
      return true
    }

    val powerManager =
        reactApplicationContext.getSystemService(Context.POWER_SERVICE) as? PowerManager
            ?: return false
    return powerManager.isIgnoringBatteryOptimizations(reactApplicationContext.packageName)
  }

  private fun openNotificationSettings() {
    val context = reactApplicationContext
    val intent =
        Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
          putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
          flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }

    context.startActivity(intent)
  }

  private fun hasUsageStatsPermission(): Boolean {
    val context = reactApplicationContext
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

  private fun getAppIconBase64(packageName: String): String {
    return try {
      val packageManager = reactApplicationContext.packageManager
      val drawable = packageManager.getApplicationIcon(packageName)
      val bitmap = drawable.toBitmap()
      val scaled =
          Bitmap.createScaledBitmap(bitmap, ICON_SIZE_PX, ICON_SIZE_PX, true).also {
            if (it !== bitmap) {
              bitmap.recycle()
            }
          }

      ByteArrayOutputStream().use { stream ->
        scaled.compress(Bitmap.CompressFormat.PNG, 100, stream)
        if (scaled !== bitmap) {
          scaled.recycle()
        }
        val encoded = Base64.encodeToString(stream.toByteArray(), Base64.NO_WRAP)
        "data:image/png;base64,$encoded"
      }
    } catch (_: Exception) {
      ""
    }
  }

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

  companion object {
    const val NAME = NativeUsageStatsSpec.NAME
    private const val REQUEST_CODE_POST_NOTIFICATIONS = 1001
  }
}
