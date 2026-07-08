package com.focusguard.react

import android.app.Application
import android.content.Context
import com.facebook.react.ReactApplication
import java.util.concurrent.CopyOnWriteArraySet

/** Routes native lifecycle signals to active Turbo Module listeners. */
object TurboModuleEventDispatchers {
    private val permissionsChangedListeners = CopyOnWriteArraySet<() -> Unit>()
    private val localDayChangedListeners = CopyOnWriteArraySet<(dayKey: String) -> Unit>()
    private val monitorServiceStateListeners = CopyOnWriteArraySet<(isRunning: Boolean) -> Unit>()
    private val trackedUsageChangedListeners = CopyOnWriteArraySet<() -> Unit>()

    @Volatile
    private var pendingPermissionsChanged = false

    @Volatile
    private var pendingLocalDayKey: String? = null

    @Volatile
    private var pendingMonitorServiceState: Boolean? = null

    fun registerPermissionsChanged(callback: () -> Unit) {
        permissionsChangedListeners.add(callback)
        replayPendingPermissionsChanged()
    }

    fun unregisterPermissionsChanged(callback: () -> Unit) {
        permissionsChangedListeners.remove(callback)
    }

    fun emitPermissionsChanged(context: Context) {
        val application = context.applicationContext as? Application
        if (application != null) {
            emitPermissionsChanged(application)
            return
        }

        emitPermissionsChangedOrPending()
    }

    fun emitPermissionsChanged(application: Application) {
        if (permissionsChangedListeners.isEmpty()) {
            pendingPermissionsChanged = true
            dispatchOnUiQueue(application) {
                replayPendingPermissionsChanged()
            }
            return
        }

        permissionsChangedListeners.forEach { listener ->
            listener()
        }
    }

    fun registerLocalDayChanged(callback: (dayKey: String) -> Unit) {
        localDayChangedListeners.add(callback)
        replayPendingLocalDayChanged()
    }

    fun unregisterLocalDayChanged(callback: (dayKey: String) -> Unit) {
        localDayChangedListeners.remove(callback)
    }

    fun emitLocalDayChanged(context: Context, dayKey: String) {
        val application = context.applicationContext as? Application
        if (application != null) {
            emitLocalDayChanged(application, dayKey)
            return
        }

        emitLocalDayChangedOrPending(dayKey)
    }

    fun emitLocalDayChanged(application: Application, dayKey: String) {
        if (localDayChangedListeners.isEmpty()) {
            pendingLocalDayKey = dayKey
            dispatchOnUiQueue(application) {
                replayPendingLocalDayChanged()
            }
            return
        }

        localDayChangedListeners.forEach { listener ->
            listener(dayKey)
        }
    }

    fun storePendingLocalDayChanged(dayKey: String) {
        pendingLocalDayKey = dayKey
    }

    fun storePendingMonitorServiceState(isRunning: Boolean) {
        pendingMonitorServiceState = isRunning
    }

    fun registerMonitorServiceState(callback: (isRunning: Boolean) -> Unit) {
        monitorServiceStateListeners.add(callback)
        replayPendingMonitorServiceState()
    }

    fun unregisterMonitorServiceState(callback: (isRunning: Boolean) -> Unit) {
        monitorServiceStateListeners.remove(callback)
    }

    fun emitMonitorServiceState(context: Context, isRunning: Boolean) {
        val application = context.applicationContext as? Application
        if (application != null) {
            emitMonitorServiceState(application, isRunning)
            return
        }

        emitMonitorServiceStateOrPending(isRunning)
    }

    fun emitMonitorServiceState(application: Application, isRunning: Boolean) {
        if (monitorServiceStateListeners.isEmpty()) {
            pendingMonitorServiceState = isRunning
            dispatchOnUiQueue(application) {
                replayPendingMonitorServiceState()
            }
            return
        }

        monitorServiceStateListeners.forEach { listener ->
            listener(isRunning)
        }
    }

