package com.focusguard.monitor

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.SystemClock
import androidx.core.content.ContextCompat
import com.focusguard.permissions.BatteryOptimizationAccess

/**
 * Centralized checks for all manifest-declared permissions required by [FocusGuardMonitorService].
 *
 * Each check returns `true` on API levels where the permission does not exist,
 * so callers don't need version-gating logic themselves.
 */
internal object MonitorPermissions {

    private const val CACHE_TTL_MS = 45_000L

    @Volatile
    private var cachedCanRun: Boolean? = null

    @Volatile
    private var cachedAtElapsedMs: Long = 0L

    fun invalidateCache() {
        cachedCanRun = null
        cachedAtElapsedMs = 0L
    }

    fun resolveStartFailureReason(context: Context): String? =
        when {
            !hasManifestMonitorPermissions(context) -> "manifest_permissions_missing"
            !UsageAccess.hasAccess(context) -> "usage_access_missing"
            !OverlayAccess.hasAccess(context) -> "overlay_access_missing"
            !BatteryOptimizationAccess.isExempt(context) -> "battery_optimization_missing"
            else -> null
        }

    /** @return `true` if the monitor service can be safely started. */
    fun canRunMonitorService(context: Context): Boolean {
        val now = SystemClock.elapsedRealtime()
        val cached = cachedCanRun

        if (cached != null && now - cachedAtElapsedMs < CACHE_TTL_MS) {
            return cached
        }

        val canRun = resolveStartFailureReason(context) == null
        cachedCanRun = canRun
        cachedAtElapsedMs = now
        return canRun
    }

    /**
     * @return `true` if every manifest permission needed by the monitor service is granted:
     * [RECEIVE_BOOT_COMPLETED][Manifest.permission.RECEIVE_BOOT_COMPLETED],
     * [FOREGROUND_SERVICE][Manifest.permission.FOREGROUND_SERVICE] (API 28+),
     * and [FOREGROUND_SERVICE_SPECIAL_USE][Manifest.permission.FOREGROUND_SERVICE_SPECIAL_USE] (API 34+).
     */
    fun hasManifestMonitorPermissions(context: Context): Boolean {
        return hasReceiveBootCompletedPermission(context) &&
            hasForegroundServicePermission(context) &&
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

    private fun hasReceiveBootCompletedPermission(context: Context): Boolean {
        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.RECEIVE_BOOT_COMPLETED,
        ) == PackageManager.PERMISSION_GRANTED
    }
}
