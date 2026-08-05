package com.focusguard.usage

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class DailyUsageAggregatorTest {
    private val dayStartMs = 1_000_000L
    private val packageName = "com.example.app"

    @Test
    fun `accumulator records a completed foreground session`() {
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                orphanSessionStartMs = dayStartMs,
            )

        accumulator.applyForegroundStart(packageName, dayStartMs + 1_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_000L)

        val state = accumulator.snapshot()

        assertEquals(3_000L, state.usageByPackage[packageName])
        assertEquals(emptyMap<String, Long>(), state.openSessionStartMs)
    }

    @Test
    fun `projectUsageAt extends an open session to endMs`() {
        val completed = mapOf(packageName to 2_000L)
        val openSessions = mapOf(packageName to dayStartMs + 5_000L)
        val endMs = dayStartMs + 8_000L

        val projected = DailyUsageAggregator.projectUsageAt(completed, openSessions, endMs)

        assertEquals(5_000L, projected[packageName])
    }

    @Test
    fun `incremental append closes an open session without replaying the full day`() {
        val priorOpen = mapOf(packageName to dayStartMs + 1_000L)
        val priorCompleted = emptyMap<String, Long>()

        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                orphanSessionStartMs = dayStartMs + 5_000L,
                initialCompleted = priorCompleted,
                initialOpenSessions = priorOpen,
            )
        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_000L)

        val state = accumulator.snapshot()

        assertEquals(3_000L, state.usageByPackage[packageName])
        assertEquals(emptyMap<String, Long>(), state.openSessionStartMs)
    }

    @Test
    fun `incremental append adds a new session after the cursor`() {
        val priorCompleted = mapOf(packageName to 1_000L)

        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                orphanSessionStartMs = dayStartMs + 5_000L,
                initialCompleted = priorCompleted,
            )
        accumulator.applyForegroundStart(packageName, dayStartMs + 6_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 9_000L)

        val state = accumulator.snapshot()

        assertEquals(4_000L, state.usageByPackage[packageName])
    }

    @Test
    fun `orphan end event uses scan start when no open session is tracked`() {
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                orphanSessionStartMs = dayStartMs + 2_000L,
            )

        accumulator.applyForegroundEnd(packageName, dayStartMs + 5_000L)

        assertEquals(3_000L, accumulator.snapshot().usageByPackage[packageName])
    }

    @Test
    fun `duplicate end after matched session does not orphan from day start`() {
        // ACTIVITY_PAUSED then MOVE_TO_BACKGROUND — classic Q+ dual emission.
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                orphanSessionStartMs = dayStartMs,
            )

        accumulator.applyForegroundStart(packageName, dayStartMs + 1_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_010L)

        val state = accumulator.snapshot()

        assertEquals(3_000L, state.usageByPackage[packageName])
        assertTrue(state.openSessionStartMs.isEmpty())
    }

    @Test
    fun `duplicate orphan end credits only once from day start`() {
        val sixteenHoursMs = 16L * 60L * 60L * 1_000L
        val endMs = dayStartMs + sixteenHoursMs

        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                orphanSessionStartMs = dayStartMs,
            )

        accumulator.applyForegroundEnd(packageName, endMs)
        accumulator.applyForegroundEnd(packageName, endMs + 10L)

        assertEquals(sixteenHoursMs, accumulator.snapshot().usageByPackage[packageName])
    }

    @Test
    fun `duplicate end after prior open session does not orphan from scan cursor`() {
        val scanFromMs = dayStartMs + 10_000L
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                orphanSessionStartMs = scanFromMs,
                initialOpenSessions = mapOf(packageName to dayStartMs + 1_000L),
            )

        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_010L)

        assertEquals(3_000L, accumulator.snapshot().usageByPackage[packageName])
    }

    @Test
    fun `new session after orphan end still records normally`() {
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                orphanSessionStartMs = dayStartMs,
            )

        accumulator.applyForegroundEnd(packageName, dayStartMs + 2_000L)
        accumulator.applyForegroundStart(packageName, dayStartMs + 3_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 5_000L)

        assertEquals(4_000L, accumulator.snapshot().usageByPackage[packageName])
    }
}
