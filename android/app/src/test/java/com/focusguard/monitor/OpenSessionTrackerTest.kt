package com.focusguard.monitor

import android.app.usage.UsageEvents
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class OpenSessionTrackerTest {
    @Before
    fun setUp() {
        OpenSessionTracker.clear()
    }

    @After
    fun tearDown() {
        OpenSessionTracker.clear()
    }

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

    @Test
    fun `sticky keeps package open across empty follow-up window`() {
        @Suppress("DEPRECATION")
        OpenSessionTracker.openPackagesFromEvents(
            listOf(OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_FOREGROUND)),
        )

        val stillOpen = OpenSessionTracker.openPackagesFromEvents(emptyList())

        assertEquals(setOf("com.example.app"), stillOpen)
    }

    @Test
    fun `sticky clears when later window sees pause`() {
        @Suppress("DEPRECATION")
        OpenSessionTracker.openPackagesFromEvents(
            listOf(OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_FOREGROUND)),
        )

        @Suppress("DEPRECATION")
        val closed =
            OpenSessionTracker.openPackagesFromEvents(
                listOf(OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_BACKGROUND)),
            )

        assertTrue(closed.isEmpty())
    }
}
