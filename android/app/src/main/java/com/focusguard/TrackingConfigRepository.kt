package com.focusguard

import com.focusguard.storage.PersistSchema
import com.focusguard.storage.ZustandPersistReader
import com.tencent.mmkv.MMKV
import org.json.JSONObject

/**
 * Reads tracked apps and per-app limits from the same MMKV instance as the JS layer.
 */
class TrackingConfigRepository {

    private val mmkv: MMKV? =
        MMKV.mmkvWithID(PersistSchema.MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

    private var cachedSelectedAppsRaw: String? = null
    private var cachedTrackedApps: List<String>? = null
    private var cachedLimitsRaw: String? = null
    private var cachedLimitsJson: JSONObject? = null

    fun getTrackedApps(): List<String> {
        val raw = mmkv?.decodeString(PersistSchema.SELECTED_APPS_STORAGE_KEY) ?: return emptyList()

        if (raw == cachedSelectedAppsRaw && cachedTrackedApps != null) {
            return cachedTrackedApps!!
        }

        val trackedApps =
            try {
                val state =
                    ZustandPersistReader.readStateIfCompatible(
                        raw,
                        PersistSchema.SELECTED_APPS_PERSIST_VERSION,
                        PersistSchema.SELECTED_APPS_STORAGE_KEY,
                    ) ?: return emptyList()
                val apps = state.optJSONArray("apps") ?: return emptyList()

                (0 until apps.length()).mapNotNull { i ->
                    apps.getJSONObject(i).optString("packageName").takeIf { it.isNotEmpty() }
                }
            } catch (_: Exception) {
                emptyList()
            }

        cachedSelectedAppsRaw = raw
        cachedTrackedApps = trackedApps
        return trackedApps
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
        val raw = mmkv?.decodeString(PersistSchema.APP_LIMITS_STORAGE_KEY) ?: return null

        if (raw == cachedLimitsRaw) {
            return cachedLimitsJson
        }

        val limitsJson =
            try {
                val state =
                    ZustandPersistReader.readStateIfCompatible(
                        raw,
                        PersistSchema.APP_LIMITS_PERSIST_VERSION,
                        PersistSchema.APP_LIMITS_STORAGE_KEY,
                    ) ?: return null
                state.optJSONObject("limitsByPackage")
            } catch (_: Exception) {
                null
            }

        cachedLimitsRaw = raw
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

    companion object {
        private const val DEFAULT_WARNING_MINUTES = 45
        private const val DEFAULT_HARD_BLOCK_MINUTES = 60
        private const val WARNING_MIN_MINUTES = 5
        private const val WARNING_MAX_MINUTES = 180
        private const val HARD_BLOCK_MIN_MINUTES = 10
        private const val HARD_BLOCK_MAX_MINUTES = 240
    }
}
