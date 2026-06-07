package com.focusguard.e2e

import com.focusguard.BuildConfig

/** In-memory permission mocks for Detox — debug builds only. */
object E2EPermissionOverride {
    @Volatile
    var permissionsGranted: Boolean = false

    fun isActive(): Boolean = BuildConfig.DEBUG && permissionsGranted
}
