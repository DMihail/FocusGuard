package com.focusguard.usage

import android.app.usage.UsageEvents
import android.os.Build

/** Shared UsageEvents type checks (legacy MOVE_* + Q+ ACTIVITY_*). */
internal object UsageEventTypes {

    @Suppress("DEPRECATION")
    fun isForegroundStart(eventType: Int): Boolean =
        eventType == UsageEvents.Event.MOVE_TO_FOREGROUND ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
                eventType == UsageEvents.Event.ACTIVITY_RESUMED)

    @Suppress("DEPRECATION")
    fun isForegroundEnd(eventType: Int): Boolean =
        eventType == UsageEvents.Event.MOVE_TO_BACKGROUND ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
                eventType == UsageEvents.Event.ACTIVITY_PAUSED)

    /** Event types for API 35+ `UsageEventsQuery` (caller must be @RequiresApi 35). */
    @Suppress("DEPRECATION")
    val FOREGROUND_START_EVENT_TYPES: IntArray =
        intArrayOf(
            UsageEvents.Event.MOVE_TO_FOREGROUND,
            UsageEvents.Event.ACTIVITY_RESUMED,
        )
}
