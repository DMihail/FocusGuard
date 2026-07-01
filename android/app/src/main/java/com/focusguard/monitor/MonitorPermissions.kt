package com.focusguard.monitor

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat

/**
 * Centralized checks for all manifest-declared permissions required by [FocusGuardMonitorService].
 *
 * Each check returns `true` on API levels where the permission does not exist,
 * so callers don't need version-gating logic themselves.
 */
internal object MonitorPermissions {

    @Volatile
    private var cachedCanRun: Boolean? = null

    fun invalidateCache() {
        cachedCanRun = null
    }

    fun resolveStartFailureReason(context: Context): String? =
        when {
            !hasManifestMonitorPermissions(context) -> "manifest_permissions_missing"
            !UsageAccess.hasAccess(context) -> "usage_access_missing"
            !OverlayAccess.hasAccess(context) -> "overlay_access_missing"
            else -> null
        }

    /** @return `true` if the monitor service can be safely started. */
    fun canRunMonitorService(context: Context): Boolean {
        cachedCanRun?.let { return it }

        val canRun = resolveStartFailureReason(context) == null
        cachedCanRun = canRun
        return canRun
    }

    /**
     * @return `true` if every manifest permission needed by the monitor service is granted:
     * [FOREGROUND_SERVICE][Manifest.permission.FOREGROUND_SERVICE] (API 28+),
     * and [FOREGROUND_SERVICE_SPECIAL_USE][Manifest.permission.FOREGROUND_SERVICE_SPECIAL_USE] (API 34+).
     */
    fun hasManifestMonitorPermissions(context: Context): Boolean {
        return hasForegroundServicePermission(context) &&
            hasForegroundServiceSpecialUsePermission(context)
    }

    /** @return `true` if `FOREGROUND_SERVICE` is granted (always `true` below API 28). */
    fun hasForegroundServicePermission(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.P) {
            return true
        }

        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.FOREGROUND_SERVICE,
        ) == PackageManager.PERMISSION_GRANTED
    }

    /** @return `true` if `FOREGROUND_SERVICE_SPECIAL_USE` is granted (always `true` below API 34). */
    fun hasForegroundServiceSpecialUsePermission(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            return true
        }

        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.FOREGROUND_SERVICE_SPECIAL_USE,
        ) == PackageManager.PERMISSION_GRANTED
    }
}
