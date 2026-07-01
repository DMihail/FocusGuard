package com.focusguard.react

import android.app.Application
import com.facebook.react.ReactApplication

/** Routes local calendar day rollover notifications to the active Turbo Module instance. */
object LocalDayChangeDispatcher {
    private var emitCallback: ((dayKey: String) -> Unit)? = null

    fun register(callback: (dayKey: String) -> Unit) {
        emitCallback = callback
    }

    fun unregister(callback: (dayKey: String) -> Unit) {
        if (emitCallback === callback) {
            emitCallback = null
        }
    }

    fun emit(application: Application, dayKey: String) {
        val callback = emitCallback
        if (callback != null) {
            callback(dayKey)
            return
        }

        val reactContext =
            (application as? ReactApplication)?.reactHost?.currentReactContext ?: return

        if (!reactContext.hasActiveReactInstance()) {
            return
        }

        reactContext.runOnUiQueueThread {
            emitCallback?.invoke(dayKey)
        }
    }
}
