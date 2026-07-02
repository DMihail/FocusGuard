package com.focusguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.focusguard.usage.LocalDayChangeNotifier
import com.focusguard.usage.LocalDayChangeScheduler

/** Reschedules the midnight alarm when the device timezone changes. */
class TimeZoneChangedReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action != Intent.ACTION_TIMEZONE_CHANGED) {
            return
        }

        val appContext = context.applicationContext
        LocalDayChangeScheduler.schedule(appContext)
        LocalDayChangeNotifier.checkAndNotify(appContext)
    }
}
