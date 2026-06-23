package com.focusguard.react

import androidx.appcompat.app.AppCompatDelegate
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/** Syncs JS theme preference with native DayNight resources (overlay, notifications). */
class KeeptUiThemeModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  @ReactMethod
  fun syncPreference(preference: String) {
    val mode =
        when (preference) {
          "light" -> AppCompatDelegate.MODE_NIGHT_NO
          "dark" -> AppCompatDelegate.MODE_NIGHT_YES
          else -> AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM
        }

    AppCompatDelegate.setDefaultNightMode(mode)
  }

  companion object {
    const val NAME = "KeeptUiTheme"
  }
}
