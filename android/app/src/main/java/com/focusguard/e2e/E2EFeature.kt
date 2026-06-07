package com.focusguard.e2e

import com.focusguard.BuildConfig

/** True in debug and in the release-like `e2eRelease` build used for Detox. */
internal object E2EFeature {
    fun isEnabled(): Boolean = BuildConfig.DEBUG || BuildConfig.E2E_ENABLED
}
