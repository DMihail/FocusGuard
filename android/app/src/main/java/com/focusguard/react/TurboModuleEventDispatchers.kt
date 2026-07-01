package com.focusguard.react

import android.app.Application
import com.facebook.react.ReactApplication
import java.util.concurrent.CopyOnWriteArraySet

/** Routes native lifecycle signals to active Turbo Module listeners. */
object TurboModuleEventDispatchers {
    private val permissionsChangedListeners = CopyOnWriteArraySet<() -> Unit>()
    private val localDayChangedListeners = CopyOnWriteArraySet<(dayKey: String) -> Unit>()
    private val monitorServiceStateListeners = CopyOnWriteArraySet<(isRunning: Boolean) -> Unit>()

    fun registerPermissionsChanged(callback: () -> Unit) {
        permissionsChangedListeners.add(callback)
    }

    fun unregisterPermissionsChanged(callback: () -> Unit) {
        permissionsChangedListeners.remove(callback)
    }

    fun emitPermissionsChanged(application: Application) {
        dispatch(application, permissionsChangedListeners) { listener ->
            listener()
        }
    }

    fun registerLocalDayChanged(callback: (dayKey: String) -> Unit) {
        localDayChangedListeners.add(callback)
    }

    fun unregisterLocalDayChanged(callback: (dayKey: String) -> Unit) {
        localDayChangedListeners.remove(callback)
    }

    fun emitLocalDayChanged(application: Application, dayKey: String) {
        dispatch(application, localDayChangedListeners) { listener ->
            listener(dayKey)
        }
    }

    fun registerMonitorServiceState(callback: (isRunning: Boolean) -> Unit) {
        monitorServiceStateListeners.add(callback)
    }

    fun unregisterMonitorServiceState(callback: (isRunning: Boolean) -> Unit) {
        monitorServiceStateListeners.remove(callback)
    }

    fun emitMonitorServiceState(application: Application, isRunning: Boolean) {
        dispatch(application, monitorServiceStateListeners) { listener ->
            listener(isRunning)
        }
    }

    private fun <T> dispatch(
        application: Application,
        listeners: CopyOnWriteArraySet<T>,
        action: (T) -> Unit,
    ) {
        if (listeners.isNotEmpty()) {
            listeners.forEach(action)
            return
        }

        dispatchOnUiQueue(application) {
            listeners.forEach(action)
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
