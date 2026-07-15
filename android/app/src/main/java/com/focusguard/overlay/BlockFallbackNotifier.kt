package com.focusguard.overlay

import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import com.focusguard.R
import com.focusguard.monitor.NotificationPermissions
import com.focusguard.navigation.DeepLinks
import com.focusguard.notification.KeeptNotifications

/** Heads-up / full-screen-intent fallback when the block overlay is missing or PiP may bypass it. */
internal object BlockFallbackNotifier {
    private const val NOTIFICATION_ID_BASE = 3001
    private const val FULL_SCREEN_REQUEST_CODE_OFFSET = 10_000

    fun showPrimaryFallback(
        context: Context,
        packageName: String,
        appName: String,
        strictMode: Boolean,
    ) {
        postNotification(
            context = context,
            packageName = packageName,
            appName = appName,
            strictMode = strictMode,
            supplemental = false,
            useFullScreenIntent = true,
        )
    }

    /** One-time nudge when overlay is up but the tracked app session may still be visible (PiP / split-screen). */
    fun showSupplemental(
        context: Context,
        packageName: String,
        appName: String,
    ) {
        postNotification(
            context = context,
            packageName = packageName,
            appName = appName,
            strictMode = false,
            supplemental = true,
            useFullScreenIntent = false,
        )
    }

    fun dismiss(context: Context, packageName: String) {
        val notificationManager =
            context.applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.cancel(notificationId(packageName))
    }

    private fun postNotification(
        context: Context,
        packageName: String,
        appName: String,
        strictMode: Boolean,
        supplemental: Boolean,
        useFullScreenIntent: Boolean,
    ) {
        val appContext = context.applicationContext
        val notificationManager =
            appContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        KeeptNotifications.ensureBlockChannel(appContext, notificationManager)

        val notificationId = notificationId(packageName)
        val resolvedAppName = appName.ifEmpty { appContext.getString(R.string.app_name) }
        val summary =
            if (supplemental) {
                appContext.getString(R.string.block_notification_supplemental_text, resolvedAppName)
            } else {
                appContext.getString(R.string.block_notification_text, resolvedAppName)
            }
        val details =
            appContext.getString(R.string.block_notification_details, resolvedAppName)

        val contentIntent =
            DeepLinks.activityPendingIntent(
                appContext,
                DeepLinks.configureIntent(appContext, packageName),
                notificationId,
            )

        val builder =
            KeeptNotifications.blockBuilder(appContext)
                .setContentTitle(appContext.getString(R.string.block_notification_title))
                .setContentText(summary)
                .setStyle(
                    NotificationCompat.BigTextStyle()
                        .bigText(details)
                        .setSummaryText(appContext.getString(R.string.app_name)),
                )
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setAutoCancel(false)
                .setOngoing(true)
                .setContentIntent(contentIntent)
                .setDefaults(NotificationCompat.DEFAULT_ALL)

        if (useFullScreenIntent && NotificationPermissions.canUseFullScreenIntent(appContext)) {
            val fullScreenIntent =
                BlockFallbackActivity.createIntent(
                    appContext,
                    packageName,
                    resolvedAppName,
                    strictMode,
                )
            val fullScreenPendingIntent =
                DeepLinks.activityPendingIntent(
                    appContext,
                    fullScreenIntent,
                    notificationId + FULL_SCREEN_REQUEST_CODE_OFFSET,
                )
            builder.setFullScreenIntent(fullScreenPendingIntent, true)
        }

        notificationManager.notify(notificationId, builder.build())
    }

    private fun notificationId(packageName: String): Int =
        NOTIFICATION_ID_BASE + (packageName.hashCode() and 0x7FFF)
}
