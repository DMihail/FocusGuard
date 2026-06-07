package com.focusguard

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.focusguard.e2e.E2EBootstrap
import com.focusguard.e2e.E2ELaunchArgs
import com.nativeusagestats.NativeUsageStatsPackage
import com.tencent.mmkv.MMKV

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          add(NativeUsageStatsPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    MMKV.initialize(this)

    if (BuildConfig.DEBUG || BuildConfig.E2E_ENABLED) {
      E2ELaunchArgs.bindFromInstrumentation()
      E2EBootstrap.applyFromCachedLaunchArgs()
    }

    loadReactNative(this)
  }
}
