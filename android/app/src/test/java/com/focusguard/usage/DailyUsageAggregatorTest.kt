package com.focusguard.usage

import org.junit.Assert.assertEquals
import org.junit.Test

class DailyUsageAggregatorTest {

    @Test
    fun usageForPackages_mapsMissingPackagesToZero() {
        val usageByPackage = mapOf("com.example.app" to 42_000L)

        val result =
            DailyUsageAggregator.usageForPackages(
                usageByPackage,
                listOf("com.example.app", "com.other.app"),
            )

        assertEquals(42_000L, result["com.example.app"])
        assertEquals(0L, result["com.other.app"])
    }
}
