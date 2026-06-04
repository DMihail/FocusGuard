package com.focusguard.navigation

import android.app.PendingIntent
import android.content.Context
import android.os.Build

/** Pending intents that open the app via [DeepLinks] for React Navigation linking. */
object NotificationNavigation {

    private const val REQUEST_CODE_DASHBOARD = 3001
    private const val REQUEST_CODE_CONFIGURE_LIMITS = 3002

    fun dashboardTapIntent(context: Context): PendingIntent =
        activityPendingIntent(
            context,
            REQUEST_CODE_DASHBOARD,
            DeepLinks.dashboardIntent(context),
        )

    fun configureLimitsTapIntent(context: Context, packageName: String): PendingIntent =
        activityPendingIntent(
            context,
            REQUEST_CODE_CONFIGURE_LIMITS + (packageName.hashCode() and 0xFFF),
            DeepLinks.configureIntent(context, packageName),
        )

    private fun activityPendingIntent(
        context: Context,
        requestCode: Int,
        intent: android.content.Intent,
    ): PendingIntent {
        val flags =
            PendingIntent.FLAG_UPDATE_CURRENT or
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PendingIntent.FLAG_IMMUTABLE
                } else {
                    0
                }

        return PendingIntent.getActivity(context, requestCode, intent, flags)
    }
}
