package com.focusguard.monitor

import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import com.focusguard.service.FocusGuardMonitorService

object MonitorServiceHelper {
  fun start(context: Context) {
    if (!MonitorPermissions.canRunMonitorService(context)) {
      return
    }

    val intent = Intent(context, FocusGuardMonitorService::class.java)
    ContextCompat.startForegroundService(context, intent)
  }

  fun stop(context: Context) {
    context.stopService(Intent(context, FocusGuardMonitorService::class.java))
  }
}
