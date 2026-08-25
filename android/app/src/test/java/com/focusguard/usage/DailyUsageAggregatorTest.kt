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

        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
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
                initialCompleted = priorCompleted,
            )
        accumulator.applyForegroundStart(packageName, dayStartMs + 6_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 9_000L)

        val state = accumulator.snapshot()

        assertEquals(4_000L, state.usageByPackage[packageName])
    }

    @Test
    fun `orphan end without open session is ignored`() {
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
            )

        accumulator.applyForegroundEnd(packageName, dayStartMs + 5_000L)

        assertTrue(accumulator.snapshot().usageByPackage.isEmpty())
    }

    @Test
    fun `duplicate end after matched session does not invent orphan usage`() {
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
            )

        accumulator.applyForegroundStart(packageName, dayStartMs + 1_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_010L)

        val state = accumulator.snapshot()

        assertEquals(3_000L, state.usageByPackage[packageName])
        assertTrue(state.openSessionStartMs.isEmpty())
    }

    @Test
    fun `long unmatched end does not credit from day start`() {
        val sixteenHoursMs = 16L * 60L * 60L * 1_000L
        val endMs = dayStartMs + sixteenHoursMs

        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
            )

        accumulator.applyForegroundEnd(packageName, endMs)
        accumulator.applyForegroundEnd(packageName, endMs + 10L)

        assertTrue(accumulator.snapshot().usageByPackage.isEmpty())
    }

    @Test
    fun `duplicate end after prior open session does not invent orphan usage`() {
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
                initialOpenSessions = mapOf(packageName to dayStartMs + 1_000L),
            )

        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 4_010L)

        assertEquals(3_000L, accumulator.snapshot().usageByPackage[packageName])
    }

    @Test
    fun `new session after ignored orphan end still records normally`() {
        val accumulator =
            UsageEventSessionAccumulator(
                dayStartMs = dayStartMs,
                packageFilter = setOf(packageName),
            )

        accumulator.applyForegroundEnd(packageName, dayStartMs + 2_000L)
        accumulator.applyForegroundStart(packageName, dayStartMs + 3_000L)
        accumulator.applyForegroundEnd(packageName, dayStartMs + 5_000L)

        assertEquals(2_000L, accumulator.snapshot().usageByPackage[packageName])
    }

    @Test
    fun `hybrid merge does not stack stats when open session exists`() {
        val openSessions = mapOf(packageName to dayStartMs + 1_000L)
        val merged =
            DailyUsageAggregator.completedUsagePreferringEvents(
                packageFilter = setOf(packageName),
                eventsCompleted = emptyMap(),
                openSessions = openSessions,
                fromStats = mapOf(packageName to 60L * 60L * 1_000L),
            )

        assertEquals(0L, merged[packageName])

        val projected =
            DailyUsageAggregator.projectUsageAt(merged, openSessions, dayStartMs + 10_000L)
        assertEquals(9_000L, projected[packageName])
    }

    @Test
    fun `hybrid merge uses stats only when package has no event evidence`() {
        val other = "com.other.app"
        val merged =
            DailyUsageAggregator.completedUsagePreferringEvents(
                packageFilter = setOf(packageName, other),
                eventsCompleted = mapOf(packageName to 5_000L),
                openSessions = emptyMap(),
                fromStats = mapOf(packageName to 99_000L, other to 7_000L),
            )

        assertEquals(5_000L, merged[packageName])
        assertEquals(7_000L, merged[other])
    }
}
