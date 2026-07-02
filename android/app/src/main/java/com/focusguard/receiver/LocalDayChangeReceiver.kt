package com.focusguard.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.focusguard.usage.LocalDayChangeNotifier
import com.focusguard.usage.LocalDayChangeScheduler

/** Alarm callback that fires at local midnight while the app process is alive. */
class LocalDayChangeReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        if (intent?.action != LocalDayChangeScheduler.ACTION) {
            return
        }

        val appContext = context.applicationContext
        LocalDayChangeNotifier.onMidnightAlarm(appContext)
        LocalDayChangeScheduler.schedule(appContext)
    }
}
