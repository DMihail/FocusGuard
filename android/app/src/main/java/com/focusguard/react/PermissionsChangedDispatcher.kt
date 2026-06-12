package com.focusguard.react

import android.app.Application
import com.facebook.react.ReactApplication

/** Routes permission-change notifications to the active Turbo Module instance. */
object PermissionsChangedDispatcher {
    private var emitCallback: (() -> Unit)? = null

    fun register(callback: () -> Unit) {
        emitCallback = callback
    }

    fun unregister(callback: () -> Unit) {
        if (emitCallback === callback) {
            emitCallback = null
        }
    }

    fun emit(application: Application) {
        val callback = emitCallback
        if (callback != null) {
            callback()
            return
        }

        val reactContext =
            (application as? ReactApplication)?.reactHost?.currentReactContext ?: return

        if (!reactContext.hasActiveReactInstance()) {
            return
        }

        reactContext.runOnUiQueueThread {
            emitCallback?.invoke()
        }
    }
}
