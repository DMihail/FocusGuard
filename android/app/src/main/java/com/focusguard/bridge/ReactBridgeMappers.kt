package com.focusguard.bridge

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.focusguard.apps.AppUsageInfo
import com.focusguard.apps.InstalledAppsRepository

/** Maps domain models to React Native bridge payloads. */
internal object ReactBridgeMappers {

    fun toInstalledAppsArray(apps: List<InstalledAppsRepository.InstalledApp>): WritableArray =
        Arguments.createArray().apply {
            for (app in apps) {
                pushMap(
                    Arguments.createMap().apply {
                        putString("packageName", app.packageName)
                        putString("appName", app.appName)
                        putString("appImage", app.appImage)
                        putString("category", app.category)
                    },
                )
            }
        }

    fun toUsageStatsArray(stats: List<AppUsageInfo>): WritableArray =
        Arguments.createArray().apply {
            for (info in stats) {
                pushMap(info.toWritableMap())
            }
        }

    private fun AppUsageInfo.toWritableMap(): WritableMap =
        Arguments.createMap().apply {
            putString("packageName", packageName)
            putString("appName", appName)
            putString("category", category)
            putString("appImage", appImage)
            putDouble("totalTimeForeground", totalTimeForeground.toDouble())
            putDouble("lastTimeUsed", lastTimeUsed.toDouble())
        }
}
