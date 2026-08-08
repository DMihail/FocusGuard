package com.focusguard

import com.focusguard.storage.NativeTrackingSnapshot
import org.json.JSONObject

/**
 * Reads tracked apps and per-app limits from the flat native tracking snapshot
 * (`syncTrackingConfig` / [NativeTrackingSnapshot]). No Zustand persist fallback.
 *
 * Negative lookups (missing snapshot) are not cached so a later JS sync can populate
 * tracked apps / limits without waiting for [invalidateCache].
 */
internal object TrackingConfigRepository {

    private const val DEFAULT_WARNING_MINUTES = 45
    private const val DEFAULT_HARD_BLOCK_MINUTES = 60
    private const val WARNING_MIN_MINUTES = 5
    private const val WARNING_MAX_MINUTES = 180
    private const val HARD_BLOCK_MIN_MINUTES = 10
    private const val HARD_BLOCK_MAX_MINUTES = 240

    private var cachedTrackedApps: List<String>? = null
    private var cachedTrackedAppsSet: Set<String>? = null
    private var cachedLimitsJson: JSONObject? = null

    fun invalidateCache() {
        cachedTrackedApps = null
        cachedTrackedAppsSet = null
        cachedLimitsJson = null
    }

    fun getTrackedAppsSet(): Set<String> {
        cachedTrackedAppsSet?.let { return it }

        val trackedApps = getTrackedApps()
        // Only cache after a successful snapshot read (non-null cache in getTrackedApps).
        if (cachedTrackedApps != null) {
            cachedTrackedAppsSet = trackedApps.toSet()
            return cachedTrackedAppsSet!!
        }

        return trackedApps.toSet()
    }

    fun getTrackedApps(): List<String> {
        cachedTrackedApps?.let { return it }

        val snapshot = NativeTrackingSnapshot.read() ?: return emptyList()
        return snapshot.trackedApps.also { trackedApps ->
            cachedTrackedApps = trackedApps
        }
    }

    fun getLimitConfig(packageName: String): AppLimitConfig {
        val limitsJson = loadLimitsJson() ?: return AppLimitConfig.defaults()
        val packageLimits = limitsJson.optJSONObject(packageName) ?: return AppLimitConfig.defaults()

        val warningMinutes = packageLimits.optInt("warningMinutes", DEFAULT_WARNING_MINUTES)
            .coerceIn(WARNING_MIN_MINUTES, WARNING_MAX_MINUTES)
        val hardBlockMinutes = packageLimits.optInt("hardBlockMinutes", DEFAULT_HARD_BLOCK_MINUTES)
            .coerceAtLeast(warningMinutes)
            .coerceIn(HARD_BLOCK_MIN_MINUTES, HARD_BLOCK_MAX_MINUTES)
        val strictMode = packageLimits.optBoolean("strictMode", false)

        return AppLimitConfig(
            warningThresholdMs = warningMinutes * 60_000L,
            hardBlockThresholdMs = hardBlockMinutes * 60_000L,
            strictMode = strictMode,
        )
    }

    private fun loadLimitsJson(): JSONObject? {
        cachedLimitsJson?.let { return it }

        val limitsJson = NativeTrackingSnapshot.read()?.limitsJson ?: return null
        cachedLimitsJson = limitsJson
        return limitsJson
    }

    data class AppLimitConfig(
        val warningThresholdMs: Long,
        val hardBlockThresholdMs: Long,
        val strictMode: Boolean,
    ) {
        companion object {
            fun defaults() = AppLimitConfig(
                warningThresholdMs = DEFAULT_WARNING_MINUTES * 60_000L,
                hardBlockThresholdMs = DEFAULT_HARD_BLOCK_MINUTES * 60_000L,
                strictMode = false,
            )
        }
    }
}
