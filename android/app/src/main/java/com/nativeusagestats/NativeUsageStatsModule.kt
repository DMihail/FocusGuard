package com.nativeusagestats

import android.app.AppOpsManager
import android.content.Intent
import android.os.Build
import android.os.Process
import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext

class NativeUsageStatsModule(reactContext: ReactApplicationContext) :
    NativeUsageStatsSpec(reactContext) {

  override fun checkForPermission(): Boolean = hasUsageStatsPermission()

  override fun requestUsageStatsPermission() {
    if (hasUsageStatsPermission()) {
      return
    }
    val intent =
        Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
          flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
    reactApplicationContext.startActivity(intent)
  }

  private fun hasUsageStatsPermission(): Boolean {
    val context = reactApplicationContext
    val appOps = context.getSystemService(AppOpsManager::class.java) ?: return false
    val mode =
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          appOps.unsafeCheckOpNoThrow(
              AppOpsManager.OPSTR_GET_USAGE_STATS,
              Process.myUid(),
              context.packageName,
          )
        } else {
          @Suppress("DEPRECATION")
          appOps.checkOpNoThrow(
              AppOpsManager.OPSTR_GET_USAGE_STATS,
              Process.myUid(),
              context.packageName,
          )
        }
    return mode == AppOpsManager.MODE_ALLOWED
  }

  companion object {
    const val NAME = NativeUsageStatsSpec.NAME
  }
}
