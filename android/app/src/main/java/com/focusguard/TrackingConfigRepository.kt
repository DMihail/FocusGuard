package com.focusguard

import com.tencent.mmkv.MMKV
import org.json.JSONObject

/**
 * Reads tracked apps and per-app limits from the same MMKV instance as the JS layer.
 *
 * - Selected apps: `selected-apps-storage` (zustand `selectedAppsStore`)
 * - Limits: `app-limits-storage` (zustand `appLimitsStore`)
 */
class TrackingConfigRepository {

    private val mmkv: MMKV? =
        MMKV.mmkvWithID(MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

    /** @return package names from the selected apps store. */
    fun getTrackedApps(): List<String> {
        val raw = mmkv?.decodeString(SELECTED_APPS_KEY) ?: return emptyList()

        return try {
            val state = JSONObject(raw).optJSONObject("state") ?: return emptyList()
            val apps = state.optJSONArray("apps") ?: return emptyList()

            (0 until apps.length()).mapNotNull { i ->
                apps.getJSONObject(i).optString("packageName").takeIf { it.isNotEmpty() }
            }
        } catch (_: Exception) {
            emptyList()
        }
    }

    /** @return limit config for [packageName], or defaults when not configured. */
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
        val raw = mmkv?.decodeString(APP_LIMITS_KEY) ?: return null

        return try {
            val state = JSONObject(raw).optJSONObject("state") ?: return null
            state.optJSONObject("limitsByPackage")
        } catch (_: Exception) {
            null
        }
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
        private const val MMKV_INSTANCE_ID = "focus-guard-storage"
        private const val SELECTED_APPS_KEY = "selected-apps-storage"
        private const val APP_LIMITS_KEY = "app-limits-storage"

        private const val DEFAULT_WARNING_MINUTES = 45
        private const val DEFAULT_HARD_BLOCK_MINUTES = 60
        // Keep in sync with source/store/constants/appLimits.ts
        private const val WARNING_MIN_MINUTES = 5
        private const val WARNING_MAX_MINUTES = 180
        private const val HARD_BLOCK_MIN_MINUTES = 10
        private const val HARD_BLOCK_MAX_MINUTES = 240
    }
}
