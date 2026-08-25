package com.focusguard.storage

import org.json.JSONObject

/**
 * Flat settings snapshot written via Turbo Module [syncSettingsConfig]
 * (or JS MMKV when native is unavailable).
 *
 * In-process memory cache skips MMKV [decodeString] after the first load; writers must
 * go through [write] (or [invalidateCache]).
 */
internal object NativeSettingsSnapshot {

    data class Snapshot(
        val themePreference: String,
        val notificationsEnabled: Boolean,
    )

    private var memoryCacheLoaded = false
    private var cachedSnapshot: Snapshot? = null

    fun read(): Snapshot? {
        if (memoryCacheLoaded) {
            return cachedSnapshot
        }

        val raw = KeeptStorage.mmkv.decodeString(PersistSchema.NATIVE_SETTINGS_SNAPSHOT_KEY)
        if (raw != null) {
            val snapshot = parse(raw)
            memoryCacheLoaded = true
            cachedSnapshot = snapshot
            return snapshot
        }

        val migrated = migrateFromLegacyZustand()
        if (migrated != null) {
            write(buildJson(migrated.themePreference, migrated.notificationsEnabled))
            return migrated
        }

        memoryCacheLoaded = true
        cachedSnapshot = null
        return null
    }

    fun write(snapshotJson: String) {
        KeeptStorage.mmkv.encode(PersistSchema.NATIVE_SETTINGS_SNAPSHOT_KEY, snapshotJson)
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
