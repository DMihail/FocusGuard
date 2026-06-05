package com.focusguard.overlay

import android.content.Context
import android.content.Intent

/**
 * Starts and stops the full-screen block overlay activity.
 */
object BlockOverlayManager {

    const val EXTRA_PACKAGE_NAME = "extra_package_name"
    const val EXTRA_APP_NAME = "extra_app_name"
    const val EXTRA_STRICT_MODE = "extra_strict_mode"
    const val EXTRA_SNOOZE_MINUTES = "extra_snooze_minutes"

    @Volatile
    private var isShowing = false

    @Volatile
    private var showingPackage: String? = null

    fun show(context: Context, packageName: String, appName: String, strictMode: Boolean) {
        if (isShowing && showingPackage == packageName) {
            return
        }

        if (isShowing && showingPackage != packageName) {
            dismiss(context)
        }

        val intent = Intent(context, BlockOverlayActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra(EXTRA_PACKAGE_NAME, packageName)
            putExtra(EXTRA_APP_NAME, appName)
            putExtra(EXTRA_STRICT_MODE, strictMode)
        }

        context.startActivity(intent)
        isShowing = true
        showingPackage = packageName
    }

    fun dismiss(context: Context) {
        if (!isShowing) return

        val intent = Intent(context, BlockOverlayActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            action = BlockOverlayActivity.ACTION_DISMISS
        }

        context.startActivity(intent)
        isShowing = false
        showingPackage = null
    }

    fun onActivityShown(packageName: String) {
        isShowing = true
        showingPackage = packageName
    }

    fun onActivityHidden() {
        isShowing = false
        showingPackage = null
    }
}
