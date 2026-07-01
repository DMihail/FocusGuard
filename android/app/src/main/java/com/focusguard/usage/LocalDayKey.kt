package com.focusguard.usage

import java.util.Calendar

/** Matches `getLocalDayKey` in `source/utils/usage/localDayKey.ts`. */
internal fun getLocalDayKey(dateMs: Long = System.currentTimeMillis()): String {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = dateMs

    return "${calendar.get(Calendar.YEAR)}-${calendar.get(Calendar.MONTH) + 1}-${calendar.get(Calendar.DAY_OF_MONTH)}"
}

internal fun getMsUntilNextLocalMidnight(dateMs: Long = System.currentTimeMillis()): Long {
    val calendar = Calendar.getInstance()
    calendar.timeInMillis = dateMs
    calendar.set(Calendar.HOUR_OF_DAY, 24)
    calendar.set(Calendar.MINUTE, 0)
    calendar.set(Calendar.SECOND, 0)
    calendar.set(Calendar.MILLISECOND, 0)

    return (calendar.timeInMillis - dateMs).coerceAtLeast(0L)
}
