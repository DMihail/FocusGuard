package com.focusguard.widget

import android.content.Context
import com.focusguard.R
import kotlin.math.max
import kotlin.math.roundToInt

internal object WidgetUsageFormatter {

    fun formatRemaining(context: Context, remainingMs: Long): String {
        if (remainingMs <= 0L) {
            return context.getString(R.string.widget_less_than_minute)
        }

        val minutes = max(1, (remainingMs / 60_000.0).roundToInt())

        if (minutes < 60) {
            return context.getString(R.string.widget_minutes_short, minutes)
        }

        val hours = minutes / 60
        val remainder = minutes % 60

        return if (remainder > 0) {
            context.getString(R.string.widget_hours_minutes_short, hours, remainder)
        } else {
            context.getString(R.string.widget_hours_short, hours)
        }
    }
}
