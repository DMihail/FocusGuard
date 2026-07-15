package com.focusguard.monitor

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class ForegroundStabilizerTest {
    @Test
    fun `reports pending switch before stable promotion`() {
        val stabilizer = ForegroundStabilizer()

        assertEquals(false, stabilizer.hasPendingSwitch())

        stabilizer.resolve("com.example.app")

        assertEquals(true, stabilizer.hasPendingSwitch())
        assertNull(stabilizer.stableForeground)

        stabilizer.resolve("com.example.app")

        assertEquals(false, stabilizer.hasPendingSwitch())
        assertEquals("com.example.app", stabilizer.stableForeground)
    }

    @Test
    fun `clears stable foreground after consecutive misses`() {
        val stabilizer = ForegroundStabilizer()

        stabilizer.resolve("com.example.app")
        stabilizer.resolve("com.example.app")
        assertEquals("com.example.app", stabilizer.stableForeground)

        repeat(ForegroundStabilizer.MISS_POLLS - 1) {
            assertEquals("com.example.app", stabilizer.resolve(null))
        }

        assertNull(stabilizer.resolve(null))
        assertNull(stabilizer.stableForeground)
    }

    @Test
    fun `reset clears debounce state`() {
        val stabilizer = ForegroundStabilizer()
        stabilizer.resolve("com.example.app")
        stabilizer.resolve("com.example.app")

        stabilizer.reset()

        assertNull(stabilizer.stableForeground)
        assertNull(stabilizer.resolve(null))
    }
}
