package com.keept.turbomodule

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class KeeptTurboModulePackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
      if (name == KeeptTurboModule.NAME) {
        KeeptTurboModule(reactContext)
      } else {
        null
      }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
        KeeptTurboModule.NAME to
            ReactModuleInfo(
                name = KeeptTurboModule.NAME,
                className = KeeptTurboModule::class.java.name,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true,
            ),
    )
  }
}
