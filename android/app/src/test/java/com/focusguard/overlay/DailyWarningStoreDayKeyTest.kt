package com.focusguard.overlay

import com.focusguard.usage.getLocalDayKey
import org.junit.Assert.assertEquals
import org.junit.Test
import java.util.Calendar
import java.util.TimeZone

class DailyWarningStoreDayKeyTest {
    @Test
    fun `warning key prefix uses the same local day key format as LocalDayKey`() {
        val calendar =
            Calendar.getInstance(TimeZone.getTimeZone("UTC")).apply {
                set(2026, Calendar.MARCH, 15, 12, 30, 0)
                set(Calendar.MILLISECOND, 0)
            }

        assertEquals("2026-3-15", getLocalDayKey(calendar.timeInMillis))
        assertEquals("daily-warning-2026-3-15-com.example.app", warningKeyFor("com.example.app", calendar.timeInMillis))
    }

    private fun warningKeyFor(packageName: String, dateMs: Long): String {
        return "daily-warning-${getLocalDayKey(dateMs)}-$packageName"
    }
}
