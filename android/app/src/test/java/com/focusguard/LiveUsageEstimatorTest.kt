package com.focusguard

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class LiveUsageEstimatorTest : RobolectricKeeptTestCase() {
    @Test
    fun clearBaselinesForNewDayDropsStaleSessionEstimate() {
        val repository = DailyUsageRepository.getInstance(context)
        val estimator = LiveUsageEstimator(repository)

        estimator.onTrackedAppForeground("com.example.app")
        assertTrue(estimator.getEffectiveUsageMs("com.example.app") >= 0L)

        estimator.clearBaselinesForNewDay()

        assertEquals(0L, estimator.getEffectiveUsageMs("com.example.app"))
    }

    @Test
    fun syncActiveSessionsKeepsMultiplePackagesOpen() {
        val repository = DailyUsageRepository.getInstance(context)
        val estimator = LiveUsageEstimator(repository)

        estimator.syncActiveSessions(setOf("com.example.a", "com.example.b"))

        assertTrue(estimator.isSessionActiveFor("com.example.a"))
        assertTrue(estimator.isSessionActiveFor("com.example.b"))

        val usage = estimator.getEffectiveUsageMsForPackages(setOf("com.example.a", "com.example.b"))
        assertTrue(usage.getValue("com.example.a") >= 0L)
        assertTrue(usage.getValue("com.example.b") >= 0L)

        estimator.syncActiveSessions(setOf("com.example.a"))

        assertTrue(estimator.isSessionActiveFor("com.example.a"))
        assertFalse(estimator.isSessionActiveFor("com.example.b"))
    }
}
