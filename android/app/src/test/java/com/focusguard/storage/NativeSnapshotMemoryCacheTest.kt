package com.focusguard.storage

import com.focusguard.RobolectricKeeptTestCase
import com.focusguard.TestKeeptApplication
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = TestKeeptApplication::class, sdk = [28])
class NativeSnapshotMemoryCacheTest : RobolectricKeeptTestCase() {
    @Before
    fun clearCaches() {
        NativeMonitoringSnapshot.invalidateCache()
        NativeTrackingSnapshot.invalidateCache()
        NativeSettingsSnapshot.invalidateCache()
    }

    @After
    fun resetCaches() {
        NativeMonitoringSnapshot.invalidateCache()
        NativeTrackingSnapshot.invalidateCache()
        NativeSettingsSnapshot.invalidateCache()
    }

    @Test
    fun monitoringReadSkipsMmkvAfterWarmCache() {
        NativeMonitoringSnapshot.write(
            """{"version":${PersistSchema.NATIVE_MONITORING_SNAPSHOT_VERSION},"isMonitoring":true}""",
        )
        assertTrue(NativeMonitoringSnapshot.read()?.isMonitoring == true)

        // Corrupt MMKV without invalidate — warm memory cache must win.
        encodeTestValue(PersistSchema.NATIVE_MONITORING_SNAPSHOT_KEY, """{"version":1,"isMonitoring":false}""")

        assertTrue(NativeMonitoringSnapshot.read()?.isMonitoring == true)
    }

    @Test
    fun monitoringWriteUpdatesWarmCache() {
        NativeMonitoringSnapshot.write(
            """{"version":${PersistSchema.NATIVE_MONITORING_SNAPSHOT_VERSION},"isMonitoring":true}""",
        )
        NativeMonitoringSnapshot.write(
            """{"version":${PersistSchema.NATIVE_MONITORING_SNAPSHOT_VERSION},"isMonitoring":false}""",
        )

        assertEquals(false, NativeMonitoringSnapshot.read()?.isMonitoring)
    }

    @Test
    fun trackingInvalidateForcesMmkvReload() {
        NativeTrackingSnapshot.write(
            """{"version":${PersistSchema.NATIVE_TRACKING_SNAPSHOT_VERSION},"trackedApps":["com.a"],"limitsByAppKey":{}}""",
        )
        assertEquals(listOf("com.a"), NativeTrackingSnapshot.read()?.trackedApps)

        encodeTestValue(
            PersistSchema.NATIVE_TRACKING_SNAPSHOT_KEY,
            """{"version":${PersistSchema.NATIVE_TRACKING_SNAPSHOT_VERSION},"trackedApps":["com.b"],"limitsByAppKey":{}}""",
        )
        NativeTrackingSnapshot.invalidateCache()

        assertEquals(listOf("com.b"), NativeTrackingSnapshot.read()?.trackedApps)
    }
}
