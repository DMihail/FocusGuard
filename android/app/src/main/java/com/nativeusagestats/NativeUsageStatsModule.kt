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
import com.focusguard.SettingsRepository
import com.focusguard.TrackingConfigRepository
import com.focusguard.apps.InstalledAppsRepository
import com.focusguard.monitor.MonitorPermissions
import com.focusguard.monitor.MonitorServiceHelper
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.monitor.OverlayAccess
import com.focusguard.monitor.UsageAccess
import com.focusguard.permissions.BatteryOptimizationAccess
import com.focusguard.permissions.PermissionRequester
import com.focusguard.platform.AppInfo
import com.focusguard.react.LocalDayChangeDispatcher
import com.focusguard.react.MonitorServiceStateDispatcher
import com.focusguard.react.PermissionsChangedDispatcher
import com.focusguard.react.ReactNativeMappers
import com.focusguard.storage.NativeTrackingSnapshot
import com.focusguard.widget.WidgetUpdater
import java.util.concurrent.Executors

/** Codegen Turbo Module — thin bridge over the FocusGuard Android domain layer. */
class NativeUsageStatsModule(
    reactContext: ReactApplicationContext,
) : NativeUsageStatsSpec(reactContext) {

  private val appContext = reactContext.applicationContext
  private val permissionRequester =
      PermissionRequester(appContext) { reactApplicationContext.currentActivity }
  private val installedAppsRepository = InstalledAppsRepository(appContext)
  private val dailyUsageRepository = DailyUsageRepository.getInstance(appContext)
  private val ioExecutor = Executors.newSingleThreadExecutor()
  private val mainHandler = Handler(Looper.getMainLooper())
  private val emitPermissionsChangedRunnable = Runnable { emitPermissionsChanged() }
  private val emitLocalDayChangedCallback = { dayKey: String -> emitLocalDayChanged(dayKey) }
  private val emitMonitorServiceStateCallback = { isRunning: Boolean ->
    emitMonitorServiceStateChanged(isRunning)
  }

  private val emitPermissionsChangedCallback = { schedulePermissionsChangedEmit() }
  private val permissionsLifecycleListener =
      object : LifecycleEventListener {
        override fun onHostResume() {
          schedulePermissionsChangedEmit()
        }

        override fun onHostPause() {
          mainHandler.removeCallbacks(emitPermissionsChangedRunnable)
        }

        override fun onHostDestroy() {
          mainHandler.removeCallbacks(emitPermissionsChangedRunnable)
        }
      }

  init {
    PermissionsChangedDispatcher.register(emitPermissionsChangedCallback)
    LocalDayChangeDispatcher.register(emitLocalDayChangedCallback)
    MonitorServiceStateDispatcher.register(emitMonitorServiceStateCallback)
    reactApplicationContext.addLifecycleEventListener(permissionsLifecycleListener)
  }

  override fun invalidate() {
    mainHandler.removeCallbacks(emitPermissionsChangedRunnable)
    PermissionsChangedDispatcher.unregister(emitPermissionsChangedCallback)
    LocalDayChangeDispatcher.unregister(emitLocalDayChangedCallback)
    MonitorServiceStateDispatcher.unregister(emitMonitorServiceStateCallback)
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
    TrackingConfigRepository.invalidateCache()
    SettingsRepository.invalidateCache()
    WidgetUpdater.scheduleUpdate(appContext, force = true)
  }

  override fun requestScreenTimeAuthorization(promise: Promise) {
    promise.resolve(false)
  }

  override fun presentFamilyActivityPicker(promise: Promise) {
    promise.resolve(Arguments.createArray())
  }

  private fun schedulePermissionsChangedEmit() {
    mainHandler.removeCallbacks(emitPermissionsChangedRunnable)
    mainHandler.postDelayed(emitPermissionsChangedRunnable, PERMISSIONS_CHANGED_DEBOUNCE_MS)
  }

  private fun emitPermissionsChanged() {
    MonitorPermissions.invalidateCache()
    reactApplicationContext.runOnUiQueueThread {
      if (!reactApplicationContext.hasActiveReactInstance()) {
        return@runOnUiQueueThread
      }

      runCatching {
        emitOnPermissionsChanged(
            Arguments.createMap().apply {
              putDouble("changedAtMs", System.currentTimeMillis().toDouble())
            },
        )
      }
    }
  }

  private fun emitLocalDayChanged(dayKey: String) {
    reactApplicationContext.runOnUiQueueThread {
      if (!reactApplicationContext.hasActiveReactInstance()) {
        return@runOnUiQueueThread
      }

      runCatching {
        emitOnLocalDayChanged(
            Arguments.createMap().apply {
              putString("dayKey", dayKey)
              putDouble("changedAtMs", System.currentTimeMillis().toDouble())
            },
        )
      }
    }
  }

  private fun emitMonitorServiceStateChanged(isRunning: Boolean) {
    reactApplicationContext.runOnUiQueueThread {
      if (!reactApplicationContext.hasActiveReactInstance()) {
        return@runOnUiQueueThread
      }

      runCatching {
        emitOnMonitorServiceStateChanged(
            Arguments.createMap().apply {
              putBoolean("isRunning", isRunning)
              putDouble("changedAtMs", System.currentTimeMillis().toDouble())
            },
        )
      }
    }
  }

  companion object {
    const val NAME = NativeUsageStatsSpec.NAME
    private const val PERMISSIONS_CHANGED_DEBOUNCE_MS = 300L
  }
}
