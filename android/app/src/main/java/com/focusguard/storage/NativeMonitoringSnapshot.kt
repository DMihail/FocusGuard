package com.focusguard.storage

import org.json.JSONObject

/**
 * Flat monitoring snapshot written via Turbo Module [syncMonitoringState]
 * (or JS MMKV when native is unavailable).
 */
internal object NativeMonitoringSnapshot {

    data class Snapshot(val isMonitoring: Boolean)

    private var cachedRaw: String? = null
    private var cachedSnapshot: Snapshot? = null

    fun read(): Snapshot? {
        val raw = KeeptStorage.mmkv.decodeString(PersistSchema.NATIVE_MONITORING_SNAPSHOT_KEY)
        if (raw != null) {
            return parseAndCache(raw)
        }

        return migrateFromLegacyZustand()?.also { migrated ->
            write(buildJson(migrated.isMonitoring))
        }
    }

    fun write(snapshotJson: String) {
        KeeptStorage.mmkv.encode(PersistSchema.NATIVE_MONITORING_SNAPSHOT_KEY, snapshotJson)
        invalidateCache()
    }

    fun invalidateCache() {
        cachedRaw = null
        cachedSnapshot = null
    }

    private fun parseAndCache(raw: String): Snapshot? {
        if (raw == cachedRaw && cachedSnapshot != null) {
            return cachedSnapshot
        }

        val snapshot =
            try {
                val root = JSONObject(raw)
                val version = root.optInt("version", 0)
                if (version > PersistSchema.NATIVE_MONITORING_SNAPSHOT_VERSION) {
                    return null
                }
                Snapshot(isMonitoring = root.optBoolean("isMonitoring", false))
            } catch (_: Exception) {
                null
            }

        cachedRaw = raw
        cachedSnapshot = snapshot
        return snapshot
    }

    private fun migrateFromLegacyZustand(): Snapshot? {
        val raw =
            KeeptStorage.mmkv.decodeString(PersistSchema.LEGACY_MONITORING_STORAGE_KEY) ?: return null
        val state =
            ZustandPersistReader.readStateIfCompatible(
                raw,
                PersistSchema.LEGACY_MONITORING_PERSIST_VERSION,
                PersistSchema.LEGACY_MONITORING_STORAGE_KEY,
            ) ?: return null
        return Snapshot(isMonitoring = state.optBoolean("isMonitoring", false))
    }

    private fun buildJson(isMonitoring: Boolean): String =
        JSONObject()
            .put("version", PersistSchema.NATIVE_MONITORING_SNAPSHOT_VERSION)
            .put("isMonitoring", isMonitoring)
            .toString()
}
