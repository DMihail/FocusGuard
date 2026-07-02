package com.focusguard.usage

import android.content.Context
import com.focusguard.DailyUsageRepository
import com.focusguard.react.TurboModuleEventDispatchers
import com.focusguard.storage.KeeptMmkv
import com.focusguard.storage.PersistSchema

/** Detects local day rollovers and notifies JS through [TurboModuleEventDispatchers]. */
object LocalDayChangeNotifier {
    @Volatile
    private var lastNotifiedDayKey: String? = null

    private val mmkv get() = KeeptMmkv.instance

    fun checkAndNotify(context: Context) {
        notifyIfDayChanged(context, getLocalDayKey())
    }

    fun onMidnightAlarm(context: Context) {
        notifyIfDayChanged(context, getLocalDayKey())
    }

    /** Called after JS receives [onLocalDayChanged]; advances the notified-day cursor. */
    fun markDayChangeNotified(dayKey: String) {
        lastNotifiedDayKey = dayKey
        writePersistedDayKey(dayKey)
    }

    private fun notifyIfDayChanged(context: Context, dayKey: String) {
        val previousDayKey = lastNotifiedDayKey ?: readPersistedDayKey()

        if (!shouldPublishLocalDayChange(previousDayKey, dayKey)) {
            if (previousDayKey == null) {
                markDayChangeNotified(dayKey)
            }
            return
        }

        publishDayChange(context, dayKey)
    }

    private fun readPersistedDayKey(): String? =
        mmkv.decodeString(PersistSchema.LAST_LOCAL_DAY_KEY, null)?.takeIf { dayKey -> dayKey.isNotEmpty() }

    private fun writePersistedDayKey(dayKey: String) {
        mmkv.encode(PersistSchema.LAST_LOCAL_DAY_KEY, dayKey)
    }

    private fun publishDayChange(context: Context, dayKey: String) {
        DailyUsageRepository.getInstance(context).invalidateCache()
        TurboModuleEventDispatchers.emitLocalDayChanged(context.applicationContext as android.app.Application, dayKey)
    }
}
