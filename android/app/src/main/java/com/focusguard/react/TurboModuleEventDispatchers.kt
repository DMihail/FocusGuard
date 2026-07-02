package com.focusguard.react

import android.app.Application
import com.facebook.react.ReactApplication
import java.util.concurrent.CopyOnWriteArraySet

/** Routes native lifecycle signals to active Turbo Module listeners. */
object TurboModuleEventDispatchers {
    private val permissionsChangedListeners = CopyOnWriteArraySet<() -> Unit>()
    private val localDayChangedListeners = CopyOnWriteArraySet<(dayKey: String) -> Unit>()
    private val monitorServiceStateListeners = CopyOnWriteArraySet<(isRunning: Boolean) -> Unit>()

    @Volatile
    private var pendingPermissionsChanged = false

    @Volatile
    private var pendingLocalDayKey: String? = null

    @Volatile
    private var pendingMonitorServiceState: Boolean? = null

    fun registerPermissionsChanged(callback: () -> Unit) {
        permissionsChangedListeners.add(callback)
        replayPendingPermissionsChanged()
    }

    fun unregisterPermissionsChanged(callback: () -> Unit) {
        permissionsChangedListeners.remove(callback)
    }

    fun emitPermissionsChanged(application: Application) {
        if (permissionsChangedListeners.isEmpty()) {
            pendingPermissionsChanged = true
            dispatchOnUiQueue(application) {
                replayPendingPermissionsChanged()
            }
            return
        }

        permissionsChangedListeners.forEach { listener ->
            listener()
        }
    }

    fun registerLocalDayChanged(callback: (dayKey: String) -> Unit) {
        localDayChangedListeners.add(callback)
        replayPendingLocalDayChanged()
    }

    fun unregisterLocalDayChanged(callback: (dayKey: String) -> Unit) {
        localDayChangedListeners.remove(callback)
    }

    fun emitLocalDayChanged(application: Application, dayKey: String) {
        if (localDayChangedListeners.isEmpty()) {
            pendingLocalDayKey = dayKey
            dispatchOnUiQueue(application) {
                replayPendingLocalDayChanged()
            }
            return
        }

        localDayChangedListeners.forEach { listener ->
            listener(dayKey)
        }
    }

    fun storePendingLocalDayChanged(dayKey: String) {
        pendingLocalDayKey = dayKey
    }

    fun storePendingMonitorServiceState(isRunning: Boolean) {
        pendingMonitorServiceState = isRunning
    }

    fun registerMonitorServiceState(callback: (isRunning: Boolean) -> Unit) {
        monitorServiceStateListeners.add(callback)
        replayPendingMonitorServiceState()
    }

    fun unregisterMonitorServiceState(callback: (isRunning: Boolean) -> Unit) {
        monitorServiceStateListeners.remove(callback)
    }

    fun emitMonitorServiceState(application: Application, isRunning: Boolean) {
        if (monitorServiceStateListeners.isEmpty()) {
            pendingMonitorServiceState = isRunning
            dispatchOnUiQueue(application) {
                replayPendingMonitorServiceState()
            }
            return
        }

        monitorServiceStateListeners.forEach { listener ->
            listener(isRunning)
        }
    }

    /** @internal Unit-test reset. */
    internal fun resetForTests() {
        permissionsChangedListeners.clear()
        localDayChangedListeners.clear()
        monitorServiceStateListeners.clear()
        pendingPermissionsChanged = false
        pendingLocalDayKey = null
        pendingMonitorServiceState = null
    }

    /** @internal Unit-test emit without a React [Application]. */
    internal fun emitPermissionsChanged() {
        if (permissionsChangedListeners.isEmpty()) {
            pendingPermissionsChanged = true
            return
        }

        permissionsChangedListeners.forEach { listener ->
            listener()
        }
    }

    /** @internal Unit-test emit without a React [Application]. */
    internal fun emitLocalDayChanged(dayKey: String) {
        if (localDayChangedListeners.isEmpty()) {
            pendingLocalDayKey = dayKey
            return
        }

        localDayChangedListeners.forEach { listener ->
            listener(dayKey)
        }
    }

    /** @internal Unit-test emit without a React [Application]. */
    internal fun emitMonitorServiceState(isRunning: Boolean) {
        if (monitorServiceStateListeners.isEmpty()) {
            pendingMonitorServiceState = isRunning
            return
        }

        monitorServiceStateListeners.forEach { listener ->
            listener(isRunning)
        }
    }

    private fun replayPendingPermissionsChanged() {
        if (!pendingPermissionsChanged || permissionsChangedListeners.isEmpty()) {
            return
        }

        pendingPermissionsChanged = false
        permissionsChangedListeners.forEach { listener ->
            listener()
        }
    }

    private fun replayPendingLocalDayChanged() {
        val dayKey = pendingLocalDayKey ?: return
        if (localDayChangedListeners.isEmpty()) {
            return
        }

        pendingLocalDayKey = null
        localDayChangedListeners.forEach { listener ->
            listener(dayKey)
        }
    }

    internal fun replayPendingMonitorServiceState() {
        val isRunning = pendingMonitorServiceState ?: return
        if (monitorServiceStateListeners.isEmpty()) {
            return
        }

        pendingMonitorServiceState = null
        monitorServiceStateListeners.forEach { listener ->
            listener(isRunning)
        }
    }

    private fun dispatchOnUiQueue(application: Application, action: () -> Unit) {
        val reactContext =
            (application as? ReactApplication)?.reactHost?.currentReactContext ?: return

        if (!reactContext.hasActiveReactInstance()) {
            return
        }

        reactContext.runOnUiQueueThread(action)
    }
}
