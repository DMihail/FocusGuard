package com.focusguard.monitor

import org.junit.Assert.assertEquals
import org.junit.Test

class TrackingEnginePollTest {
    @Test
    fun `uses active interval for tracked foreground app`() {
        val interval =
            TrackingEnginePoll.resolveIntervalMs(
                activeBlockPackage = null,
                stableForeground = "com.tracked",
                trackedApps = setOf("com.tracked"),
            )

        assertEquals(TrackingEnginePoll.ACTIVE_MS, interval)
    }

    @Test
    fun `uses active interval while block overlay is active`() {
        val interval =
            TrackingEnginePoll.resolveIntervalMs(
                activeBlockPackage = "com.blocked",
                stableForeground = null,
                trackedApps = emptySet(),
            )

        assertEquals(TrackingEnginePoll.ACTIVE_MS, interval)
    }

    @Test
    fun `uses active interval while foreground switch is debouncing`() {
        val interval =
            TrackingEnginePoll.resolveIntervalMs(
                activeBlockPackage = null,
                stableForeground = "com.old",
                trackedApps = setOf("com.tracked"),
                pendingForegroundSwitch = true,
            )

        assertEquals(TrackingEnginePoll.ACTIVE_MS, interval)
    }

    @Test
    fun `uses idle interval when foreground is untracked`() {
        val interval =
            TrackingEnginePoll.resolveIntervalMs(
                activeBlockPackage = null,
                stableForeground = "com.other",
                trackedApps = setOf("com.tracked"),
            )

        assertEquals(TrackingEnginePoll.IDLE_MS, interval)
    }
}
