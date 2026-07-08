package com.focusguard

import org.junit.Assert.assertEquals
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
}
