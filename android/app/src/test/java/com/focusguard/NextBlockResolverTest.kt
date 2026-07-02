package com.focusguard

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class NextBlockResolverTest {
    @Test
    fun `resolveAppBlockState returns under limit when usage is below hard block`() {
        val state =
            NextBlockResolver.resolveAppBlockState(
                usedMs = 30 * 60_000L,
                hardBlockThresholdMs = 60 * 60_000L,
                snoozeRemainingMs = 0L,
            )

        assertEquals(NextBlockResolver.AppBlockState.UnderLimit(30 * 60_000L), state)
    }

    @Test
    fun `resolveAppBlockState returns snooze countdown when over limit but snoozed`() {
        val state =
            NextBlockResolver.resolveAppBlockState(
                usedMs = 70 * 60_000L,
                hardBlockThresholdMs = 60 * 60_000L,
                snoozeRemainingMs = 5 * 60_000L,
            )

        assertEquals(NextBlockResolver.AppBlockState.SnoozeCountdown(5 * 60_000L), state)
    }

    @Test
    fun `resolveAppBlockState returns hard blocked when over limit and not snoozed`() {
        val state =
            NextBlockResolver.resolveAppBlockState(
                usedMs = 70 * 60_000L,
                hardBlockThresholdMs = 60 * 60_000L,
                snoozeRemainingMs = 0L,
            )

        assertEquals(NextBlockResolver.AppBlockState.HardBlocked, state)
    }

    @Test
    fun `findNearestNextBlock picks the smallest remaining time`() {
        val hardBlockMs = 60 * 60_000L
        val (nearest, blockedLabel) =
            NextBlockResolver.findNearestNextBlock(
                trackedApps = listOf("com.one", "com.two"),
                usedMsFor = { packageName ->
                    when (packageName) {
                        "com.one" -> 50 * 60_000L
                        else -> 20 * 60_000L
                    }
                },
                labelFor = { packageName ->
                    when (packageName) {
                        "com.one" -> "One"
                        else -> "Two"
                    }
                },
                blockStateFor = { _, usedMs ->
                    NextBlockResolver.resolveAppBlockState(
                        usedMs = usedMs,
                        hardBlockThresholdMs = hardBlockMs,
                        snoozeRemainingMs = 0L,
                    )
                },
            )

        assertNull(blockedLabel)
        assertEquals("com.one", nearest?.packageName)
        assertEquals("One", nearest?.appLabel)
        assertEquals(10 * 60_000L, nearest?.remainingMs)
        assertEquals(false, nearest?.isSnoozeCountdown)
    }

    @Test
    fun `findNearestNextBlock reports blocked label when every app is hard blocked`() {
        val (nearest, blockedLabel) =
            NextBlockResolver.findNearestNextBlock(
                trackedApps = listOf("com.one"),
                usedMsFor = { 120 * 60_000L },
                labelFor = { "Blocked App" },
                blockStateFor = { _, usedMs ->
                    NextBlockResolver.resolveAppBlockState(
                        usedMs = usedMs,
                        hardBlockThresholdMs = 60 * 60_000L,
                        snoozeRemainingMs = 0L,
                    )
                },
            )

        assertNull(nearest)
        assertEquals("Blocked App", blockedLabel)
    }
}
