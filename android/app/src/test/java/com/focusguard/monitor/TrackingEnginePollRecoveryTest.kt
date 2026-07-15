package com.focusguard.monitor

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class TrackingEnginePollRecoveryTest {
    @Test
    fun `stops service after max consecutive failures`() {
        assertFalse(TrackingEnginePollRecovery.shouldStopService(TrackingEnginePollRecovery.MAX_CONSECUTIVE_FAILURES - 1))
        assertTrue(TrackingEnginePollRecovery.shouldStopService(TrackingEnginePollRecovery.MAX_CONSECUTIVE_FAILURES))
    }
}
