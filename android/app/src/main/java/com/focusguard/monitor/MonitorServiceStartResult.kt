package com.focusguard.monitor

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

data class MonitorServiceStartResult(
    val started: Boolean,
    val reason: String? = null,
) {
    fun toWritableMap(): WritableMap =
        Arguments.createMap().apply {
            putBoolean("started", started)
            if (reason != null) {
                putString("reason", reason)
            }
        }
}
