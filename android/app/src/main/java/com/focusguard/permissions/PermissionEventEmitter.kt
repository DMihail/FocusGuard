package com.focusguard.permissions

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactContext

/** Emits permission sync events using ReactHost (New Architecture safe). */
object PermissionEventEmitter {
  fun emit(application: Application) {
    val reactContext = resolveReactContext(application) ?: return

    if (!reactContext.hasActiveReactInstance()) {
      return
    }

    reactContext.runOnUiQueueThread {
      if (reactContext.hasActiveReactInstance()) {
        reactContext.emitDeviceEvent(PermissionEvents.PERMISSIONS_CHANGED_EVENT, null)
      }
    }
  }

  private fun resolveReactContext(application: Application): ReactContext? =
      (application as? ReactApplication)?.reactHost?.currentReactContext
}
