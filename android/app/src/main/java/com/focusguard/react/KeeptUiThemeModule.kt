package com.focusguard.react

import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatDelegate
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.focusguard.SettingsRepository
import com.focusguard.widget.WidgetUpdater

/** Syncs JS theme preference with native DayNight resources (overlay, notifications). */
class KeeptUiThemeModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  private val mainHandler = Handler(Looper.getMainLooper())

  override fun getName(): String = NAME

  @ReactMethod
  fun syncPreference(preference: String) {
    val mode =
        when (preference) {
          "light" -> AppCompatDelegate.MODE_NIGHT_NO
          "dark" -> AppCompatDelegate.MODE_NIGHT_YES
          else -> AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
        }

    // AppCompatDelegate.applyDayNight can reconfigure activities synchronously and touch
    // Window/View (MainActivity.applySystemChromeColors). RN native methods run off the main
    // thread — marshal night-mode updates to the UI thread to avoid CalledFromWrongThreadException.
    runOnMainThread {
      AppCompatDelegate.setDefaultNightMode(mode)
      SettingsRepository.invalidateCache()
      WidgetUpdater.scheduleUpdate(reactApplicationContext.applicationContext, force = true)
    }
  }

  private fun runOnMainThread(action: () -> Unit) {
    if (Looper.myLooper() == Looper.getMainLooper()) {
      action()
    } else {
      mainHandler.post(action)
    }
  }

  companion object {
    const val NAME = "KeeptUiTheme"
  }
}
