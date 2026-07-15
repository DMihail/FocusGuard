package com.focusguard.accessibility

import java.util.concurrent.CopyOnWriteArraySet

/**
 * In-memory bridge between [FocusGuardAccessibilityService] and the monitor poll loop.
 *
 * Holds the most recent foreground package from window events and notifies wake listeners
 * when it changes so [com.focusguard.monitor.ForegroundPollWake] can exit idle delay early.
 */
internal object ForegroundAccessibilityBridge {

    @Volatile
    private var latestForegroundPackage: String? = null

    @Volatile
    private var latestForegroundAtMs: Long = 0L

    @Volatile
    private var serviceConnected: Boolean = false

    private val wakeListeners = CopyOnWriteArraySet<() -> Unit>()

    fun onServiceConnected() {
        serviceConnected = true
    }

    fun onServiceDisconnected() {
        serviceConnected = false
        latestForegroundPackage = null
        latestForegroundAtMs = 0L
    }

    fun isActive(): Boolean = serviceConnected

    fun onForegroundWindowChanged(packageName: String) {
        val previous = latestForegroundPackage
        latestForegroundPackage = packageName
        latestForegroundAtMs = System.currentTimeMillis()

        if (packageName != previous) {
            wakeListeners.forEach { listener ->
                try {
                    listener()
                } catch (_: Exception) {
                    // Wake listeners must never break the accessibility callback thread.
                }
            }
        }
    }

    fun getRecentForegroundPackage(maxAgeMs: Long): String? {
        if (!serviceConnected) {
            return null
        }

        val packageName = latestForegroundPackage ?: return null
        if (System.currentTimeMillis() - latestForegroundAtMs > maxAgeMs) {
            return null
        }

        return packageName
    }

    fun registerWakeListener(listener: () -> Unit): () -> Unit {
        wakeListeners.add(listener)
        return { wakeListeners.remove(listener) }
    }
}
