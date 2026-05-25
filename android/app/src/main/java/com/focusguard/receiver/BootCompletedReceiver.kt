package com.focusguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.focusguard.monitor.MonitorServiceHelper

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
    if (intent?.action != Intent.ACTION_BOOT_COMPLETED) {
      return
    }

    MonitorServiceHelper.start(context.applicationContext)
  }
}
