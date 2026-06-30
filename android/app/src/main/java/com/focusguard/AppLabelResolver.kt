package com.focusguard

import android.content.pm.PackageManager

/** Resolves a human-readable label for an installed package. */
internal object AppLabelResolver {

    fun resolve(packageManager: PackageManager, packageName: String): String =
        try {
            val appInfo = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(appInfo).toString()
        } catch (_: PackageManager.NameNotFoundException) {
            packageName
        }
}
