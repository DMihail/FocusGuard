package com.focusguard.usage

import android.content.Context
import com.focusguard.DailyUsageRepository
import com.focusguard.overlay.DailyWarningStore
import com.focusguard.react.TurboModuleEventDispatchers
import com.focusguard.storage.KeeptStorage
import com.focusguard.storage.PersistSchema

/** Detects local day rollovers and notifies JS through [TurboModuleEventDispatchers]. */
object LocalDayChangeNotifier {
    @Volatile
    private var lastNotifiedDayKey: String? = null

    private val mmkv get() = KeeptStorage.mmkv

    fun checkAndNotify(context: Context) {
        notifyIfDayChanged(context, getLocalDayKey())
    }

    fun onMidnightAlarm(context: Context) {
        notifyIfDayChanged(context, getLocalDayKey())
    }

    /** @internal Unit-test reset. */
    internal fun resetForTests() {
        lastNotifiedDayKey = null
        mmkv.removeValueForKey(PersistSchema.LAST_LOCAL_DAY_KEY)
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
        DailyWarningStore.pruneStaleKeys()
        TurboModuleEventDispatchers.emitLocalDayChanged(context, dayKey)
    }
}
