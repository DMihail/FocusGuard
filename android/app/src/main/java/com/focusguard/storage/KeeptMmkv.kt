package com.focusguard.storage

import com.tencent.mmkv.MMKV

/** Shared MMKV instance for JS Zustand persistence and native monitor reads. */
internal object KeeptMmkv {
    val instance: MMKV by lazy {
        MMKV.mmkvWithID(PersistSchema.MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)
            ?: error("MMKV not initialized — call MMKV.initialize() in Application.onCreate")
    }
}
