package com.focusguard.monitor

import android.app.usage.UsageEvents
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class OpenSessionTrackerTest {
    @Test
    fun `resume then pause closes session`() {
        val open =
            OpenSessionTracker.openPackagesFromEvents(
                listOf(
                    OpenSessionEvent("com.example.app", UsageEvents.Event.ACTIVITY_RESUMED),
                    OpenSessionEvent("com.example.app", UsageEvents.Event.ACTIVITY_PAUSED),
                ),
            )

        assertTrue(open.isEmpty())
    }

    @Test
    fun `multiple apps stay open until paused`() {
        val open =
            OpenSessionTracker.openPackagesFromEvents(
                listOf(
                    OpenSessionEvent("com.one", UsageEvents.Event.ACTIVITY_RESUMED),
                    OpenSessionEvent("com.two", UsageEvents.Event.ACTIVITY_RESUMED),
                    OpenSessionEvent("com.one", UsageEvents.Event.ACTIVITY_PAUSED),
                ),
            )

        assertEquals(setOf("com.two"), open)
    }
}
