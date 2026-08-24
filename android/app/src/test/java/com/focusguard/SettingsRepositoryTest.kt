package com.focusguard

import com.focusguard.storage.NativeSettingsSnapshot
import com.focusguard.storage.PersistSchema
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = TestKeeptApplication::class, sdk = [28])
class SettingsRepositoryTest : RobolectricKeeptTestCase() {
    @Before
    fun clearSettingsCaches() {
        SettingsRepository.invalidateCache()
        NativeSettingsSnapshot.invalidateCache()
    }

    @After
    fun resetSettingsCaches() {
        SettingsRepository.invalidateCache()
        NativeSettingsSnapshot.invalidateCache()
    }

    @Test
    fun defaultsWhenSnapshotMissing() {
        assertEquals("system", SettingsRepository.getThemePreference())
        assertTrue(SettingsRepository.areNotificationsEnabled())
    }

    @Test
    fun readsFlatSnapshot() {
        NativeSettingsSnapshot.write(
            """
            {"version":${PersistSchema.NATIVE_SETTINGS_SNAPSHOT_VERSION},"themePreference":"dark","notificationsEnabled":false}
            """.trimIndent(),
        )
        SettingsRepository.invalidateCache()

        assertEquals("dark", SettingsRepository.getThemePreference())
        assertFalse(SettingsRepository.areNotificationsEnabled())
    }

    @Test
    fun migratesLegacyZustandBlobOnce() {
        encodeTestValue(
            PersistSchema.LEGACY_SETTINGS_STORAGE_KEY,
            """{"state":{"themePreference":"light","notificationsEnabled":false},"version":2}""",
        )

        assertEquals("light", SettingsRepository.getThemePreference())
        assertFalse(SettingsRepository.areNotificationsEnabled())

        val flat = decodeTestString(PersistSchema.NATIVE_SETTINGS_SNAPSHOT_KEY)
        assertTrue(flat != null && flat.contains("\"themePreference\":\"light\""))
    }
}
