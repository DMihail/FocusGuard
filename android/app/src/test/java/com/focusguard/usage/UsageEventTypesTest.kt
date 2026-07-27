package com.focusguard.usage

import android.app.usage.UsageEvents
import com.focusguard.RobolectricKeeptTestCase
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [29])
class UsageEventTypesTest : RobolectricKeeptTestCase() {

    @Test
    fun recognizesLegacyAndModernForegroundStartEvents() {
        @Suppress("DEPRECATION")
        assertTrue(UsageEventTypes.isForegroundStart(UsageEvents.Event.MOVE_TO_FOREGROUND))
        assertTrue(UsageEventTypes.isForegroundStart(UsageEvents.Event.ACTIVITY_RESUMED))
    }

    @Test
    fun recognizesLegacyAndModernForegroundEndEvents() {
        @Suppress("DEPRECATION")
        assertTrue(UsageEventTypes.isForegroundEnd(UsageEvents.Event.MOVE_TO_BACKGROUND))
        assertTrue(UsageEventTypes.isForegroundEnd(UsageEvents.Event.ACTIVITY_PAUSED))
    }

    @Test
    fun ignoresUnrelatedEventTypes() {
        assertFalse(UsageEventTypes.isForegroundStart(UsageEvents.Event.NONE))
        assertFalse(UsageEventTypes.isForegroundEnd(UsageEvents.Event.NONE))
    }
}
