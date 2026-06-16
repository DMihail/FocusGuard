package com.focusguard.react

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.focusguard.apps.InstalledAppsRepository

/** Maps domain models to React Native Turbo Module payloads. */
internal object ReactNativeMappers {

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

    fun toPackageUsageArray(usageByPackage: Map<String, Long>): WritableArray =
        Arguments.createArray().apply {
            for ((packageName, usageMs) in usageByPackage) {
                pushMap(
                    Arguments.createMap().apply {
                        putString("packageName", packageName)
                        putDouble("usageMs", usageMs.toDouble())
                    },
                )
            }
        }
}
