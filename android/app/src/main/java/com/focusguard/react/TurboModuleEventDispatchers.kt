package com.focusguard.react

import android.app.Application
import com.facebook.react.ReactApplication

/** Routes native lifecycle signals to the active Turbo Module instance. */
object TurboModuleEventDispatchers {
    private var permissionsChangedEmit: (() -> Unit)? = null
    private var localDayChangedEmit: ((dayKey: String) -> Unit)? = null
    private var monitorServiceStateEmit: ((isRunning: Boolean) -> Unit)? = null

    fun registerPermissionsChanged(callback: () -> Unit) {
        permissionsChangedEmit = callback
    }

    fun unregisterPermissionsChanged(callback: () -> Unit) {
        if (permissionsChangedEmit === callback) {
            permissionsChangedEmit = null
        }
    }

    fun emitPermissionsChanged(application: Application) {
        dispatch(application, permissionsChangedEmit)
    }

    fun registerLocalDayChanged(callback: (dayKey: String) -> Unit) {
        localDayChangedEmit = callback
    }

    fun unregisterLocalDayChanged(callback: (dayKey: String) -> Unit) {
        if (localDayChangedEmit === callback) {
            localDayChangedEmit = null
        }
    }

    fun emitLocalDayChanged(application: Application, dayKey: String) {
        val callback = localDayChangedEmit
        if (callback != null) {
            callback(dayKey)
            return
        }

        dispatchOnUiQueue(application) {
            localDayChangedEmit?.invoke(dayKey)
        }
    }

    fun registerMonitorServiceState(callback: (isRunning: Boolean) -> Unit) {
        monitorServiceStateEmit = callback
    }

    fun unregisterMonitorServiceState(callback: (isRunning: Boolean) -> Unit) {
        if (monitorServiceStateEmit === callback) {
            monitorServiceStateEmit = null
        }
    }

    fun emitMonitorServiceState(application: Application, isRunning: Boolean) {
        val callback = monitorServiceStateEmit
        if (callback != null) {
            callback(isRunning)
            return
        }

        dispatchOnUiQueue(application) {
            monitorServiceStateEmit?.invoke(isRunning)
        }
    }

    private fun dispatch(application: Application, callback: (() -> Unit)?) {
        if (callback != null) {
            callback()
            return
        }

        dispatchOnUiQueue(application) {
            permissionsChangedEmit?.invoke()
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
