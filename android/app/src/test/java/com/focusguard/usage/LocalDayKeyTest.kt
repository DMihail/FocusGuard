package com.focusguard.usage

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.util.Calendar
import java.util.TimeZone

class LocalDayKeyTest {
    @Test
    fun `getLocalDayKey matches Y-M-D format`() {
        val calendar =
            Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
                set(2026, Calendar.MARCH, 15, 12, 30, 0)
                set(Calendar.MILLISECOND, 0)
            }

        assertEquals("2026-3-15", getLocalDayKey(calendar.timeInMillis))
    }

    @Test
    fun `getMsUntilNextLocalMidnight returns positive duration before midnight`() {
        val calendar =
            Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
                set(2026, Calendar.MARCH, 15, 23, 0, 0)
                set(Calendar.MILLISECOND, 0)
            }

        val remaining = getMsUntilNextLocalMidnight(calendar.timeInMillis)

        assertTrue(remaining in 3_500_000L..3_700_000L)
    }
}
