package com.focusguard.storage

import android.util.Log
import org.json.JSONObject

/** Parses Zustand `persist` JSON payloads written by the JS stores. */
internal object ZustandPersistReader {

    private const val TAG = "ZustandPersistReader"

    fun readStateIfCompatible(
        raw: String,
        maxSupportedVersion: Int,
        storageKey: String,
    ): JSONObject? {
        return try {
            val root = JSONObject(raw)
            val version = root.optInt("version", 0)

            if (version > maxSupportedVersion) {
                Log.w(
                    TAG,
                    "Unsupported persist version $version for $storageKey (max $maxSupportedVersion)",
                )
                return null
            }

            root.optJSONObject("state")
        } catch (error: Exception) {
            Log.w(TAG, "Failed to parse persist payload for $storageKey", error)
            null
        }
    }
}
