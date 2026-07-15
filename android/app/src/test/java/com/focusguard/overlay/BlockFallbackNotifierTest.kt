package com.focusguard.overlay

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Test

class BlockFallbackNotifierTest {
    @Test
    fun `notification ids are stable and distinct for different packages`() {
        val first = notificationIdForTest("com.example.one")
        val second = notificationIdForTest("com.example.two")

        assertEquals(first, notificationIdForTest("com.example.one"))
        assertNotEquals(first, second)
    }

    private fun notificationIdForTest(packageName: String): Int =
        3001 + (packageName.hashCode() and 0x7FFF)
}
