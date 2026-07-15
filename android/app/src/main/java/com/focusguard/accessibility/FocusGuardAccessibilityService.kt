package com.focusguard.accessibility

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import com.focusguard.react.TurboModuleEventDispatchers

/**
 * Optional accessibility service for faster foreground detection during blocking.
 *
 * Observes window changes only — no node traversal, gestures, or screen content access.
 * UsageStats metering and the FGS poll loop remain the source of truth for daily limits.
 */
class FocusGuardAccessibilityService : AccessibilityService() {

    override fun onServiceConnected() {
        super.onServiceConnected()
        ForegroundAccessibilityBridge.onServiceConnected()
        TurboModuleEventDispatchers.emitPermissionsChanged(applicationContext)
    }

    override fun onDestroy() {
        ForegroundAccessibilityBridge.onServiceDisconnected()
        TurboModuleEventDispatchers.emitPermissionsChanged(applicationContext)
        super.onDestroy()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) {
            return
        }

        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED,
            AccessibilityEvent.TYPE_WINDOWS_CHANGED -> {
                val packageName =
                    event.packageName?.toString()?.takeIf { it.isNotEmpty() } ?: return
                if (packageName == applicationContext.packageName) {
                    return
                }

                ForegroundAccessibilityBridge.onForegroundWindowChanged(packageName)
            }
        }
    }

    override fun onInterrupt() {
        // No long-running work to cancel.
    }
}
