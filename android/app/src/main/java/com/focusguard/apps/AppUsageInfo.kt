package com.focusguard.apps

/** Aggregated foreground usage for a single application. */
internal data class AppUsageInfo(
    val packageName: String,
    val appName: String,
    val appImage: String,
    val category: String,
    val totalTimeForeground: Long,
    val lastTimeUsed: Long,
)
