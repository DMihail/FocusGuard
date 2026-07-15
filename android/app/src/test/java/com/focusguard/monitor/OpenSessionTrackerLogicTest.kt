package com.focusguard.monitor

import android.app.usage.UsageEvents
import android.os.Build
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Documents open-session pairing rules used by [OpenSessionTracker].
 * Full integration relies on Robolectric UsageStatsManager in device tests.
 */
class OpenSessionTrackerLogicTest {
    @Test
    fun `foreground start and end events define open session window`() {
        assertTrue(isForegroundStart(UsageEvents.Event.ACTIVITY_RESUMED))
        assertTrue(isForegroundEnd(UsageEvents.Event.ACTIVITY_PAUSED))
    }

    @Suppress("DEPRECATION")
    private fun isForegroundStart(eventType: Int): Boolean =
        eventType == UsageEvents.Event.MOVE_TO_FOREGROUND ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
                eventType == UsageEvents.Event.ACTIVITY_RESUMED)

    @Suppress("DEPRECATION")
    private fun isForegroundEnd(eventType: Int): Boolean =
        eventType == UsageEvents.Event.MOVE_TO_BACKGROUND ||
            (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
                eventType == UsageEvents.Event.ACTIVITY_PAUSED)

    @Test
    fun `stable polls default is two`() {
        assertEquals(2, ForegroundStabilizer.STABLE_POLLS)
    }
}
