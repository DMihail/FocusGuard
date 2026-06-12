package com.nativeusagestats

import android.app.Application
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.focusguard.DailyUsageRepository
import com.focusguard.apps.InstalledAppsRepository
import com.focusguard.bridge.PermissionsLifecycleBinding
import com.focusguard.bridge.ReactBridgeMappers
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.MonitorServiceHelper
import com.focusguard.monitor.MonitorServiceStartResult
import com.focusguard.permissions.PermissionChecker
import com.facebook.react.ReactApplication
import com.focusguard.permissions.PermissionRequester
import com.focusguard.platform.AppInfo
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

  private val permissionsLifecycleBinding =
      PermissionsLifecycleBinding(::emitPermissionsChanged)

  init {
    activeInstance = this
    reactApplicationContext.addLifecycleEventListener(permissionsLifecycleBinding)
  }

  override fun invalidate() {
    if (activeInstance === this) {
      activeInstance = null
    }
    reactApplicationContext.removeLifecycleEventListener(permissionsLifecycleBinding)
    ioExecutor.shutdown()
    super.invalidate()
  }

  override fun checkForPermission(): Boolean = PermissionChecker.hasUsageAccess(appContext)

  override fun checkForSystemAlertWindowPermission(): Boolean =
      PermissionChecker.hasOverlayAccess(appContext)

  override fun checkForNotificationsPermission(): Boolean =
      PermissionChecker.hasNotificationsPermission(appContext)

  override fun checkForIgnoreBatteryOptimizationsPermission(): Boolean =
      PermissionChecker.hasBatteryOptimizationExemption(appContext)

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
        promise.resolve(ReactBridgeMappers.toInstalledAppsArray(apps))
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
            ReactBridgeMappers.toPackageUsageArray(
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

    @Volatile private var activeInstance: NativeUsageStatsModule? = null

    fun emitPermissionsChanged(application: Application) {
      val instance = activeInstance
      if (instance != null) {
        instance.emitPermissionsChanged()
        return
      }

      val reactContext =
          (application as? ReactApplication)?.reactHost?.currentReactContext ?: return

      if (!reactContext.hasActiveReactInstance()) {
        return
      }

      reactContext.runOnUiQueueThread {
        activeInstance?.emitPermissionsChanged()
      }
    }
  }
}
