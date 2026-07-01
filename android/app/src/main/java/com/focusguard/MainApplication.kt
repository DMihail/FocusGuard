package com.focusguard

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.focusguard.react.KeeptUiThemePackage
import com.focusguard.usage.LocalDayChangeScheduler
import com.nativeusagestats.NativeUsageStatsPackage
import com.tencent.mmkv.MMKV

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          add(NativeUsageStatsPackage())
          add(KeeptUiThemePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    MMKV.initialize(this)
    LocalDayChangeScheduler.schedule(this)
    loadReactNative(this)
  }
}
