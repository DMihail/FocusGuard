package com.focusguard.monitor

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.focusguard.R
import com.focusguard.navigation.DeepLinks

/** Prompts the user to open Keept when boot-time FGS start is blocked (API 34+). */
internal object MonitoringBootResumeNotifier {

    private const val CHANNEL_ID = "keept_boot_resume"
    private const val NOTIFICATION_ID = 1002

    fun notifyResumePending(context: Context) {
        val appContext = context.applicationContext
        val notificationManager =
            appContext.getSystemService(NotificationManager::class.java) ?: return

        ensureChannel(appContext, notificationManager)

        val contentIntent =
            DeepLinks.activityPendingIntent(
                appContext,
                DeepLinks.dashboardIntent(appContext),
                NOTIFICATION_ID,
            )

        val notification =
            NotificationCompat.Builder(appContext, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_keept)
                .setColor(ContextCompat.getColor(appContext, R.color.surface))
                .setContentTitle(appContext.getString(R.string.boot_resume_notification_title))
                .setContentText(appContext.getString(R.string.boot_resume_notification_text))
                .setStyle(
                    NotificationCompat.BigTextStyle()
                        .bigText(appContext.getString(R.string.boot_resume_notification_details)),
                )
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_REMINDER)
                .setAutoCancel(true)
                .setContentIntent(contentIntent)
                .build()

        notificationManager.notify(NOTIFICATION_ID, notification)
    }

    fun cancel(context: Context) {
        val notificationManager =
            context.applicationContext.getSystemService(NotificationManager::class.java) ?: return
        notificationManager.cancel(NOTIFICATION_ID)
    }

    private fun ensureChannel(context: Context, notificationManager: NotificationManager) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return
        }

        val channel =
            NotificationChannel(
                CHANNEL_ID,
                context.getString(R.string.boot_resume_notification_channel_name),
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = context.getString(R.string.boot_resume_notification_channel_description)
            }

        notificationManager.createNotificationChannel(channel)
    }
}
