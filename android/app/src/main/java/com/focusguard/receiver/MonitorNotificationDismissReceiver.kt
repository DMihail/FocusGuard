package com.focusguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.focusguard.monitor.MonitorServiceHelper
import com.focusguard.monitor.MonitoringPreferences

/**
 * Invoked when the monitor foreground notification is dismissed (where the system allows it).
 * Stops monitoring and syncs [isMonitoring] to false in MMKV for the JS store.
 */
class MonitorNotificationDismissReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action != ACTION_DISMISS_MONITOR) {
            return
        }

        MonitoringPreferences.setMonitoringEnabled(false)
        MonitorServiceHelper.stop(context.applicationContext)
    }

    companion object {
        const val ACTION_DISMISS_MONITOR = "com.focusguard.action.DISMISS_MONITOR_NOTIFICATION"
    }
}
