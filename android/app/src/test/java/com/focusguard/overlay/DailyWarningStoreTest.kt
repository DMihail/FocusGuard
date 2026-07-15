package com.focusguard.overlay

import com.focusguard.RobolectricKeeptTestCase
import com.focusguard.usage.getLocalDayKey
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class DailyWarningStoreTest : RobolectricKeeptTestCase() {
    @Test
    fun `markWarningShownToday persists and wasWarningShownToday reads back`() {
        val packageName = "com.social.app"

        assertFalse(DailyWarningStore.wasWarningShownToday(packageName))

        DailyWarningStore.markWarningShownToday(packageName)

        assertTrue(DailyWarningStore.wasWarningShownToday(packageName))
    }

    @Test
    fun `pruneStaleKeys removes warning keys from previous local days`() {
        val packageName = "com.example.app"
        val todayKey = getLocalDayKey()
        val staleKey = "daily-warning-2020-1-1-$packageName"
        val todayKeyName = "daily-warning-$todayKey-$packageName"

        encodeTestValue(staleKey, true)
        encodeTestValue(todayKeyName, true)

        DailyWarningStore.pruneStaleKeys()

        assertFalse(containsTestKey(staleKey))
        assertTrue(decodeTestBool(todayKeyName, false))
    }

    @Test
    fun `in-memory cache avoids duplicate MMKV reads for the same day`() {
        val packageName = "com.example.cache"
        DailyWarningStore.markWarningShownToday(packageName)

        removeTestKey("daily-warning-${getLocalDayKey()}-$packageName")

        assertTrue(DailyWarningStore.wasWarningShownToday(packageName))
    }

    @Test
    fun `resetForTests clears in-memory cache so MMKV is read again`() {
        val packageName = "com.example.reset"
        DailyWarningStore.markWarningShownToday(packageName)
        removeTestKey("daily-warning-${getLocalDayKey()}-$packageName")

        DailyWarningStore.resetForTests()

        assertFalse(DailyWarningStore.wasWarningShownToday(packageName))
    }
}
