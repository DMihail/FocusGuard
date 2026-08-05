package com.focusguard.monitor

import com.focusguard.RobolectricKeeptTestCase
import com.focusguard.storage.PersistSchema
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class MonitoringResumeTest : RobolectricKeeptTestCase() {

    @Test
    fun clearsPendingWhenMonitoringDisabled() {
        MonitoringBootResumeStore.markPending()

        assertFalse(MonitoringResume.ensureRunning(context))
        assertFalse(MonitoringBootResumeStore.hasPending())
    }

    @Test
    fun keepsPendingWhenEnabledButServiceCannotStart() {
        encodeTestValue(
            PersistSchema.MONITORING_STORAGE_KEY,
            """{"state":{"isMonitoring":true},"version":1}""",
        )
        MonitoringBootResumeStore.markPending()

        // Robolectric has no usage-access / overlay grants — start fails, pending must remain.
        assertFalse(MonitoringResume.ensureRunning(context))
        assertTrue(MonitoringBootResumeStore.hasPending())
    }

    @Test
    fun marksPendingWhenEnabledStartFailsWithoutPriorPending() {
        encodeTestValue(
            PersistSchema.MONITORING_STORAGE_KEY,
            """{"state":{"isMonitoring":true},"version":1}""",
        )

        assertFalse(MonitoringResume.ensureRunning(context))
        assertTrue(MonitoringBootResumeStore.hasPending())
    }
}
