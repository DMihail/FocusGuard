package com.focusguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import com.focusguard.monitor.MonitoringBootResumeStore
import com.focusguard.monitor.MonitoringResume

/**
 * Attempts to resume monitoring after the user unlocks the device.
 *
 * Android 14+ blocks [specialUse][android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE]
 * FGS starts from [Intent.ACTION_BOOT_COMPLETED]; this receiver is a best-effort fallback.
 */
class UserUnlockedReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action != Intent.ACTION_USER_UNLOCKED) {
            return
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            return
        }

        if (!MonitoringBootResumeStore.hasPending()) {
            return
        }

        MonitoringResume.ensureRunning(context)
    }
}
