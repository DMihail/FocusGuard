package com.focusguard.permissions

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.app.ActivityCompat
import com.focusguard.accessibility.AccessibilityAccess
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.monitor.OverlayAccess
import com.focusguard.monitor.UsageAccess

/** Opens system screens and runtime dialogs for granting permissions. */
internal class PermissionRequester(
    private val context: Context,
    private val activityProvider: () -> Activity?,
) {

    fun requestUsageAccess() {
        UsageAccess.openSettings(context)
    }

    fun requestOverlayAccess() {
        UsageAccess.pinGrantBeforeOtherPermissionSettings(context)
        OverlayAccess.openSettings(context, activityProvider())
    }

    fun requestNotifications() {
        UsageAccess.pinGrantBeforeOtherPermissionSettings(context)

        if (NotificationPermissions.hasPostNotificationsPermission(context)) {
            return
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val activity = activityProvider()
            if (activity != null) {
                ActivityCompat.requestPermissions(
                    activity,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    NotificationPermission.REQUEST_CODE_POST_NOTIFICATIONS,
                )
                return
            }
        }

        openNotificationSettings()
    }

    fun openNotificationSettings() {
        val intent =
            Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
                putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
            }
        ActivityIntents.start(context, intent, activityProvider())
    }

    fun requestBatteryOptimizationExemption() {
        UsageAccess.pinGrantBeforeOtherPermissionSettings(context)

        if (BatteryOptimizationAccess.isExempt(context)) {
            return
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return
        }

        val packageUri = Uri.parse("package:${context.packageName}")
        val intents =
            listOf(
                Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                    data = packageUri
                },
                Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS),
            )

        ActivityIntents.startFirstAvailable(context, intents, activityProvider())
    }

    fun requestAccessibilityService() {
        UsageAccess.pinGrantBeforeOtherPermissionSettings(context)

        if (AccessibilityAccess.isEnabled(context)) {
            return
        }

        AccessibilityAccess.openSettings(context)
    }

    fun openAccessibilityServiceSettings() {
        UsageAccess.pinGrantBeforeOtherPermissionSettings(context)
        AccessibilityAccess.openSettingsScreen(context)
    }
}
