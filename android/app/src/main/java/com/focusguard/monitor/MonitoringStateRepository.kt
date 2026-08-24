package com.focusguard.monitor

import com.focusguard.storage.NativeMonitoringSnapshot

/**
 * Reads monitoring enabled flag from the flat native monitoring snapshot
 * (`syncMonitoringState` / [NativeMonitoringSnapshot]). No Zustand persist fallback
 * (legacy blobs are migrated once inside the snapshot reader).
 */
internal object MonitoringStateRepository {

    /** @return `true` when the user last enabled Focus Mode in JS. */
    fun isMonitoringEnabled(): Boolean =
        NativeMonitoringSnapshot.read()?.isMonitoring == true
}
