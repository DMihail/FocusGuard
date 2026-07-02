package com.focusguard.usage

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.focusguard.receiver.LocalDayChangeReceiver

/** Schedules a single inexact alarm for the next local midnight. */
object LocalDayChangeScheduler {
    const val ACTION = "com.focusguard.action.LOCAL_DAY_CHANGED"
    private const val REQUEST_CODE = 7101

    fun schedule(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent =
            Intent(context, LocalDayChangeReceiver::class.java).apply {
                action = ACTION
            }
        val pendingIntent =
            PendingIntent.getBroadcast(
                context,
                REQUEST_CODE,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            )

        val triggerAtMs = System.currentTimeMillis() + getMsUntilNextLocalMidnight() + 50L
        alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMs, pendingIntent)
    }
}
