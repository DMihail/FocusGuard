package com.focusguard.monitor

import com.focusguard.RobolectricKeeptTestCase
import com.focusguard.storage.NativeMonitoringSnapshot
import com.focusguard.storage.PersistSchema
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class MonitoringResumeTest : RobolectricKeeptTestCase() {

    @Before
    fun clearMonitoringSnapshot() {
        NativeMonitoringSnapshot.invalidateCache()
    }

    @Test
    fun clearsPendingWhenMonitoringDisabled() {
        MonitoringBootResumeStore.markPending()

        assertFalse(MonitoringResume.ensureRunning(context))
        assertFalse(MonitoringBootResumeStore.hasPending())
    }

    @Test
    fun keepsPendingWhenEnabledButServiceCannotStart() {
        encodeTestValue(
            PersistSchema.NATIVE_MONITORING_SNAPSHOT_KEY,
            """{"version":${PersistSchema.NATIVE_MONITORING_SNAPSHOT_VERSION},"isMonitoring":true}""",
        )
        MonitoringBootResumeStore.markPending()

        // Robolectric has no usage-access / overlay grants — start fails, pending must remain.
        assertFalse(MonitoringResume.ensureRunning(context))
        assertTrue(MonitoringBootResumeStore.hasPending())
    }

    @Test
    fun marksPendingWhenEnabledStartFailsWithoutPriorPending() {
        encodeTestValue(
            PersistSchema.NATIVE_MONITORING_SNAPSHOT_KEY,
            """{"version":${PersistSchema.NATIVE_MONITORING_SNAPSHOT_VERSION},"isMonitoring":true}""",
        )

        assertFalse(MonitoringResume.ensureRunning(context))
        assertTrue(MonitoringBootResumeStore.hasPending())
    }

    @Test
    fun migratesLegacyZustandBlobBeforeResume() {
        encodeTestValue(
            PersistSchema.LEGACY_MONITORING_STORAGE_KEY,
            """{"state":{"isMonitoring":true},"version":1}""",
        )

        assertFalse(MonitoringResume.ensureRunning(context))
        assertTrue(MonitoringBootResumeStore.hasPending())
        assertTrue(MonitoringStateRepository.isMonitoringEnabled())
    }
}
