package com.focusguard.monitor

/** Debounces raw foreground detections before [com.focusguard.TrackingEngine] acts on app switches. */
internal class ForegroundStabilizer(
    private val stablePollsRequired: Int = STABLE_POLLS,
    private val missPollsRequired: Int = MISS_POLLS,
) {
    var stableForeground: String? = null
        private set

    private var foregroundCandidate: String? = null
    private var foregroundCandidateHits = 0
    private var foregroundMisses = 0

    fun resolve(raw: String?): String? {
        if (raw == null) {
            foregroundMisses++
            if (foregroundMisses >= missPollsRequired) {
                stableForeground = null
                foregroundCandidate = null
                foregroundCandidateHits = 0
            }
            return stableForeground
        }

        foregroundMisses = 0

        if (raw == foregroundCandidate) {
            foregroundCandidateHits++
        } else {
            foregroundCandidate = raw
            foregroundCandidateHits = 1
        }

        if (foregroundCandidateHits >= stablePollsRequired) {
            stableForeground = raw
        }

        return stableForeground
    }

    fun reset() {
        stableForeground = null
        foregroundCandidate = null
        foregroundCandidateHits = 0
        foregroundMisses = 0
    }

    companion object {
        /** Require two consecutive polls before switching to a different package. */
        const val STABLE_POLLS = 2
        const val MISS_POLLS = 3
    }
}
