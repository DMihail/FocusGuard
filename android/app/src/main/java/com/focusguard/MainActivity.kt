package com.focusguard

import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.core.content.ContextCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.WindowCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.focusguard.monitor.MonitoringBootResumeNotifier
import com.focusguard.monitor.MonitoringBootResumeStore
import com.focusguard.monitor.MonitoringStateRepository
import com.focusguard.monitor.MonitorServiceHelper
import com.focusguard.permissions.NotificationPermission
import com.focusguard.react.TurboModuleEventDispatchers
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {

  private val mainHandler = Handler(Looper.getMainLooper())

  override fun getMainComponentName(): String = "Keept"

  override fun onCreate(savedInstanceState: Bundle?) {
    installSplashScreen()
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    // Screen fragments must not be restored from saved state (react-native-screens).
    super.onCreate(savedInstanceState)
    applySystemChromeColors()
    resumeMonitoringAfterBootIfNeeded()
  }

  private fun resumeMonitoringAfterBootIfNeeded() {
    if (!MonitoringBootResumeStore.consumePending()) {
      return
    }

    if (!MonitoringStateRepository.isMonitoringEnabled()) {
      return
    }

    MonitorServiceHelper.start(applicationContext)
    MonitoringBootResumeNotifier.cancel(applicationContext)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    applySystemChromeColors()
  }

  private fun applySystemChromeColors() {
    if (Looper.myLooper() != Looper.getMainLooper()) {
      mainHandler.post { applySystemChromeColors() }
      return
    }

    val backgroundColor = ContextCompat.getColor(this, R.color.background)
    val isDark =
        (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) ==
            Configuration.UI_MODE_NIGHT_YES

    window.statusBarColor = backgroundColor
    window.navigationBarColor = backgroundColor
    WindowCompat.getInsetsController(window, window.decorView).apply {
      isAppearanceLightStatusBars = !isDark
      isAppearanceLightNavigationBars = !isDark
    }
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
  }

  override fun onRequestPermissionsResult(
      requestCode: Int,
      permissions: Array<out String>,
      grantResults: IntArray,
  ) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)

    if (requestCode == NotificationPermission.REQUEST_CODE_POST_NOTIFICATIONS) {
      TurboModuleEventDispatchers.emitPermissionsChanged(applicationContext)
    }
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
