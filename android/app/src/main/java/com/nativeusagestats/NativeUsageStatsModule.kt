package com.nativeusagestats

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import android.os.Handler
import android.os.Looper
import com.focusguard.DailyUsageRepository
import com.focusguard.apps.InstalledAppsRepository
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.MonitorServiceHelper
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.monitor.OverlayAccess
import com.focusguard.monitor.UsageAccess
import com.focusguard.permissions.BatteryOptimizationAccess
import com.focusguard.permissions.PermissionRequester
import com.focusguard.platform.AppInfo
import com.focusguard.react.PermissionsChangedDispatcher
import com.focusguard.react.ReactNativeMappers
import com.focusguard.storage.NativeTrackingSnapshot
import java.util.concurrent.Executors

/** Codegen Turbo Module — thin bridge over the FocusGuard Android domain layer. */
class NativeUsageStatsModule(
    reactContext: ReactApplicationContext,
) : NativeUsageStatsSpec(reactContext) {

  private val appContext = reactContext.applicationContext
  private val permissionRequester =
      PermissionRequester(appContext) { reactApplicationContext.currentActivity }
  private val installedAppsRepository = InstalledAppsRepository(appContext)
  private val dailyUsageRepository = DailyUsageRepository(appContext)
  private val ioExecutor = Executors.newSingleThreadExecutor()
  private val mainHandler = Handler(Looper.getMainLooper())
  private val permissionsRecheckDelaysMs = longArrayOf(0L, 400L, 1_200L)
  private var permissionsRecheckGeneration = 0

  private val emitPermissionsChangedCallback = { emitPermissionsChanged() }
  private val permissionsLifecycleListener =
      object : LifecycleEventListener {
        override fun onHostResume() {
          val generation = ++permissionsRecheckGeneration

          for (delayMs in permissionsRecheckDelaysMs) {
            mainHandler.postDelayed(
                {
                  if (generation == permissionsRecheckGeneration) {
                    emitPermissionsChanged()
                  }
                },
                delayMs,
              )
          }
        }

        override fun onHostPause() {
          permissionsRecheckGeneration += 1
        }

        override fun onHostDestroy() {
          permissionsRecheckGeneration += 1
        }
      }

  init {
    PermissionsChangedDispatcher.register(emitPermissionsChangedCallback)
    reactApplicationContext.addLifecycleEventListener(permissionsLifecycleListener)
  }

  override fun invalidate() {
    permissionsRecheckGeneration += 1
    mainHandler.removeCallbacksAndMessages(null)
    PermissionsChangedDispatcher.unregister(emitPermissionsChangedCallback)
    reactApplicationContext.removeLifecycleEventListener(permissionsLifecycleListener)
    ioExecutor.shutdown()
    super.invalidate()
  }

  override fun checkForPermission(): Boolean = UsageAccess.hasAccess(appContext)

  override fun checkForSystemAlertWindowPermission(): Boolean = OverlayAccess.hasAccess(appContext)

  override fun checkForNotificationsPermission(): Boolean =
      NotificationPermissions.hasPostNotificationsPermission(appContext)

  override fun checkForIgnoreBatteryOptimizationsPermission(): Boolean =
      BatteryOptimizationAccess.isExempt(appContext)

  override fun checkForManifestMonitorPermissions(): Boolean =
      MonitorPermissions.hasManifestMonitorPermissions(appContext)

  override fun startMonitorService(): WritableMap =
      MonitorServiceHelper.start(appContext).toWritableMap()

  override fun stopMonitorService() {
    MonitorServiceHelper.stop(appContext)
  }

  override fun isMonitorServiceRunning(): Boolean = MonitorServiceHelper.isRunning()

  override fun requestUsageStatsPermission() {
    permissionRequester.requestUsageAccess()
  }

  override fun requestSystemAlertWindowPermission() {
    permissionRequester.requestOverlayAccess()
  }

  override fun requestNotificationsPermission() {
    permissionRequester.requestNotifications()
  }

  override fun openNotificationsSettings() {
    permissionRequester.openNotificationSettings()
  }

  override fun requestIgnoreBatteryOptimizationsPermission() {
    permissionRequester.requestBatteryOptimizationExemption()
  }

  override fun getInstalledApplications(promise: Promise) {
    ioExecutor.execute {
      try {
        val apps = installedAppsRepository.getLaunchableApps()
        promise.resolve(ReactNativeMappers.toInstalledAppsArray(apps))
      } catch (error: Exception) {
        promise.reject("installed_apps_failed", error.message, error)
      }
    }
  }

  override fun getPackagesUsageToday(packageNames: ReadableArray, promise: Promise) {
    ioExecutor.execute {
      try {
        val requestedPackages =
            (0 until packageNames.size())
                .mapNotNull { index -> packageNames.getString(index)?.takeIf { it.isNotEmpty() } }

        promise.resolve(
            ReactNativeMappers.toPackageUsageArray(
                dailyUsageRepository.getTodayForegroundMsForPackages(requestedPackages),
            ),
        )
      } catch (error: Exception) {
        promise.reject("usage_stats_failed", error.message, error)
      }
    }
  }

  override fun getAppDisplayName(): String = AppInfo.getDisplayName(appContext)

  override fun getAppVersion(): String = AppInfo.getVersionName()

  override fun invalidateNativeCatalogCaches() {
    installedAppsRepository.invalidateCache()
    dailyUsageRepository.invalidateCache()
  }

  override fun syncTrackingConfig(snapshotJson: String) {
    NativeTrackingSnapshot.write(snapshotJson)
  }

  override fun requestScreenTimeAuthorization(promise: Promise) {
    promise.resolve(false)
  }

  override fun presentFamilyActivityPicker(promise: Promise) {
    promise.resolve(Arguments.createArray())
  }

  private fun emitPermissionsChanged() {
    reactApplicationContext.runOnUiQueueThread {
      if (reactApplicationContext.hasActiveReactInstance()) {
        emitOnPermissionsChanged(
            Arguments.createMap().apply {
              putDouble("changedAtMs", System.currentTimeMillis().toDouble())
            },
        )
      }
    }
  }

  companion object {
    const val NAME = NativeUsageStatsSpec.NAME
  }
}
