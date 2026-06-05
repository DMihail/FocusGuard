package com.focusguard.permissions

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent

/** Starts settings screens from an activity when available, otherwise from application context. */
internal object ActivityIntents {

    fun start(context: Context, intent: Intent, activity: Activity? = null) {
        try {
            if (activity != null) {
                activity.startActivity(intent)
            } else {
                context.startActivity(intent.apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK })
            }
        } catch (_: ActivityNotFoundException) {
            // Caller may try another intent.
        }
    }

    fun startFirstAvailable(
        context: Context,
        intents: List<Intent>,
        activity: Activity? = null,
    ): Boolean {
        for (intent in intents) {
            try {
                if (activity != null) {
                    activity.startActivity(intent)
                } else {
                    context.startActivity(intent.apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK })
                }
                return true
            } catch (_: ActivityNotFoundException) {
                // Try the next settings screen.
            }
        }

        return false
    }
}
