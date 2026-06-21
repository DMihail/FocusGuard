package com.focusguard.storage

/** Persists a confirmed Usage Stats grant across OEM AppOps flicker (e.g. after overlay settings). */
internal object UsageAccessGrantStore {

    fun isGranted(): Boolean = KeeptMmkv.instance.decodeBool(PersistSchema.USAGE_ACCESS_GRANTED_KEY, false)

    fun markGranted() {
        KeeptMmkv.instance.encode(PersistSchema.USAGE_ACCESS_GRANTED_KEY, true)
    }

    fun clear() {
        KeeptMmkv.instance.removeValueForKey(PersistSchema.USAGE_ACCESS_GRANTED_KEY)
    }
}
