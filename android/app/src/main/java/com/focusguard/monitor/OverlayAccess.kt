package com.focusguard.monitor

import android.app.AppOpsManager
import android.content.Context
import android.os.Build
import android.os.Process
import android.provider.Settings

/** Checks whether the app may draw over other apps (block overlay). */
object OverlayAccess {

    fun hasAccess(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return true
        }

        if (!Settings.canDrawOverlays(context)) {
            return false
        }

        return isSystemAlertWindowOpAllowed(context)
    }

    private fun isSystemAlertWindowOpAllowed(context: Context): Boolean {
        val appOps = context.getSystemService(AppOpsManager::class.java) ?: return true
        val mode =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                appOps.unsafeCheckOpNoThrow(
                    AppOpsManager.OPSTR_SYSTEM_ALERT_WINDOW,
                    Process.myUid(),
                    context.packageName,
                )
            } else {
                @Suppress("DEPRECATION")
                appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_SYSTEM_ALERT_WINDOW,
                    Process.myUid(),
                    context.packageName,
                )
            }
        return mode == AppOpsManager.MODE_ALLOWED
    }
}
