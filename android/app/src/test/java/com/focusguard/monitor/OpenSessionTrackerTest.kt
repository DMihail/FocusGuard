package com.focusguard.monitor

import android.app.usage.UsageEvents
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class OpenSessionTrackerTest {
    private val t0 = 1_000_000L

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
                nowMs = t0,
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
                nowMs = t0,
            )

        assertEquals(setOf("com.two"), open)
    }

    @Test
    fun `sticky keeps package open across empty follow-up window`() {
        @Suppress("DEPRECATION")
        OpenSessionTracker.openPackagesFromEvents(
            listOf(OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_FOREGROUND)),
            nowMs = t0,
        )

        val stillOpen =
            OpenSessionTracker.openPackagesFromEvents(
                emptyList(),
                nowMs = t0 + 5 * 60_000L,
            )

        assertEquals(setOf("com.example.app"), stillOpen)
    }

    @Test
    fun `sticky clears when later window sees pause`() {
        @Suppress("DEPRECATION")
        OpenSessionTracker.openPackagesFromEvents(
            listOf(OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_FOREGROUND)),
            nowMs = t0,
        )

        @Suppress("DEPRECATION")
        val closed =
            OpenSessionTracker.openPackagesFromEvents(
                listOf(OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_BACKGROUND)),
                nowMs = t0 + 1_000L,
            )

        assertTrue(closed.isEmpty())
    }

    @Test
    fun `sticky expires after retain window without confirming start`() {
        @Suppress("DEPRECATION")
        OpenSessionTracker.openPackagesFromEvents(
            listOf(OpenSessionEvent("com.example.app", UsageEvents.Event.MOVE_TO_FOREGROUND)),
            nowMs = t0,
        )

        val expired =
            OpenSessionTracker.openPackagesFromEvents(
                emptyList(),
                nowMs = t0 + OpenSessionTracker.STICKY_RETAIN_MS + 1L,
            )

        assertTrue(expired.isEmpty())
    }
}
