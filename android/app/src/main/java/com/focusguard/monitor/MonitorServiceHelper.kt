package com.focusguard.monitor

import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import com.focusguard.crashlytics.NativeErrorReporter
import com.focusguard.service.FocusGuardMonitorService

/** Single entry point for starting and stopping [FocusGuardMonitorService]. */
object MonitorServiceHelper {

  /**
   * Starts [FocusGuardMonitorService] as a foreground service.
   *
   * Silently returns without starting if the required permissions are not granted
   * (checked via [MonitorPermissions.canRunMonitorService]).
   * Uses [ContextCompat.startForegroundService] for compatibility with API 26+.
   */
  fun start(context: Context): MonitorServiceStartResult {
    MonitorPermissions.invalidateCache()
    val failureReason = MonitorPermissions.resolveStartFailureReason(context)

    if (failureReason != null) {
      return MonitorServiceStartResult(started = false, reason = failureReason)
    }

    val intent = Intent(context, FocusGuardMonitorService::class.java)

    return try {
      ContextCompat.startForegroundService(context, intent)
      MonitorServiceStartResult(started = true)
    } catch (error: android.app.ForegroundServiceStartNotAllowedException) {
      NativeErrorReporter.recordNonFatal(error, "MonitorServiceHelper.start.background_blocked")
      MonitorServiceStartResult(started = false, reason = "background_start_blocked")
    } catch (error: SecurityException) {
      NativeErrorReporter.recordNonFatal(error, "MonitorServiceHelper.start.security")
      MonitorServiceStartResult(started = false, reason = "background_start_blocked")
    }
  }

  /**
   * Stops [FocusGuardMonitorService].
   * The service's [onDestroy][FocusGuardMonitorService.onDestroy] will stop
   * the [TrackingEngine] and remove the foreground notification.
   */
  fun stop(context: Context) {
    val intent = Intent(context, FocusGuardMonitorService::class.java)
    context.stopService(intent)
  }

  fun isRunning(): Boolean = FocusGuardMonitorService.isRunning
}
