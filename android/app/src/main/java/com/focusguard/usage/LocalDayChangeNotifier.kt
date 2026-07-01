package com.focusguard.usage

import android.content.Context
import com.focusguard.DailyUsageRepository
import com.focusguard.react.LocalDayChangeDispatcher

/** Detects local day rollovers and notifies JS through [LocalDayChangeDispatcher]. */
object LocalDayChangeNotifier {
    @Volatile
    private var lastDayKey: String? = null

    fun checkAndNotify(context: Context) {
        val dayKey = getLocalDayKey()
        val previousDayKey = lastDayKey
        lastDayKey = dayKey

        if (previousDayKey != null && previousDayKey != dayKey) {
            publishDayChange(context, dayKey)
        }
    }

    fun onMidnightAlarm(context: Context) {
        val dayKey = getLocalDayKey()
        lastDayKey = dayKey
        publishDayChange(context, dayKey)
    }

    private fun publishDayChange(context: Context, dayKey: String) {
        DailyUsageRepository.getInstance(context).invalidateCache()
        LocalDayChangeDispatcher.emit(context.applicationContext as android.app.Application, dayKey)
    }
}
