package com.focusguard.e2e

/** In-memory permission mocks for Detox — debug / e2eRelease builds only. */
object E2EPermissionOverride {
    @Volatile
    var permissionsGranted: Boolean = false

    fun isActive(): Boolean = E2EFeature.isEnabled() && permissionsGranted
}
