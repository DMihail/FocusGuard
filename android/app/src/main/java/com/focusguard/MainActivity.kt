package com.focusguard

import android.content.Intent
import android.os.Bundle
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.WindowCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.focusguard.e2e.E2EBootstrap
import com.focusguard.e2e.E2EFeature
import com.focusguard.e2e.E2ELaunchArgs
import com.focusguard.permissions.NotificationPermission
import com.focusguard.permissions.PermissionEventEmitter
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Keept"

  override fun onCreate(savedInstanceState: Bundle?) {
    installSplashScreen()
    if (E2EFeature.isEnabled()) {
      E2ELaunchArgs.bindFromActivity(this)
      E2EBootstrap.applyFromCachedLaunchArgs()
    }
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    super.onCreate(savedInstanceState)
    applySystemChromeColors()
  }

  private fun applySystemChromeColors() {
    val backgroundColor = ContextCompat.getColor(this, R.color.background)
    window.statusBarColor = backgroundColor
    window.navigationBarColor = backgroundColor
    WindowCompat.getInsetsController(window, window.decorView).apply {
      isAppearanceLightStatusBars = false
      isAppearanceLightNavigationBars = false
    }
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    if (E2EFeature.isEnabled()) {
      E2ELaunchArgs.bindFromActivity(this)
      E2EBootstrap.applyFromCachedLaunchArgs()
    }
  }

  override fun onRequestPermissionsResult(
      requestCode: Int,
      permissions: Array<out String>,
      grantResults: IntArray,
  ) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)

    if (requestCode == NotificationPermission.REQUEST_CODE_POST_NOTIFICATIONS) {
      PermissionEventEmitter.emit(application)
    }
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
