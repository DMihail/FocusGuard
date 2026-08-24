package com.focusguard

import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.focusguard.monitor.MonitoringResume
import com.focusguard.permissions.NotificationPermission
import com.focusguard.react.TurboModuleEventDispatchers
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "Keept"

  override fun onCreate(savedInstanceState: Bundle?) {
    installSplashScreen()
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    // Screen fragments must not be restored from saved state (react-native-screens).
    super.onCreate(savedInstanceState)
    SystemBarAppearance.apply(this)
    // After update/boot, FGS may be off while MMKV still says monitoring is on.
    MonitoringResume.ensureRunning(this)
  }

  override fun onResume() {
    super.onResume()
    // Retry if onCreate start was blocked or pending resume survived a failed attempt.
    MonitoringResume.ensureRunning(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    SystemBarAppearance.apply(this)
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
