package com.focusguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import com.focusguard.monitor.MonitoringBootResumeNotifier
import com.focusguard.monitor.MonitoringBootResumeStore
import com.focusguard.monitor.MonitoringStateRepository
import com.focusguard.monitor.MonitorServiceHelper
import com.focusguard.widget.WidgetUpdater

/**
 * Restarts [FocusGuardMonitorService][com.focusguard.service.FocusGuardMonitorService]
 * after the device reboots.
 *
 * Requires `RECEIVE_BOOT_COMPLETED` declared in the manifest and the corresponding
 * `<receiver>` entry with an `ACTION_BOOT_COMPLETED` intent filter.
 */
class BootCompletedReceiver : BroadcastReceiver() {

  /**
   * Called by the system when a broadcast is received.
   * Ignores any action other than [Intent.ACTION_BOOT_COMPLETED] and delegates
   * service startup to [MonitorServiceHelper], which performs its own permission checks.
   */
  override fun onReceive(context: Context, intent: Intent?) {
    when (intent?.action) {
      Intent.ACTION_BOOT_COMPLETED -> {
        WidgetUpdater.scheduleUpdate(context.applicationContext, force = true)

        if (!MonitoringStateRepository.isMonitoringEnabled()) {
          return
        }

        // Android 14+ blocks special-use FGS starts from BOOT_COMPLETED.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
          MonitoringBootResumeStore.markPending()
          MonitoringBootResumeNotifier.notifyResumePending(context.applicationContext)
          return
        }

        MonitorServiceHelper.start(context.applicationContext)
      }
      Intent.ACTION_MY_PACKAGE_REPLACED -> {
        WidgetUpdater.scheduleUpdate(context.applicationContext, force = true)

        if (!MonitoringStateRepository.isMonitoringEnabled()) {
          return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
          MonitoringBootResumeStore.markPending()
          MonitoringBootResumeNotifier.notifyResumePending(context.applicationContext)
          return
        }

        MonitorServiceHelper.start(context.applicationContext)
      }
    }
  }
}
