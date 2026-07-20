package com.focusguard.overlay

import android.content.Context
import android.view.View
import android.widget.TextView
import com.focusguard.R
import com.focusguard.widget.WidgetUpdater

/** Shared block-screen wiring for overlay and full-screen fallback activity. */
internal object BlockOverlayUi {
    fun bind(
        root: View,
        context: Context,
        packageName: String,
        appName: String,
        strictMode: Boolean,
        onDismiss: () -> Unit,
    ) {
        val resolvedAppName = appName.ifEmpty { context.getString(R.string.app_name) }
        root.findViewById<TextView>(R.id.block_overlay_app_name).text = resolvedAppName

        val snoozeButton = root.findViewById<TextView>(R.id.block_overlay_snooze)
        if (strictMode) {
            snoozeButton.visibility = View.GONE
        } else {
            snoozeButton.setOnClickListener {
                TrackingSnoozeStore.setSnooze(
                    packageName,
                    SNOOZE_MINUTES * 60_000L,
                )
                WidgetUpdater.scheduleUpdate(context, force = true)
                onDismiss()
            }
        }

        root.findViewById<TextView>(R.id.block_overlay_home).setOnClickListener {
            BlockOverlayManager.sendUserHome(context)
            onDismiss()
        }
    }

    private const val SNOOZE_MINUTES = 5
}
