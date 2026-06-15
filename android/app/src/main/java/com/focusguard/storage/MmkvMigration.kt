package com.focusguard.storage

import android.util.Log
import com.tencent.mmkv.MMKV

/** Copies legacy FocusGuard MMKV data into the Keept instance once per install. */
object MmkvMigration {
    private const val TAG = "MmkvMigration"

    fun migrateIfNeeded() {
        val target =
            MMKV.mmkvWithID(PersistSchema.MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE) ?: return

        if (target.decodeBool(PersistSchema.MMKV_MIGRATION_FLAG_KEY, false)) {
            return
        }

        val legacy =
            MMKV.mmkvWithID(PersistSchema.LEGACY_MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

        var copied = 0

        if (legacy != null) {
            for (key in PersistSchema.MMKV_MIGRATION_KEYS) {
                if (target.containsKey(key)) {
                    continue
                }

                val value = legacy.decodeString(key) ?: continue
                target.encode(key, value)
                copied += 1
            }
        }

        target.encode(PersistSchema.MMKV_MIGRATION_FLAG_KEY, true)
        Log.i(TAG, "MMKV migration complete (copied $copied keys)")
    }
}
