package com.focusguard.platform

import android.content.Context
import com.focusguard.BuildConfig
import com.focusguard.R

/** Reads user-facing app metadata from Android resources and build config. */
internal object AppInfo {

    fun getDisplayName(context: Context): String = context.getString(R.string.app_name)

    fun getVersionName(): String = BuildConfig.VERSION_NAME
}
