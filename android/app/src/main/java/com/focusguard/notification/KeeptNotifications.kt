package com.focusguard.notification

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.graphics.Bitmap
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import androidx.core.graphics.drawable.toBitmap
import com.focusguard.R

internal object KeeptNotifications {
    const val MONITOR_CHANNEL_ID = "keept_monitor"
    const val WARNING_CHANNEL_ID = "keept_warnings"
    const val BLOCK_CHANNEL_ID = "keept_blocks"

    private const val LARGE_ICON_SIZE_PX = 128

    fun ensureMonitorChannel(
        context: Context,
        notificationManager: NotificationManager,
    ) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val channel =
            NotificationChannel(
                MONITOR_CHANNEL_ID,
                context.getString(R.string.monitor_notification_channel_name),
                NotificationManager.IMPORTANCE_LOW,
            ).apply {
                description = context.getString(R.string.monitor_notification_channel_description)
                setShowBadge(false)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
                lightColor = ContextCompat.getColor(context, R.color.accent)
            }

        notificationManager.createNotificationChannel(channel)
    }

    fun ensureWarningChannel(
        context: Context,
        notificationManager: NotificationManager,
    ) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val channel =
            NotificationChannel(
                WARNING_CHANNEL_ID,
                context.getString(R.string.warning_notification_channel_name),
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = context.getString(R.string.warning_notification_channel_description)
                enableVibration(true)
                enableLights(true)
                lightColor = ContextCompat.getColor(context, R.color.surface)
            }

        notificationManager.createNotificationChannel(channel)
    }

    fun monitorBuilder(context: Context): NotificationCompat.Builder =
        brandBuilder(context, MONITOR_CHANNEL_ID)

    fun warningBuilder(context: Context): NotificationCompat.Builder =
        brandBuilder(context, WARNING_CHANNEL_ID).setLargeIcon(largeIcon(context))

    fun ensureBlockChannel(
        context: Context,
        notificationManager: NotificationManager,
    ) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val channel =
            NotificationChannel(
                BLOCK_CHANNEL_ID,
                context.getString(R.string.block_notification_channel_name),
                NotificationManager.IMPORTANCE_HIGH,
            ).apply {
                description = context.getString(R.string.block_notification_channel_description)
                enableVibration(true)
                enableLights(true)
                lightColor = ContextCompat.getColor(context, R.color.over_limit)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }

        notificationManager.createNotificationChannel(channel)
    }

    fun blockBuilder(context: Context): NotificationCompat.Builder =
        brandBuilder(context, BLOCK_CHANNEL_ID).setLargeIcon(largeIcon(context))

    private fun brandBuilder(
        context: Context,
        channelId: String,
    ): NotificationCompat.Builder =
        NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.drawable.ic_stat_keept)
            .setColor(ContextCompat.getColor(context, R.color.surface))

    private fun largeIcon(context: Context): Bitmap? =
        ContextCompat.getDrawable(context, R.mipmap.ic_launcher)?.toBitmap(
            LARGE_ICON_SIZE_PX,
            LARGE_ICON_SIZE_PX,
        )
}
