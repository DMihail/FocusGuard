package com.focusguard.e2e

import android.app.Activity
import android.content.Intent
import android.os.Bundle

/** Reads Detox launchArgs from the current activity intent. */
object E2ELaunchArgs {
    private var cached: Map<String, String>? = null

    fun bindFromActivity(activity: Activity?) {
        cached = readExtras(activity?.intent)
    }

    fun get(key: String): String? = cached?.get(key)

    fun clear() {
        cached = null
    }

    private fun readExtras(intent: Intent?): Map<String, String> {
        val extras: Bundle = intent?.extras ?: return emptyMap()
        val result = linkedMapOf<String, String>()

        for (key in extras.keySet()) {
            when (val value = extras.get(key)) {
                is String -> result[key] = value
                is Boolean -> result[key] = value.toString()
                is Int -> result[key] = value.toString()
                is Long -> result[key] = value.toString()
                is Double -> result[key] = value.toString()
                is Float -> result[key] = value.toString()
            }
        }

        return result
    }
}
