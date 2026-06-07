package com.focusguard.e2e

/** Applies Detox launchArgs to MMKV and permission mocks before React Native starts. */
object E2EBootstrap {
    private data class PresetFlags(
        val resetStorage: Boolean,
        val skipOnboarding: Boolean,
        val permissionsGranted: Boolean,
    )

    private val presets =
        mapOf(
            "fresh" to PresetFlags(resetStorage = true, skipOnboarding = false, permissionsGranted = false),
            "onboarding" to PresetFlags(resetStorage = true, skipOnboarding = false, permissionsGranted = false),
            "permissions" to PresetFlags(resetStorage = true, skipOnboarding = true, permissionsGranted = false),
            "dashboard" to PresetFlags(resetStorage = true, skipOnboarding = true, permissionsGranted = true),
        )

    fun applyFromCachedLaunchArgs() {
        if (!E2EFeature.isEnabled()) {
            return
        }

        val presetFlags = E2ELaunchArgs.get("e2ePreset")?.let { presets[it] }
        if (presetFlags != null) {
            apply(presetFlags)
            return
        }

        val resetStorage = E2ELaunchArgs.get("e2eResetStorage") == "true"
        val skipOnboarding = E2ELaunchArgs.get("e2eSkipOnboarding") == "true"
        val permissionsGranted = E2ELaunchArgs.get("e2ePermissionsGranted") == "true"

        if (!resetStorage && !skipOnboarding && !permissionsGranted) {
            return
        }

        apply(
            PresetFlags(
                resetStorage = resetStorage,
                skipOnboarding = skipOnboarding,
                permissionsGranted = permissionsGranted,
            ),
        )
    }

    private fun apply(flags: PresetFlags) {
        if (flags.resetStorage) {
            E2EAppState.resetStorage()
        }

        if (flags.skipOnboarding) {
            E2EAppState.setOnboardingComplete()
        }

        E2EPermissionOverride.permissionsGranted = flags.permissionsGranted
    }
}
