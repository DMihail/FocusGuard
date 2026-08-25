package com.focusguard.storage

import org.json.JSONObject

/**
 * Flat monitoring snapshot written via Turbo Module [syncMonitoringState]
 * (or JS MMKV when native is unavailable).
 *
 * In-process memory cache skips MMKV [decodeString] on the FGS poll loop; writers must
 * go through [write] (or [invalidateCache]) so multi-process MMKV updates are visible.
 */
internal object NativeMonitoringSnapshot {

    data class Snapshot(val isMonitoring: Boolean)

    private var memoryCacheLoaded = false
    private var cachedSnapshot: Snapshot? = null

    fun read(): Snapshot? {
        if (memoryCacheLoaded) {
            return cachedSnapshot
        }

        val raw = KeeptStorage.mmkv.decodeString(PersistSchema.NATIVE_MONITORING_SNAPSHOT_KEY)
        if (raw != null) {
            val snapshot = parse(raw)
            memoryCacheLoaded = true
            cachedSnapshot = snapshot
            return snapshot
        }

        val migrated = migrateFromLegacyZustand()
        if (migrated != null) {
            write(buildJson(migrated.isMonitoring))
            return migrated
        }

        memoryCacheLoaded = true
        cachedSnapshot = null
        return null
    }

    fun write(snapshotJson: String) {
        KeeptStorage.mmkv.encode(PersistSchema.NATIVE_MONITORING_SNAPSHOT_KEY, snapshotJson)
        memoryCacheLoaded = true
        cachedSnapshot = parse(snapshotJson)
    }

    fun invalidateCache() {
        memoryCacheLoaded = false
        cachedSnapshot = null
    }

    private fun parse(raw: String): Snapshot? {
        return try {
            val root = JSONObject(raw)
            val version = root.optInt("version", 0)
            if (version > PersistSchema.NATIVE_MONITORING_SNAPSHOT_VERSION) {
                return null
            }
            Snapshot(isMonitoring = root.optBoolean("isMonitoring", false))
        } catch (_: Exception) {
            null
        }
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
