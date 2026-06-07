package com.nativeusagestats

import android.app.Application
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.focusguard.e2e.E2EAppState
import com.focusguard.e2e.E2ELaunchArgs
import com.focusguard.e2e.E2EPermissionOverride
import com.focusguard.apps.InstalledAppsRepository
import com.focusguard.apps.UsageStatsCatalogRepository
import com.focusguard.bridge.PermissionsLifecycleBinding
import com.focusguard.bridge.ReactBridgeMappers
import com.focusguard.DailyUsageRepository
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.MonitorServiceHelper
import com.focusguard.permissions.PermissionChecker
import com.focusguard.permissions.PermissionEventEmitter
import com.focusguard.permissions.PermissionRequester
import com.focusguard.platform.AppInfo

/**
 * Codegen Turbo Module — thin bridge over the FocusGuard Android domain layer.
 *
 * Business logic lives under [com.focusguard]; this class only wires RN calls to
 * repositories and permission helpers.
 */
class NativeUsageStatsModule(
    reactContext: ReactApplicationContext,
) : NativeUsageStatsSpec(reactContext) {

  private val appContext = reactContext.applicationContext
  private val permissionRequester =
      PermissionRequester(appContext) { reactApplicationContext.currentActivity }
  private val installedAppsRepository = InstalledAppsRepository(appContext)
  private val usageStatsCatalogRepository = UsageStatsCatalogRepository(appContext)
  private val dailyUsageRepository = DailyUsageRepository(appContext)

  private val permissionsLifecycleBinding =
      PermissionsLifecycleBinding(::emitPermissionsChanged)

  init {
    reactApplicationContext.addLifecycleEventListener(permissionsLifecycleBinding)
  }

  override fun invalidate() {
    reactApplicationContext.removeLifecycleEventListener(permissionsLifecycleBinding)
    super.invalidate()
  }

  override fun checkForPermission(): Boolean =
      if (E2EPermissionOverride.isActive()) true else PermissionChecker.hasUsageAccess(appContext)

  override fun checkForSystemAlertWindowPermission(): Boolean =
      if (E2EPermissionOverride.isActive()) true else PermissionChecker.hasOverlayAccess(appContext)

  override fun checkForNotificationsPermission(): Boolean =
      if (E2EPermissionOverride.isActive()) true else PermissionChecker.hasNotificationsPermission(appContext)

  override fun checkForIgnoreBatteryOptimizationsPermission(): Boolean =
      if (E2EPermissionOverride.isActive()) {
        true
      } else {
        PermissionChecker.hasBatteryOptimizationExemption(appContext)
      }

  override fun checkForManifestMonitorPermissions(): Boolean =
      if (E2EPermissionOverride.isActive()) true else MonitorPermissions.hasManifestMonitorPermissions(appContext)

  override fun startMonitorService() {
    MonitorServiceHelper.start(appContext)
  }

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

  override fun getInstalledApplications(): WritableArray {
    if (!PermissionChecker.hasQueryAllPackages(appContext)) {
      return ReactBridgeMappers.toInstalledAppsArray(
          emptyList<InstalledAppsRepository.InstalledApp>(),
      )
    }

    return ReactBridgeMappers.toInstalledAppsArray(installedAppsRepository.getLaunchableApps())
  }

  override fun getAppsUsageStats(): WritableArray =
      ReactBridgeMappers.toUsageStatsArray(usageStatsCatalogRepository.getTodayUsage())

  override fun getPackageUsageToday(packageName: String): Double =
      dailyUsageRepository.getTodayForegroundMs(packageName).toDouble()

  override fun getAppDisplayName(): String = AppInfo.getDisplayName(appContext)

  override fun getAppVersion(): String = AppInfo.getVersionName()

  override fun invalidateNativeCatalogCaches() {
    installedAppsRepository.invalidateCache()
    usageStatsCatalogRepository.invalidateCache()
    dailyUsageRepository.invalidateCache()
  }

  override fun getE2ELaunchArg(key: String): String? = E2ELaunchArgs.get(key)

  override fun configureE2EBootstrap(
      skipOnboarding: Boolean,
      permissionsGranted: Boolean,
      resetStorage: Boolean,
  ) {
    if (!com.focusguard.BuildConfig.DEBUG) {
      return
    }

    if (resetStorage) {
      E2EAppState.resetStorage()
    }

    if (skipOnboarding) {
      E2EAppState.setOnboardingComplete()
    }

    E2EPermissionOverride.permissionsGranted = permissionsGranted
  }

  private fun emitPermissionsChanged() {
    PermissionEventEmitter.emit(appContext as Application)
  }

  companion object {
    const val NAME = NativeUsageStatsSpec.NAME
  }
}
