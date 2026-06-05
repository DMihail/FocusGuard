package com.focusguard.monitor

import android.app.Activity
import android.app.AppOpsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.focusguard.permissions.ActivityIntents

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

    fun openSettings(context: Context, activity: Activity? = null) {
        if (hasAccess(context) || Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return
        }

        val intent =
            Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${context.packageName}"),
            )
        ActivityIntents.start(context, intent, activity)
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
