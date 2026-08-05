package com.focusguard

import com.focusguard.storage.NativeTrackingSnapshot
import com.focusguard.storage.PersistSchema
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = TestKeeptApplication::class, sdk = [28])
class TrackingConfigRepositoryTest : RobolectricKeeptTestCase() {
    @Before
    fun clearTrackingCaches() {
        TrackingConfigRepository.invalidateCache()
        NativeTrackingSnapshot.invalidateCache()
    }

    @After
    fun resetTrackingCaches() {
        TrackingConfigRepository.invalidateCache()
        NativeTrackingSnapshot.invalidateCache()
    }

    @Test
    fun `limits reload after a missing snapshot is written later`() {
        val defaults = TrackingConfigRepository.AppLimitConfig.defaults()
        assertEquals(defaults.hardBlockThresholdMs, TrackingConfigRepository.getLimitConfig("com.example.app").hardBlockThresholdMs)

        NativeTrackingSnapshot.write(
            """
            {"version":${PersistSchema.NATIVE_TRACKING_SNAPSHOT_VERSION},"trackedApps":["com.example.app"],"limitsByAppKey":{"com.example.app":{"warningMinutes":20,"hardBlockMinutes":40,"strictMode":true}}}
            """.trimIndent(),
        )
        TrackingConfigRepository.invalidateCache()

        val limits = TrackingConfigRepository.getLimitConfig("com.example.app")
        assertEquals(20L * 60_000L, limits.warningThresholdMs)
        assertEquals(40L * 60_000L, limits.hardBlockThresholdMs)
        assertEquals(true, limits.strictMode)
    }

    @Test
    fun `limits become available without invalidate when snapshot appears after a null miss`() {
        assertEquals(
            TrackingConfigRepository.AppLimitConfig.defaults().hardBlockThresholdMs,
            TrackingConfigRepository.getLimitConfig("com.example.app").hardBlockThresholdMs,
        )

        NativeTrackingSnapshot.write(
            """
            {"version":${PersistSchema.NATIVE_TRACKING_SNAPSHOT_VERSION},"trackedApps":["com.example.app"],"limitsByAppKey":{"com.example.app":{"warningMinutes":15,"hardBlockMinutes":30,"strictMode":false}}}
            """.trimIndent(),
        )
        // Intentionally do not call TrackingConfigRepository.invalidateCache() — miss must not stick.

        val limits = TrackingConfigRepository.getLimitConfig("com.example.app")
        assertEquals(15L * 60_000L, limits.warningThresholdMs)
        assertEquals(30L * 60_000L, limits.hardBlockThresholdMs)
    }

    @Test
    fun `tracked apps become available without invalidate when snapshot appears after a miss`() {
        assertEquals(emptyList<String>(), TrackingConfigRepository.getTrackedApps())

        NativeTrackingSnapshot.write(
            """
            {"version":${PersistSchema.NATIVE_TRACKING_SNAPSHOT_VERSION},"trackedApps":["com.one","com.two"],"limitsByAppKey":{}}
            """.trimIndent(),
        )

        assertEquals(listOf("com.one", "com.two"), TrackingConfigRepository.getTrackedApps())
    }
}
