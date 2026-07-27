package com.focusguard.monitor

import android.app.usage.UsageEvents
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class OpenSessionTrackerTest {
    @Test
    fun `resume then pause closes session`() {
        @Suppress("DEPRECATION")
        val open =
            OpenSessionTracker.openPackagesFromEvents(
                listOf(
                    OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_FOREGROUND),
                    OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_BACKGROUND),
                ),
            )

        assertTrue(open.isEmpty())
    }

    @Test
    fun `multiple apps stay open until paused`() {
        @Suppress("DEPRECATION")
        val open =
            OpenSessionTracker.openPackagesFromEvents(
                listOf(
                    OpenSessionEvent("com.one", UsageEvents.Event.MOVE_TO_FOREGROUND),
                    OpenSessionEvent("com.two", UsageEvents.Event.MOVE_TO_FOREGROUND),
                    OpenSessionEvent("com.one", UsageEvents.Event.MOVE_TO_BACKGROUND),
                ),
            )

        assertEquals(setOf("com.two"), open)
    }
}
