package com.focusguard.react

import android.app.Application
import com.facebook.react.ReactApplication

/** Routes monitor foreground-service lifecycle changes to the active Turbo Module instance. */
object MonitorServiceStateDispatcher {
    private var emitCallback: ((isRunning: Boolean) -> Unit)? = null

    fun register(callback: (isRunning: Boolean) -> Unit) {
        emitCallback = callback
    }

    fun unregister(callback: (isRunning: Boolean) -> Unit) {
        if (emitCallback === callback) {
            emitCallback = null
        }
    }

    fun emit(application: Application, isRunning: Boolean) {
        val callback = emitCallback
        if (callback != null) {
            callback(isRunning)
            return
        }

        val reactContext =
            (application as? ReactApplication)?.reactHost?.currentReactContext ?: return

        if (!reactContext.hasActiveReactInstance()) {
            return
        }

        reactContext.runOnUiQueueThread {
            emitCallback?.invoke(isRunning)
        }
    }
}
