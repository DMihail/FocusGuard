package com.focusguard.monitor

import android.content.Context
import com.focusguard.react.TurboModuleEventDispatchers
import kotlin.math.abs

/** Throttles tracked-usage change signals to JS while the monitor service is active. */
internal object TrackedUsageChangeEmitter {
    private const val MIN_EMIT_INTERVAL_MS = 2_000L
    private const val USAGE_DELTA_THRESHOLD_MS = 1_000L

    @Volatile
    private var lastEmittedAtMs = 0L

    private val lastEmittedUsageByPackage = mutableMapOf<String, Long>()

    fun maybeEmit(
        context: Context,
        usageByPackage: Map<String, Long>,
        urgent: Boolean = false,
    ) {
        if (usageByPackage.isEmpty()) {
            return
        }

        val now = System.currentTimeMillis()
        val hasMeaningfulChange =
            usageByPackage.any { (packageName, usageMs) ->
                abs(usageMs - (lastEmittedUsageByPackage[packageName] ?: 0L)) >=
                    USAGE_DELTA_THRESHOLD_MS
            }

        if (!urgent && !hasMeaningfulChange) {
            return
        }

        if (!urgent && now - lastEmittedAtMs < MIN_EMIT_INTERVAL_MS) {
            return
        }

        lastEmittedAtMs = now
        lastEmittedUsageByPackage.clear()
        lastEmittedUsageByPackage.putAll(usageByPackage)
        TurboModuleEventDispatchers.emitTrackedUsageChanged(context)
    }

    /** @internal Unit-test reset. */
    internal fun resetForTests() {
        lastEmittedAtMs = 0L
        lastEmittedUsageByPackage.clear()
    }

    fun onLocalDayChanged() {
        lastEmittedAtMs = 0L
        lastEmittedUsageByPackage.clear()
    }
}
