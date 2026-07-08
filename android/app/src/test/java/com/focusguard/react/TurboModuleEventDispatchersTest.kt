package com.focusguard.react

import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TurboModuleEventDispatchersTest {
    @After
    fun tearDown() {
        TurboModuleEventDispatchers.resetForTests()
    }

    @Test
    fun replaysPendingPermissionsChangedWhenListenerRegisters() {
        TurboModuleEventDispatchers.emitPermissionsChanged()

        var received = false
        TurboModuleEventDispatchers.registerPermissionsChanged {
            received = true
        }

        assertTrue(received)
    }

    @Test
    fun replaysLatestPendingLocalDayChangedWhenListenerRegisters() {
        TurboModuleEventDispatchers.emitLocalDayChanged("2026-07-01")
        TurboModuleEventDispatchers.emitLocalDayChanged("2026-07-02")

        var receivedDayKey: String? = null
        TurboModuleEventDispatchers.registerLocalDayChanged { dayKey ->
            receivedDayKey = dayKey
        }

        assertEquals("2026-07-02", receivedDayKey)
    }

    @Test
    fun replaysLatestPendingMonitorServiceStateWhenListenerRegisters() {
        TurboModuleEventDispatchers.emitMonitorServiceState(isRunning = true)
        TurboModuleEventDispatchers.emitMonitorServiceState(isRunning = false)

        var receivedState: Boolean? = null
        TurboModuleEventDispatchers.registerMonitorServiceState { isRunning ->
            receivedState = isRunning
        }

        assertEquals(false, receivedState)
    }

    @Test
    fun replaysStoredPendingMonitorServiceStateWhenExplicitlyReplayed() {
        TurboModuleEventDispatchers.storePendingMonitorServiceState(isRunning = true)

        var receivedState: Boolean? = null
        TurboModuleEventDispatchers.registerMonitorServiceState { isRunning ->
            receivedState = isRunning
        }

        assertEquals(true, receivedState)

        receivedState = null
        TurboModuleEventDispatchers.storePendingMonitorServiceState(isRunning = false)
        TurboModuleEventDispatchers.replayPendingMonitorServiceState()

        assertEquals(false, receivedState)
    }

    @Test
    fun deliversTrackedUsageChangedToRegisteredListener() {
        var received = false
        TurboModuleEventDispatchers.registerTrackedUsageChanged {
            received = true
        }

        TurboModuleEventDispatchers.emitTrackedUsageChanged()

        assertTrue(received)
    }
}
