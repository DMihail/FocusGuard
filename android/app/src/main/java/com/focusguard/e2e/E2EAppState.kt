package com.focusguard.e2e

import com.tencent.mmkv.MMKV

/** Seeds or clears MMKV state for Detox bootstrap. */
object E2EAppState {
    private const val MMKV_INSTANCE_ID = "focus-guard-storage"

    private val storageKeys =
        listOf(
            "onboarding-storage",
            "selected-apps-storage",
            "app-limits-storage",
            "monitoring-storage",
            "settings-storage",
        )

    fun resetStorage() {
        val mmkv = mmkv() ?: return
        storageKeys.forEach { key -> mmkv.removeValueForKey(key) }
    }

    fun setOnboardingComplete() {
        val mmkv = mmkv() ?: return
        mmkv.encode("onboarding-storage", """{"state":{"isConfirm":true},"version":0}""")
    }

    private fun mmkv(): MMKV? =
        MMKV.mmkvWithID(MMKV_INSTANCE_ID, MMKV.MULTI_PROCESS_MODE)
}