    fun registerTrackedUsageChanged(callback: () -> Unit) {
        trackedUsageChangedListeners.add(callback)
    }

    fun unregisterTrackedUsageChanged(callback: () -> Unit) {
        trackedUsageChangedListeners.remove(callback)
    }

    fun emitTrackedUsageChanged(context: Context) {
        val application = context.applicationContext as? Application
        if (application != null) {
            emitTrackedUsageChanged(application)
            return
        }

        emitTrackedUsageChangedOrPending()
    }

    fun emitTrackedUsageChanged(application: Application) {
        if (trackedUsageChangedListeners.isEmpty()) {
            return
        }

        trackedUsageChangedListeners.forEach { listener ->
            listener()
        }
    }

    /** @internal Unit-test reset. */
    internal fun resetForTests() {
        permissionsChangedListeners.clear()
        localDayChangedListeners.clear()
        monitorServiceStateListeners.clear()
        trackedUsageChangedListeners.clear()
        pendingPermissionsChanged = false
        pendingLocalDayKey = null
        pendingMonitorServiceState = null
    }

    /** @internal Unit-test emit without a React [Application]. */
    internal fun emitPermissionsChanged() {
        emitPermissionsChangedOrPending()
    }

    /** @internal Unit-test emit without a React [Application]. */
    internal fun emitLocalDayChanged(dayKey: String) {
        emitLocalDayChangedOrPending(dayKey)
    }

    /** @internal Unit-test emit without a React [Application]. */
    internal fun emitMonitorServiceState(isRunning: Boolean) {
        emitMonitorServiceStateOrPending(isRunning)
    }

    /** @internal Unit-test emit without a React [Application]. */
    internal fun emitTrackedUsageChanged() {
        emitTrackedUsageChangedOrPending()
    }

    private fun emitPermissionsChangedOrPending() {
        if (permissionsChangedListeners.isEmpty()) {
            pendingPermissionsChanged = true
            return
        }

        permissionsChangedListeners.forEach { listener ->
            listener()
        }
    }

    private fun emitLocalDayChangedOrPending(dayKey: String) {
        if (localDayChangedListeners.isEmpty()) {
            pendingLocalDayKey = dayKey
            return
        }

        localDayChangedListeners.forEach { listener ->
            listener(dayKey)
        }
    }

    private fun emitMonitorServiceStateOrPending(isRunning: Boolean) {
        if (monitorServiceStateListeners.isEmpty()) {
            pendingMonitorServiceState = isRunning
            return
        }

        monitorServiceStateListeners.forEach { listener ->
            listener(isRunning)
        }
    }

    private fun emitTrackedUsageChangedOrPending() {
        if (trackedUsageChangedListeners.isEmpty()) {
            return
        }

        trackedUsageChangedListeners.forEach { listener ->
            listener()
        }
    }

    private fun replayPendingPermissionsChanged() {
        if (!pendingPermissionsChanged || permissionsChangedListeners.isEmpty()) {
            return
        }

        pendingPermissionsChanged = false
        permissionsChangedListeners.forEach { listener ->
            listener()
        }
    }

    private fun replayPendingLocalDayChanged() {
        val dayKey = pendingLocalDayKey ?: return
        if (localDayChangedListeners.isEmpty()) {
            return
        }

        pendingLocalDayKey = null
        localDayChangedListeners.forEach { listener ->
            listener(dayKey)
        }
    }

    internal fun replayPendingMonitorServiceState() {
        val isRunning = pendingMonitorServiceState ?: return
        if (monitorServiceStateListeners.isEmpty()) {
            return
        }

        pendingMonitorServiceState = null
        monitorServiceStateListeners.forEach { listener ->
            listener(isRunning)
        }
    }

    private fun dispatchOnUiQueue(application: Application, action: () -> Unit) {
        val reactContext =
            (application as? ReactApplication)?.reactHost?.currentReactContext ?: return

        if (!reactContext.hasActiveReactInstance()) {
            return
        }

        reactContext.runOnUiQueueThread(action)
    }
}
