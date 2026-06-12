package com.focusguard.monitor

import android.content.Context
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.focusguard.permissions.BatteryOptimizationAccess

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

    companion object {
        fun resolveStartFailureReason(context: Context): String? =
            when {
                !MonitorPermissions.hasManifestMonitorPermissions(context) ->
                    "manifest_permissions_missing"
                !UsageAccess.hasAccess(context) -> "usage_access_missing"
                !OverlayAccess.hasAccess(context) -> "overlay_access_missing"
                !BatteryOptimizationAccess.isExempt(context) -> "battery_optimization_missing"
                else -> null
            }
    }
}
