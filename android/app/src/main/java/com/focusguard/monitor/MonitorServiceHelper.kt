package com.focusguard.monitor

import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
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
  fun start(context: Context) {
    if (!MonitorPermissions.canRunMonitorService(context)) {
      return
    }

    val intent = Intent(context, FocusGuardMonitorService::class.java)
    ContextCompat.startForegroundService(context, intent)
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
