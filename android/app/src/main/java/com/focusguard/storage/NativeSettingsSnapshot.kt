package com.focusguard.storage

import org.json.JSONObject

/**
 * Flat settings snapshot written via Turbo Module [syncSettingsConfig]
 * (or JS MMKV when native is unavailable).
 */
internal object NativeSettingsSnapshot {

    data class Snapshot(
        val themePreference: String,
        val notificationsEnabled: Boolean,
    )

    private var cachedRaw: String? = null
    private var cachedSnapshot: Snapshot? = null

    fun read(): Snapshot? {
        val raw = KeeptStorage.mmkv.decodeString(PersistSchema.NATIVE_SETTINGS_SNAPSHOT_KEY)
        if (raw != null) {
            return parseAndCache(raw)
        }

        return migrateFromLegacyZustand()?.also { migrated ->
            write(buildJson(migrated.themePreference, migrated.notificationsEnabled))
        }
    }

    fun write(snapshotJson: String) {
        KeeptStorage.mmkv.encode(PersistSchema.NATIVE_SETTINGS_SNAPSHOT_KEY, snapshotJson)
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
                if (version > PersistSchema.NATIVE_SETTINGS_SNAPSHOT_VERSION) {
                    return null
                }
                Snapshot(
                    themePreference = root.optString("themePreference", "system"),
                    notificationsEnabled = root.optBoolean("notificationsEnabled", true),
                )
            } catch (_: Exception) {
                null
            }

        cachedRaw = raw
        cachedSnapshot = snapshot
        return snapshot
    }

    private fun migrateFromLegacyZustand(): Snapshot? {
        val raw =
            KeeptStorage.mmkv.decodeString(PersistSchema.LEGACY_SETTINGS_STORAGE_KEY) ?: return null
        val state =
            ZustandPersistReader.readStateIfCompatible(
                raw,
                PersistSchema.LEGACY_SETTINGS_PERSIST_VERSION,
                PersistSchema.LEGACY_SETTINGS_STORAGE_KEY,
            ) ?: return null
        return Snapshot(
            themePreference = state.optString("themePreference", "system"),
            notificationsEnabled = state.optBoolean("notificationsEnabled", true),
        )
    }

    private fun buildJson(themePreference: String, notificationsEnabled: Boolean): String =
        JSONObject()
            .put("version", PersistSchema.NATIVE_SETTINGS_SNAPSHOT_VERSION)
            .put("themePreference", themePreference)
            .put("notificationsEnabled", notificationsEnabled)
            .toString()
}
