package com.focusguard.usage

import com.focusguard.RobolectricKeeptTestCase
import com.focusguard.react.TurboModuleEventDispatchers
import com.focusguard.storage.PersistSchema
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class LocalDayChangeNotifierTest : RobolectricKeeptTestCase() {
    @Test
    fun `first check seeds persisted day without emitting`() {
        var emittedDayKey: String? = null
        TurboModuleEventDispatchers.registerLocalDayChanged { dayKey ->
            emittedDayKey = dayKey
        }

        LocalDayChangeNotifier.checkAndNotify(context)

        assertNull(emittedDayKey)
        assertEquals(getLocalDayKey(), decodeTestString(PersistSchema.LAST_LOCAL_DAY_KEY))
    }

    @Test
    fun `checkAndNotify emits when persisted day differs from current day`() {
        val currentDayKey = getLocalDayKey()
        encodeTestValue(PersistSchema.LAST_LOCAL_DAY_KEY, "2020-1-1")

        var emittedDayKey: String? = null
        TurboModuleEventDispatchers.registerLocalDayChanged { dayKey ->
            emittedDayKey = dayKey
        }

        LocalDayChangeNotifier.checkAndNotify(context)

        assertEquals(currentDayKey, emittedDayKey)
    }

    @Test
    fun `onMidnightAlarm publishes day change when cursor is behind`() {
        encodeTestValue(PersistSchema.LAST_LOCAL_DAY_KEY, "2020-1-1")

        var emittedDayKey: String? = null
        TurboModuleEventDispatchers.registerLocalDayChanged { dayKey ->
            emittedDayKey = dayKey
        }

        LocalDayChangeNotifier.onMidnightAlarm(context)

        assertEquals(getLocalDayKey(), emittedDayKey)
    }

    @Test
    fun `markDayChangeNotified prevents duplicate publish on same day`() {
        val currentDayKey = getLocalDayKey()
        LocalDayChangeNotifier.markDayChangeNotified(currentDayKey)

        var emitCount = 0
        TurboModuleEventDispatchers.registerLocalDayChanged {
            emitCount += 1
        }

        LocalDayChangeNotifier.checkAndNotify(context)

        assertEquals(0, emitCount)
    }

    @Test
    fun `in-memory cursor takes precedence over persisted day key`() {
        val currentDayKey = getLocalDayKey()
        encodeTestValue(PersistSchema.LAST_LOCAL_DAY_KEY, "2020-1-1")
        LocalDayChangeNotifier.markDayChangeNotified(currentDayKey)

        var emitCount = 0
        TurboModuleEventDispatchers.registerLocalDayChanged {
            emitCount += 1
        }

        LocalDayChangeNotifier.checkAndNotify(context)

        assertEquals(0, emitCount)
    }
}
