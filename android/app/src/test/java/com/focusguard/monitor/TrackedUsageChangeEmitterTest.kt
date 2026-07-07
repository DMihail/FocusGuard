package com.focusguard.monitor

import com.focusguard.RobolectricKeeptTestCase
import com.focusguard.react.TurboModuleEventDispatchers
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class TrackedUsageChangeEmitterTest : RobolectricKeeptTestCase() {
    @After
    fun tearDownEmitter() {
        TrackedUsageChangeEmitter.resetForTests()
        TurboModuleEventDispatchers.resetForTests()
    }

    @Test
    fun emitsWhenUsageDeltaIsMeaningful() {
        var emitCount = 0
        TurboModuleEventDispatchers.registerTrackedUsageChanged { emitCount += 1 }

        TrackedUsageChangeEmitter.maybeEmit(context, mapOf("com.example.app" to 0L), urgent = true)
        assertEquals(1, emitCount)

        TrackedUsageChangeEmitter.onLocalDayChanged()

        TrackedUsageChangeEmitter.maybeEmit(context, mapOf("com.example.app" to 500L))
        assertEquals(1, emitCount)

        TrackedUsageChangeEmitter.maybeEmit(context, mapOf("com.example.app" to 1_600L))
        assertEquals(2, emitCount)
    }

    @Test
    fun urgentEmitBypassesThrottleInterval() {
        var emitCount = 0
        TurboModuleEventDispatchers.registerTrackedUsageChanged { emitCount += 1 }

        val usage = mapOf("com.example.app" to 0L)

        TrackedUsageChangeEmitter.maybeEmit(context, usage, urgent = true)
        TrackedUsageChangeEmitter.maybeEmit(context, usage, urgent = true)

        assertEquals(2, emitCount)
    }

    @Test
    fun onLocalDayChangedResetsThrottleBaseline() {
        var emitCount = 0
        TurboModuleEventDispatchers.registerTrackedUsageChanged { emitCount += 1 }

        TrackedUsageChangeEmitter.maybeEmit(context, mapOf("com.example.app" to 0L), urgent = true)
        TrackedUsageChangeEmitter.maybeEmit(context, mapOf("com.example.app" to 100L))
        assertEquals(1, emitCount)

        TrackedUsageChangeEmitter.onLocalDayChanged()
        TrackedUsageChangeEmitter.maybeEmit(context, mapOf("com.example.app" to 0L), urgent = true)

        assertEquals(2, emitCount)
    }
}
