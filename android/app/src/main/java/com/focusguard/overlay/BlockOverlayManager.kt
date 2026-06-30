package com.focusguard.overlay

import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.TextView
import com.focusguard.R
import com.focusguard.monitor.OverlayAccess
import com.focusguard.widget.WidgetUpdater

/**
 * Draws a full-screen block UI above other apps using [WindowManager].
 *
 * Activity-based overlays are unreliable on MIUI/HyperOS because background activity
 * launches are blocked even when "Display over other apps" is granted.
 */
object BlockOverlayManager {

    const val EXTRA_PACKAGE_NAME = "extra_package_name"
    const val EXTRA_APP_NAME = "extra_app_name"
    const val EXTRA_STRICT_MODE = "extra_strict_mode"
    const val EXTRA_SNOOZE_MINUTES = "extra_snooze_minutes"

    @Volatile
    private var overlayView: View? = null

    @Volatile
    private var windowManager: WindowManager? = null

    @Volatile
    private var showingPackage: String? = null

    fun isShowing(): Boolean = overlayView != null

    fun getShowingPackage(): String? = showingPackage

    /** @return true when the overlay view was attached successfully. */
    fun show(context: Context, packageName: String, appName: String, strictMode: Boolean): Boolean {
        val appContext = context.applicationContext

        if (!OverlayAccess.hasAccess(appContext)) {
            logDebug("Overlay permission missing — cannot show block UI")
            return false
        }

        if (isShowing() && showingPackage == packageName) {
            return true
        }

        if (isShowing()) {
            dismiss(appContext)
        }

        return try {
            attachOverlay(appContext, packageName, appName, strictMode)
            true
        } catch (error: Exception) {
            logDebug("Failed to attach block overlay: ${error.message}")
            detachOverlay()
            false
        }
    }

    fun dismiss(context: Context) {
        detachOverlay()
    }

    private fun attachOverlay(
        context: Context,
        packageName: String,
        appName: String,
        strictMode: Boolean,
    ) {
        val wm = context.getSystemService(WindowManager::class.java)
            ?: throw IllegalStateException("WindowManager unavailable")

        val view = LayoutInflater.from(context).inflate(R.layout.activity_block_overlay, null)
        val resolvedAppName = appName.ifEmpty { context.getString(R.string.app_name) }

        view.findViewById<TextView>(R.id.block_overlay_app_name).text = resolvedAppName

        val snoozeButton = view.findViewById<TextView>(R.id.block_overlay_snooze)
        if (strictMode) {
            snoozeButton.visibility = View.GONE
        } else {
            snoozeButton.setOnClickListener {
                TrackingSnoozeStore.setSnooze(
                    packageName,
                    SNOOZE_MINUTES * 60_000L,
                )
                WidgetUpdater.scheduleUpdate(context, force = true)
                dismiss(context)
            }
        }

        view.findViewById<TextView>(R.id.block_overlay_home).setOnClickListener {
            context.startActivity(
                Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                },
            )
            dismiss(context)
        }

        val layoutParams =
            WindowManager.LayoutParams(
                WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.MATCH_PARENT,
                overlayWindowType(),
                overlayWindowFlags(),
                PixelFormat.OPAQUE,
            ).apply {
                gravity = Gravity.TOP or Gravity.START
                title = "FocusGuardBlockOverlay"
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                    layoutInDisplayCutoutMode =
                        WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
                }
            }

        wm.addView(view, layoutParams)

        overlayView = view
        windowManager = wm
        showingPackage = packageName

        logDebug("Block overlay attached for $packageName")
    }

    private fun detachOverlay() {
        val view = overlayView
        val wm = windowManager

        overlayView = null
        windowManager = null
        showingPackage = null

        if (view == null || wm == null) {
            return
        }

        try {
            wm.removeView(view)
            logDebug("Block overlay detached")
        } catch (error: Exception) {
            logDebug("Failed to detach block overlay: ${error.message}")
        }
    }

    private fun overlayWindowType(): Int =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE
        }

    private fun overlayWindowFlags(): Int {
        var flags =
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            @Suppress("DEPRECATION")
            flags = flags or WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
        }

        return flags
    }

    private fun logDebug(message: String) {
        if (com.focusguard.BuildConfig.DEBUG) {
            Log.d(TAG, message)
        }
    }

    private const val TAG = "BlockOverlayManager"
    private const val SNOOZE_MINUTES = 5
}
