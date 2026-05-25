package com.focusguard

import com.tencent.mmkv.MMKV
import org.json.JSONObject

/**
 * Reads the list of tracked (distracting) apps from the same MMKV instance
 * that the JS side uses via `react-native-mmkv` / zustand persist.
 *
 * MMKV instance ID: `focus-guard-storage` (matches `mmkv.ts`).
 * Zustand persist key: `selected-apps-storage` (matches `selectedAppsStore.ts`).
 *
 * Stored data format:
 * ```json
 * {"state":{"apps":[{"packageName":"com.example.app","appName":"Example",...}]},"version":0}
 * ```
 */
class TrackingConfigRepository {

    private val mmkv: MMKV? =
        MMKV.mmkvWithID(MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

    /**
     * @return list of package names from the zustand-persisted selected apps store,
     *         or an empty list if the key is absent or the JSON is malformed.
     */
    fun getTrackedApps(): List<String> {
        val raw = mmkv?.decodeString(ZUSTAND_PERSIST_KEY) ?: return emptyList()

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

    companion object {
        private const val MMKV_INSTANCE_ID = "focus-guard-storage"
        private const val ZUSTAND_PERSIST_KEY = "selected-apps-storage"
    }
}
