package com.focusguard

import com.focusguard.overlay.TrackingSnoozeStore

/** Shared limit and snooze evaluation for [TrackingEngine] and the home-screen widget. */
internal object NextBlockResolver {

    data class NextBlock(
        val remainingMs: Long,
        val packageName: String,
        val appLabel: String,
        /** True when [remainingMs] is snooze time for an app already over its daily hard block. */
        val isSnoozeCountdown: Boolean,
    )

    sealed interface AppBlockState {
        data class UnderLimit(val remainingUntilBlockMs: Long) : AppBlockState

        data class SnoozeCountdown(val remainingMs: Long) : AppBlockState

        data object HardBlocked : AppBlockState
    }

    fun resolveAppBlockState(packageName: String, usedMs: Long): AppBlockState {
        val limits = TrackingConfigRepository.getLimitConfig(packageName)
        return resolveAppBlockState(
            usedMs = usedMs,
            hardBlockThresholdMs = limits.hardBlockThresholdMs,
            snoozeRemainingMs = TrackingSnoozeStore.getRemainingMs(packageName),
        )
    }

    internal fun resolveAppBlockState(
        usedMs: Long,
        hardBlockThresholdMs: Long,
        snoozeRemainingMs: Long,
    ): AppBlockState {
        val remainingMs = hardBlockThresholdMs - usedMs

        if (remainingMs > 0L) {
            return AppBlockState.UnderLimit(remainingMs)
        }

        if (snoozeRemainingMs > 0L) {
            return AppBlockState.SnoozeCountdown(snoozeRemainingMs)
        }

        return AppBlockState.HardBlocked
    }

    fun findNearestNextBlock(
        trackedApps: Iterable<String>,
        usedMsFor: (String) -> Long,
        labelFor: (String) -> String,
        blockStateFor: (String, Long) -> AppBlockState = { packageName, usedMs ->
            resolveAppBlockState(packageName, usedMs)
        },
    ): Pair<NextBlock?, String?> {
        var nearest: NextBlock? = null
        var blockedLabel: String? = null

        for (packageName in trackedApps) {
            when (val state = blockStateFor(packageName, usedMsFor(packageName))) {
                is AppBlockState.UnderLimit -> {
                    val candidate =
                        NextBlock(
                            remainingMs = state.remainingUntilBlockMs,
                            packageName = packageName,
                            appLabel = labelFor(packageName),
                            isSnoozeCountdown = false,
                        )
                    if (nearest == null || candidate.remainingMs < nearest.remainingMs) {
                        nearest = candidate
                    }
                }

                is AppBlockState.SnoozeCountdown -> {
                    val candidate =
                        NextBlock(
                            remainingMs = state.remainingMs,
                            packageName = packageName,
                            appLabel = labelFor(packageName),
                            isSnoozeCountdown = true,
                        )
                    if (nearest == null || candidate.remainingMs < nearest.remainingMs) {
                        nearest = candidate
                    }
                }

                is AppBlockState.HardBlocked -> {
                    if (blockedLabel == null) {
                        blockedLabel = labelFor(packageName)
                    }
                }
            }
        }

        return nearest to blockedLabel
    }
}
