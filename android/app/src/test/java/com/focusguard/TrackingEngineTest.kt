package com.focusguard

import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = TestKeeptApplication::class, sdk = [28])
class TrackingEngineTest : RobolectricKeeptTestCase() {
    @Test
    fun `start and stop do not crash when monitoring is disabled`() {
        val engine = TrackingEngine(context)

        engine.start()
        engine.stop()
    }
}
