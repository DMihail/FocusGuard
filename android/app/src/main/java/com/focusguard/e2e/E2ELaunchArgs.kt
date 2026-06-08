package com.focusguard.e2e

import android.app.Activity
import android.content.Intent
import android.os.BaseBundle
import android.os.Build
import android.os.Bundle
import android.util.Base64
import androidx.core.os.BundleCompat
import androidx.test.platform.app.InstrumentationRegistry

/** Reads Detox launchArgs from instrumentation and activity intent. */
object E2ELaunchArgs {
    /** Detox nests decoded launch args under this intent extra key. */
    private const val DETOX_LAUNCH_ARGS_KEY = "launchArgs"

    private val reservedInstrumentationArgs =
        setOf("class", "package", "func", "unit", "size", "perf", "debug", "log", "emma", "coverageFile")

    private var cached: Map<String, String>? = null

    /** Reads Detox `-e` args from InstrumentationRegistry (base64-decoded). */
    fun bindFromInstrumentation(): Boolean {
        val instrumentationArgs = readInstrumentationArgsBundle() ?: return false
        cached = parseDetoxInstrumentationBundle(instrumentationArgs)
        return cached?.isNotEmpty() == true
    }

    fun bindFromActivity(activity: Activity?) {
        val fromIntent = readIntentLaunchArgs(activity?.intent)
        if (fromIntent.isNotEmpty()) {
            cached = fromIntent
            return
        }

        bindFromInstrumentation()
    }

    fun get(key: String): String? = cached?.get(key)

    private fun readIntentLaunchArgs(intent: Intent?): Map<String, String> {
        val extras: Bundle = intent?.extras ?: return emptyMap()
        val detoxLaunchArgs = extractNestedLaunchArgsBundle(extras)
        if (detoxLaunchArgs != null) {
            return flattenStringExtras(detoxLaunchArgs)
        }

        return flattenStringExtras(extras, skipKeys = setOf(DETOX_LAUNCH_ARGS_KEY))
    }

    private fun extractNestedLaunchArgsBundle(extras: Bundle): Bundle? {
        BundleCompat.getParcelable(extras, DETOX_LAUNCH_ARGS_KEY, Bundle::class.java)?.let {
            return it
        }

        @Suppress("DEPRECATION")
        extras.getBundle(DETOX_LAUNCH_ARGS_KEY)?.let {
            return it
        }

        if (Build.VERSION.SDK_INT < 33) {
            @Suppress("DEPRECATION")
            (extras.getParcelable(DETOX_LAUNCH_ARGS_KEY) as? Bundle)?.let {
                return it
            }
        }

        return null
    }

    private fun readInstrumentationArgsBundle(): Bundle? {
        if (!E2EFeature.isEnabled()) {
            return null
        }

        return try {
            InstrumentationRegistry.getArguments()
        } catch (_: Throwable) {
            null
        }
    }

    private fun parseDetoxInstrumentationBundle(bundle: Bundle): Map<String, String> {
        val result = linkedMapOf<String, String>()

        for (key in bundle.keySet()) {
            if (key in reservedInstrumentationArgs) {
                continue
            }

            val rawValue = bundle.getString(key) ?: continue
            result[key] = decodeDetoxInstrumentationValue(key, rawValue)
        }

        return result
    }

    private fun decodeDetoxInstrumentationValue(key: String, rawValue: String): String {
        if (key.startsWith("detox")) {
            return rawValue
        }

        return try {
            String(Base64.decode(rawValue, Base64.DEFAULT))
        } catch (_: IllegalArgumentException) {
            rawValue
        }
    }

    private fun flattenStringExtras(bundle: BaseBundle, skipKeys: Set<String> = emptySet()): Map<String, String> {
        val result = linkedMapOf<String, String>()

        for (key in bundle.keySet()) {
            if (key in skipKeys) {
                continue
            }

            bundle.getString(key)?.let { result[key] = it }
        }

        return result
    }
}
