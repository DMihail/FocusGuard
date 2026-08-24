package com.focusguard

import android.app.Activity
import android.content.res.Configuration
import android.graphics.Color
import android.os.Build
import android.os.Looper
import androidx.core.view.WindowCompat

/**
 * Edge-to-edge system bar chrome: transparent bars + light/dark icon appearance only.
 *
 * Do not set [android.view.Window.setStatusBarColor] / navigationBarColor to opaque theme
 * colors — that fights React Native's [com.facebook.react.views.view.enableEdgeToEdge] when
 * `edgeToEdgeEnabled=true`, and is ignored on API 35+ when the OS enforces edge-to-edge.
 * Content padding comes from JS SafeArea / windowBackground.
 */
internal object SystemBarAppearance {

  fun apply(activity: Activity) {
    if (Looper.myLooper() != Looper.getMainLooper()) {
      activity.runOnUiThread { apply(activity) }
      return
    }

    val window = activity.window
    WindowCompat.setDecorFitsSystemWindows(window, false)

    @Suppress("DEPRECATION")
    run {
      window.statusBarColor = Color.TRANSPARENT
      window.navigationBarColor = Color.TRANSPARENT
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      window.isStatusBarContrastEnforced = false
      window.isNavigationBarContrastEnforced = false
    }

    val isDark =
        (activity.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES

    WindowCompat.getInsetsController(window, window.decorView).apply {
      isAppearanceLightStatusBars = !isDark
      isAppearanceLightNavigationBars = !isDark
    }
  }
}
