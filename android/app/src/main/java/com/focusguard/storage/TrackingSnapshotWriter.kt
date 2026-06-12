package com.focusguard.storage

import com.tencent.mmkv.MMKV

/** Writes the flat tracking snapshot consumed by the native monitor service. */
internal object TrackingSnapshotWriter {

    private val mmkv: MMKV? =
        MMKV.mmkvWithID(PersistSchema.MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)

    fun write(snapshotJson: String) {
        mmkv?.encode(PersistSchema.NATIVE_TRACKING_SNAPSHOT_KEY, snapshotJson)
        NativeTrackingSnapshot.invalidateCache()
    }
}
