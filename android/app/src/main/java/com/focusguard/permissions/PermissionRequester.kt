package com.focusguard.permissions

import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.app.ActivityCompat
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.monitor.OverlayAccess
import com.focusguard.monitor.UsageAccess

/** Facade for permission checks exposed to the React Native Turbo Module. */
internal object PermissionChecker {

    fun hasUsageAccess(context: Context): Boolean = UsageAccess.hasAccess(context)

    fun hasOverlayAccess(context: Context): Boolean = OverlayAccess.hasAccess(context)

    fun hasNotificationsPermission(context: Context): Boolean =
        NotificationPermissions.hasPostNotificationsPermission(context)

    fun hasBatteryOptimizationExemption(context: Context): Boolean =
        BatteryOptimizationAccess.isExempt(context)

    fun hasQueryAllPackages(context: Context): Boolean = QueryAllPackagesAccess.isGranted(context)
}

/** Opens system screens and runtime dialogs for granting permissions. */
internal class PermissionRequester(
    private val context: Context,
    private val activityProvider: () -> Activity?,
) {

    fun requestUsageAccess() {
        UsageAccess.openSettings(context)
    }

    fun requestOverlayAccess() {
        OverlayAccess.openSettings(context, activityProvider())
    }

    fun requestNotifications() {
        if (PermissionChecker.hasNotificationsPermission(context)) {
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
}
