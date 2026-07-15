package com.focusguard.accessibility

import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ForegroundAccessibilityBridgeTest {
    @After
    fun tearDown() {
        ForegroundAccessibilityBridge.resetForTests()
    }

    @Test
    fun `returns null when service is disconnected`() {
        ForegroundAccessibilityBridge.onForegroundWindowChanged("com.example.app")

        assertNull(ForegroundAccessibilityBridge.getRecentForegroundPackage(maxAgeMs = 60_000L))
    }

    @Test
    fun `stores recent foreground package while connected`() {
        ForegroundAccessibilityBridge.onServiceConnected()
        ForegroundAccessibilityBridge.onForegroundWindowChanged("com.example.app")

        assertEquals(
            "com.example.app",
            ForegroundAccessibilityBridge.getRecentForegroundPackage(maxAgeMs = 60_000L),
        )
    }

    @Test
    fun `notifies wake listeners when foreground package changes`() {
        ForegroundAccessibilityBridge.onServiceConnected()
        var wakeCount = 0
        val unregister =
            ForegroundAccessibilityBridge.registerWakeListener { wakeCount += 1 }

        try {
            ForegroundAccessibilityBridge.onForegroundWindowChanged("com.one")
            ForegroundAccessibilityBridge.onForegroundWindowChanged("com.two")
            ForegroundAccessibilityBridge.onForegroundWindowChanged("com.two")
        } finally {
            unregister()
        }

        assertEquals(2, wakeCount)
    }

    @Test
    fun `clears state when service disconnects`() {
        ForegroundAccessibilityBridge.onServiceConnected()
        ForegroundAccessibilityBridge.onForegroundWindowChanged("com.example.app")

        ForegroundAccessibilityBridge.onServiceDisconnected()

        assertNull(ForegroundAccessibilityBridge.getRecentForegroundPackage(maxAgeMs = 60_000L))
        assertTrue(!ForegroundAccessibilityBridge.isActive())
    }
}
