package com.focusguard.storage

import org.json.JSONObject

/** Flat tracking snapshot written via Turbo Module [syncTrackingConfig] (or JS MMKV when native is unavailable). */
internal object NativeTrackingSnapshot {

    data class Snapshot(
        val trackedApps: List<String>,
        val limitsJson: JSONObject?,
    )

    private var cachedRaw: String? = null
    private var cachedSnapshot: Snapshot? = null

    fun read(): Snapshot? {
        val raw = KeeptStorage.mmkv.decodeString(PersistSchema.NATIVE_TRACKING_SNAPSHOT_KEY) ?: return null

        if (raw == cachedRaw && cachedSnapshot != null) {
            return cachedSnapshot
        }

        val snapshot =
            try {
                val root = JSONObject(raw)
                val version = root.optInt("version", 0)

                if (version > PersistSchema.NATIVE_TRACKING_SNAPSHOT_VERSION) {
                    return null
                }

                val trackedApps =
                    root.optJSONArray("trackedApps")?.let { apps ->
                        (0 until apps.length()).mapNotNull { index ->
                            apps.optString(index).takeIf { it.isNotEmpty() }
                        }
                    } ?: emptyList()
                val limitsJson = root.optJSONObject("limitsByAppKey")

                Snapshot(trackedApps = trackedApps, limitsJson = limitsJson)
            } catch (_: Exception) {
                null
            }

        cachedRaw = raw
        cachedSnapshot = snapshot
        return snapshot
    }

    fun write(snapshotJson: String) {
        KeeptStorage.mmkv.encode(PersistSchema.NATIVE_TRACKING_SNAPSHOT_KEY, snapshotJson)
        invalidateCache()
    }

    fun invalidateCache() {
        cachedRaw = null
        cachedSnapshot = null
    }
}
