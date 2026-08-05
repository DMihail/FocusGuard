package com.focusguard.monitor

import android.content.Context

/**
 * Ensures the monitor FGS is running when the user last left Focus Mode on.
 *
 * Used after boot / package replace (when Android blocks background FGS starts) and from
 * [com.focusguard.MainActivity] once the user is in the foreground.
 *
 * Pending resume is cleared only after the service is confirmed running — never before start.
 */
internal object MonitoringResume {

    /**
     * @return `true` when monitoring is enabled and the service is running (or was just started).
     */
    fun ensureRunning(context: Context): Boolean {
        val appContext = context.applicationContext
        val pending = MonitoringBootResumeStore.hasPending()
        val enabled = MonitoringStateRepository.isMonitoringEnabled()

        if (!enabled) {
            if (pending) {
                MonitoringBootResumeStore.clearPending()
                MonitoringBootResumeNotifier.cancel(appContext)
            }
            return false
        }

        if (MonitorServiceHelper.isRunning()) {
            if (pending) {
                MonitoringBootResumeStore.clearPending()
                MonitoringBootResumeNotifier.cancel(appContext)
            }
            return true
        }

        val result = MonitorServiceHelper.start(appContext)
        if (result.started || MonitorServiceHelper.isRunning()) {
            MonitoringBootResumeStore.clearPending()
            MonitoringBootResumeNotifier.cancel(appContext)
            return true
        }

        // Keep / set pending so unlock / next activity resume can retry (API 34+ FGS rules).
        if (!pending) {
            MonitoringBootResumeStore.markPending()
        }
        return false
    }
}
