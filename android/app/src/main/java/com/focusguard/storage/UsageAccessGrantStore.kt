package com.focusguard.storage

/** Persists a confirmed Usage Stats grant across OEM AppOps flicker (e.g. after overlay settings). */
internal object UsageAccessGrantStore {

    private val mmkv get() = KeeptStorage.mmkv

    fun isGranted(): Boolean = mmkv.decodeBool(PersistSchema.USAGE_ACCESS_GRANTED_KEY, false)

    fun markGranted() {
        mmkv.encode(PersistSchema.USAGE_ACCESS_GRANTED_KEY, true)
    }

    fun clear() {
        mmkv.removeValueForKey(PersistSchema.USAGE_ACCESS_GRANTED_KEY)
    }
}
