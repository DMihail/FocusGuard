package com.focusguard.monitor

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class ForegroundStabilizerTest {
    @Test
    fun `promotes a foreground package after stable polls`() {
        val stabilizer = ForegroundStabilizer(stablePollsRequired = 2)

        assertNull(stabilizer.resolve("com.example.app"))
        assertEquals("com.example.app", stabilizer.resolve("com.example.app"))
    }

    @Test
    fun `clears stable foreground after consecutive misses`() {
        val stabilizer = ForegroundStabilizer()

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

        stabilizer.reset()

        assertNull(stabilizer.stableForeground)
        assertNull(stabilizer.resolve(null))
    }
}
